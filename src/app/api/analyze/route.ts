import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runAnalysis } from "@/lib/analysis/orchestrator";
import { NextRequest } from "next/server";

export const maxDuration = 60; // Allow up to 60s for Vercel

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { websiteId, resume } = body;

  if (!websiteId) {
    return Response.json({ error: "websiteId is required" }, { status: 400 });
  }

  // Verify ownership
  const website = await prisma.website.findFirst({
    where: { id: websiteId, userId: session.user.id },
  });

  if (!website) {
    return Response.json({ error: "Website not found" }, { status: 404 });
  }

  // Check if a completed analysis already exists
  const existingAnalysis = await prisma.analysis.findFirst({
    where: { websiteId, status: "completed" },
    include: { results: true },
    orderBy: { startedAt: "desc" },
  });

  const completedCount = await prisma.analysis.count({
    where: { websiteId, status: "completed" },
  });
  const isRefreshSession = completedCount > 0;

  const isResume = resume === true && !!existingAnalysis;

  let previouslyScanned: string[] = [];
  if (isResume && existingAnalysis) {
    const prevTechResult = existingAnalysis.results.find((r: any) => r.module === "technical");
    if (prevTechResult && prevTechResult.data) {
      const techData = prevTechResult.data as any;
      if (techData.scannedPages && Array.isArray(techData.scannedPages)) {
        previouslyScanned = techData.scannedPages;
      }
    }
  }

  // Estimate page count for minimum coin validation
  let pageCountEstimate = 1;
  if (existingAnalysis) {
    const prevTechResult = existingAnalysis.results.find((r: any) => r.module === "technical");
    if (prevTechResult && prevTechResult.data) {
      const techData = prevTechResult.data as any;
      if (techData.scannedPages && Array.isArray(techData.scannedPages)) {
        pageCountEstimate = techData.scannedPages.length || 1;
      }
    }
  }

  

  // Dynamic minimum coins
  let minCoinsRequired = 1.0;
  if (isResume) {
    // Resume rate: if it was a refresh session (completedCount > 1), rate is 0.2, else 1.0
    const resumeRate = completedCount > 1 ? 0.2 : 1.0;
    minCoinsRequired = resumeRate;
  } else {
    // Starting from scratch
    if (isRefreshSession) {
      // Refresh audit: 0.2 per page
      minCoinsRequired = 0.2 * pageCountEstimate;
    } else {
      // First scan: 1.0 per page
      minCoinsRequired = 1.0;
    }
  }

  // Retrieve user coins balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { coins: true },
  });

  if (!user || user.coins < minCoinsRequired) {
    return Response.json(
      {
        error: `Insufficient coins. This analysis requires at least ${minCoinsRequired.toFixed(1)} coins. Your balance: ${
          user?.coins ?? 0
        } coins.`,
      },
      { status: 400 }
    );
  }

  // Create analysis record
  const analysis = await prisma.analysis.create({
    data: {
      websiteId,
      status: "running",
    },
  });

  try {
    // Run the analysis passing options for coin-capping and results merging
    const result = await runAnalysis(website.url, {
      userCoins: user.coins,
      previouslyScannedPages: previouslyScanned,
      previousModules: isResume ? (existingAnalysis?.results || []).map((r: any) => ({
        module: r.module as any,
        status: r.status as any,
        score: r.score ?? 0,
        data: (r.data || {}) as any,
        issues: (r.issues || []) as any,
        executionTimeMs: r.executionTimeMs ?? 0,
      })) : [],
    });

    // Calculate final coins cost based on pending vs refreshed pages crawled in this run
    const crawled = result.crawledInThisRun || [];
    let cost = 0;
    let newlyCrawledPendingCount = 0;
    let newlyCrawledRefreshedCount = 0;

    if (isResume) {
      const resumeRate = completedCount > 1 ? 0.2 : 1.0;
      const newlyCrawledPending = crawled.filter((p: string) => !previouslyScanned.includes(p));
      const newlyCrawledRefreshed = crawled.filter((p: string) => previouslyScanned.includes(p));
      newlyCrawledPendingCount = newlyCrawledPending.length;
      newlyCrawledRefreshedCount = newlyCrawledRefreshed.length;
      cost = newlyCrawledPendingCount * resumeRate + newlyCrawledRefreshedCount * 0.2;
    } else {
      // Starting from scratch: rate is 0.2 for refresh session, 1.0 for first audit
      const rate = isRefreshSession ? 0.2 : 1.0;
      cost = crawled.length * rate;
      if (isRefreshSession) {
        newlyCrawledRefreshedCount = crawled.length;
      } else {
        newlyCrawledPendingCount = crawled.length;
      }
    }

    // Save results sequentially — avoid transaction timeout on Neon/PlanetScale
    // (batch $transaction defaults to 5s which is too short for 10+ module inserts)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { coins: { decrement: cost } },
    });
    await prisma.coinTransaction.create({
      data: {
        userId: session.user.id,
        amount: -cost,
        description: `${isResume ? "Resume Audit" : (isRefreshSession ? "Refresh Audit" : "Scan")}: ${website.url} (${newlyCrawledPendingCount} pending, ${newlyCrawledRefreshedCount} refresh)`,
      },
    });
    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: "completed",
        overallScore: result.overallScore,
        completedAt: new Date(),
      },
    });
    // Insert module results one at a time to stay well under connection limits
    for (const mod of result.modules) {
      await prisma.analysisResult.create({
        data: {
          analysisId: analysis.id,
          module: mod.module,
          status: mod.status,
          score: mod.score,
          data: mod.data as object,
          issues: mod.issues as object[],
          executionTimeMs: mod.executionTimeMs,
        },
      });
    }

    // Fetch updated user coins balance
    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true },
    });

    return Response.json({
      id: analysis.id,
      status: "completed",
      overallScore: result.overallScore,
      modules: result.modules,
      coins: updatedUser?.coins ?? 200.0,
    });
  } catch (error) {
    // Update analysis as failed
    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: "failed",
        errorMessage:
          error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      },
    });

    return Response.json(
      {
        id: analysis.id,
        status: "failed",
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    );
  }
}
