import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runAnalysis, calculateOverallScore } from "@/lib/analysis/orchestrator";
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
  let minCoinsRequired = 2.0;
  if (isResume) {
    // Resume rate: if it was a refresh session (completedCount > 1), rate is 4.5, else 2.0
    const resumeRate = completedCount > 1 ? 4.5 : 2.0;
    minCoinsRequired = resumeRate;
  } else {
    // Starting from scratch
    if (isRefreshSession) {
      // Refresh audit: 0.25 * 18 = 4.5 credits per page
      minCoinsRequired = 4.5 * pageCountEstimate;
    } else {
      // First scan: 2.0 per page
      minCoinsRequired = 2.0 * pageCountEstimate;
    }
  }

  const isDemoUser = session.user.email === "demo@seoptimised.com";

  // Retrieve user coins balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { coins: true },
  });

  if (!isDemoUser && (!user || user.coins < minCoinsRequired)) {
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

  if (isDemoUser) {
    const resultModules = existingAnalysis?.results || [];
    
    // We will save each module sequentially with a 200ms delay to simulate progress
    const modulesToSave = resultModules.map((r: any) => ({
      module: r.module,
      status: "completed",
      score: r.score ?? 80,
      data: (r.data || {}) as object,
      issues: (r.issues || []) as object[],
      executionTimeMs: r.executionTimeMs ?? 150,
    }));

    // If existingAnalysis had no modules, provide some basic mock modules
    if (modulesToSave.length === 0) {
      const defaultModules = [
        "technical", "onpage", "content", "schema", "images", "sitemap", 
        "geo", "sxo", "performance", "security", "links", "accessibility", 
        "international", "mobile", "indexability", "backlinks", "drift"
      ];
      for (const m of defaultModules) {
        modulesToSave.push({
          module: m,
          status: "completed",
          score: 90,
          data: { scannedPages: [website.url], pendingPages: [], discoveredPages: [website.url] },
          issues: [],
          executionTimeMs: 100,
        });
      }
    }

    // Sequentially save each module with a delay so frontend polling updates in real-time
    for (const mod of modulesToSave) {
      // 200ms delay per module
      await new Promise(resolve => setTimeout(resolve, 200));

      let dataToSave = mod.data as any;
      if (mod.module === "technical" && dataToSave) {
        dataToSave = {
          ...dataToSave,
          pendingPages: [],
          discoveredPages: dataToSave.scannedPages || [],
        };
      }

      await prisma.analysisResult.upsert({
        where: {
          analysisId_module: {
            analysisId: analysis.id,
            module: mod.module,
          },
        },
        update: {
          status: mod.status,
          score: mod.score,
          data: dataToSave,
          issues: mod.issues,
          executionTimeMs: mod.executionTimeMs,
        },
        create: {
          analysisId: analysis.id,
          module: mod.module,
          status: mod.status,
          score: mod.score,
          data: dataToSave,
          issues: mod.issues,
          executionTimeMs: mod.executionTimeMs,
        },
      });
    }

    // Calculate overall score
    const finalScore = calculateOverallScore(modulesToSave);

    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: "completed",
        overallScore: finalScore,
        completedAt: new Date(),
      },
    });

    const modulesOutput = modulesToSave.map(mod => {
      if (mod.module === "technical" && mod.data) {
        return {
          ...mod,
          data: {
            ...(mod.data as any),
            pendingPages: [],
            discoveredPages: (mod.data as any).scannedPages || [],
          }
        };
      }
      return mod;
    });

    return Response.json({
      id: analysis.id,
      status: "completed",
      overallScore: finalScore,
      modules: modulesOutput,
      coins: user?.coins ?? 200.0,
    });
  }

  try {
    // Run the analysis passing options for coin-capping and results merging
    const result = await runAnalysis(website.url, {
      userCoins: isDemoUser ? 5.0 : (user?.coins ?? 200.0),
      previouslyScannedPages: previouslyScanned,
      previousModules: isResume ? (existingAnalysis?.results || []).map((r: any) => ({
        module: r.module as any,
        status: r.status as any,
        score: r.score ?? 0,
        data: (r.data || {}) as any,
        issues: (r.issues || []) as any,
        executionTimeMs: r.executionTimeMs ?? 0,
      })) : [],
      onModuleComplete: async (mod) => {
        try {
          let dataToSave = mod.data as any;
          if (isDemoUser && mod.module === "technical" && dataToSave) {
            dataToSave = {
              ...dataToSave,
              pendingPages: [],
              discoveredPages: dataToSave.scannedPages || [],
            };
          }
          await prisma.analysisResult.upsert({
            where: {
              analysisId_module: {
                analysisId: analysis.id,
                module: mod.module,
              },
            },
            update: {
              status: mod.status,
              score: mod.score,
              data: dataToSave,
              issues: mod.issues as object[],
              executionTimeMs: mod.executionTimeMs,
            },
            create: {
              analysisId: analysis.id,
              module: mod.module,
              status: mod.status,
              score: mod.score,
              data: dataToSave,
              issues: mod.issues as object[],
              executionTimeMs: mod.executionTimeMs,
            },
          });
        } catch (err) {
          console.error(`[Real-time Save] Failed to save module result for ${mod.module}:`, err);
        }
      },
    });

    // Calculate final coins cost based on pending vs refreshed pages crawled in this run
    const crawled = result.crawledInThisRun || [];
    let cost = 0;
    let newlyCrawledPendingCount = 0;
    let newlyCrawledRefreshedCount = 0;

    if (isResume) {
      const rate = completedCount > 1 ? 4.5 : 2.0;
      const newlyCrawledPending = crawled.filter((p: string) => !previouslyScanned.includes(p));
      const newlyCrawledRefreshed = crawled.filter((p: string) => previouslyScanned.includes(p));
      newlyCrawledPendingCount = newlyCrawledPending.length;
      newlyCrawledRefreshedCount = newlyCrawledRefreshed.length;
      cost = crawled.length * rate;
    } else {
      // Starting from scratch: rate is 4.5 for refresh session, 2.0 for first audit
      const rate = isRefreshSession ? 4.5 : 2.0;
      cost = crawled.length * rate;
      if (isRefreshSession) {
        newlyCrawledRefreshedCount = crawled.length;
      } else {
        newlyCrawledPendingCount = crawled.length;
      }
    }

    // Save results sequentially — avoid transaction timeout on Neon/PlanetScale
    // (batch $transaction defaults to 5s which is too short for 10+ module inserts)
    if (!isDemoUser) {
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
    }
    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        status: "completed",
        overallScore: result.overallScore,
        completedAt: new Date(),
      },
    });

    // Fetch updated user coins balance
    const updatedUser = isDemoUser
      ? user
      : await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { coins: true },
        });

    let modulesOutput = result.modules;
    if (isDemoUser) {
      modulesOutput = result.modules.map(mod => {
        if (mod.module === "technical" && mod.data) {
          return {
            ...mod,
            data: {
              ...(mod.data as any),
              pendingPages: [],
              discoveredPages: (mod.data as any).scannedPages || [],
            }
          };
        }
        return mod;
      });
    }

    return Response.json({
      id: analysis.id,
      status: "completed",
      overallScore: result.overallScore,
      modules: modulesOutput,
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
