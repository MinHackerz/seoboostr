import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runSingleModuleAnalysis, calculateOverallScore } from "@/lib/analysis/orchestrator";
import { NextRequest } from "next/server";

export const maxDuration = 60; // Allow up to 60s for Vercel

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { analysisId, module: moduleName } = body;

    if (!analysisId || !moduleName) {
      return Response.json({ error: "analysisId and module are required" }, { status: 400 });
    }

    // Verify ownership of website and analysis
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: analysisId,
        website: { userId: session.user.id },
      },
      include: {
        website: true,
      },
    });

    if (!analysis) {
      return Response.json({ error: "Analysis not found or unauthorized" }, { status: 404 });
    }

    // Get scanned pages from technical module or fall back to website URL
    const technicalResult = await prisma.analysisResult.findFirst({
      where: { analysisId, module: "technical" },
    });

    let previouslyScanned: string[] = [];
    if (technicalResult && technicalResult.data) {
      const data = technicalResult.data as any;
      if (Array.isArray(data.scannedPages)) {
        previouslyScanned = data.scannedPages;
      }
    }

    if (previouslyScanned.length === 0) {
      previouslyScanned = [analysis.website.url];
    }

    // Cost: 0.5 credit per page
    const pageCount = previouslyScanned.length;
    const rate = 0.5;
    const cost = pageCount * rate;

    // Check user coins balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true },
    });

    if (!user || user.coins < cost) {
      return Response.json(
        {
          error: `Insufficient credits. This module refresh requires at least ${cost.toFixed(2)} credits. Your balance: ${
            user?.coins ?? 0
          } credits.`,
        },
        { status: 400 }
      );
    }

    // Run module-scoped analysis
    console.log(`[Module Refresh] Starting refresh for ${moduleName} on ${analysis.website.url}...`);
    const result = await runSingleModuleAnalysis(analysis.website.url, moduleName, {
      previouslyScannedPages: previouslyScanned,
    });

    // Save results
    const analysisResult = await prisma.analysisResult.upsert({
      where: {
        analysisId_module: {
          analysisId,
          module: moduleName,
        },
      },
      update: {
        status: "completed",
        score: result.score,
        data: result.data as any,
        issues: result.issues as any,
        executionTimeMs: result.executionTimeMs,
      },
      create: {
        analysisId,
        module: moduleName,
        status: "completed",
        score: result.score,
        data: result.data as any,
        issues: result.issues as any,
        executionTimeMs: result.executionTimeMs,
      },
    });

    // Deduct coins & create transaction
    await prisma.user.update({
      where: { id: session.user.id },
      data: { coins: { decrement: cost } },
    });

    await prisma.coinTransaction.create({
      data: {
        userId: session.user.id,
        amount: -cost,
        description: `Refresh module ${moduleName}: ${analysis.website.url} (${pageCount} pages)`,
      },
    });

    // Recalculate overall score
    const allResults = await prisma.analysisResult.findMany({
      where: { analysisId },
    });

    const formattedResults = allResults.map(r => ({
      module: r.module,
      status: r.status,
      score: r.score ?? 0,
    }));

    const overallScore = calculateOverallScore(formattedResults);

    await prisma.analysis.update({
      where: { id: analysisId },
      data: { overallScore },
    });

    // Fetch updated user coins balance
    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true },
    });

    console.log(`[Module Refresh] ${moduleName} refresh completed successfully.`);

    return Response.json({
      moduleResult: {
        id: analysisResult.id,
        analysisId: analysisResult.analysisId,
        module: analysisResult.module,
        status: analysisResult.status,
        score: analysisResult.score,
        data: analysisResult.data,
        issues: analysisResult.issues,
        executionTimeMs: analysisResult.executionTimeMs,
      },
      overallScore,
      coins: updatedUser?.coins ?? user.coins,
    });
  } catch (error) {
    console.error("[Module Refresh] Execution error:", error);
    return Response.json(
      {
        error: "Failed to perform module-scoped audit: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
