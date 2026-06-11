import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { fetchPage, fetchSubpage } from "@/lib/analysis/fetcher";
import { parsePage } from "@/lib/analysis/parser";
import { technicalAnalyzer } from "@/lib/analysis/analyzers/technical";
import { onpageAnalyzer } from "@/lib/analysis/analyzers/onpage";
import { contentAnalyzer } from "@/lib/analysis/analyzers/content";
import { schemaAnalyzer } from "@/lib/analysis/analyzers/schema";
import { imagesAnalyzer } from "@/lib/analysis/analyzers/images";
import { sitemapAnalyzer } from "@/lib/analysis/analyzers/sitemap";
import { geoAnalyzer } from "@/lib/analysis/analyzers/geo";
import { sxoAnalyzer } from "@/lib/analysis/analyzers/sxo";
import { performanceAnalyzer } from "@/lib/analysis/analyzers/performance";

const ANALYZERS_MAP: Record<string, any> = {
  technical: technicalAnalyzer,
  onpage: onpageAnalyzer,
  content: contentAnalyzer,
  schema: schemaAnalyzer,
  images: imagesAnalyzer,
  sitemap: sitemapAnalyzer,
  geo: geoAnalyzer,
  sxo: sxoAnalyzer,
  performance: performanceAnalyzer,
};

const SEVERITY_WEIGHTS: Record<string, Record<string, number>> = {
  sitemap: { critical: 30, high: 15, medium: 5, low: 2 },
  geo: { critical: 25, high: 15, medium: 5, low: 2 },
  technical: { critical: 25, high: 15, medium: 5, low: 2 },
  default: { critical: 20, high: 10, medium: 5, low: 2 }
};

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { issue, websiteId } = body;

    if (!issue || !issue.id || !issue.moduleName || !websiteId) {
      return Response.json({ error: "Invalid payload. Missing issue id, moduleName, or websiteId." }, { status: 400 });
    }

    const website = await prisma.website.findFirst({
      where: { id: websiteId, userId: session.user.id },
    });

    if (!website) {
      return Response.json({ error: "Website not found" }, { status: 404 });
    }

    const analyzer = ANALYZERS_MAP[issue.moduleName];
    if (!analyzer) {
      return Response.json({ error: `Analyzer not found for module: ${issue.moduleName}` }, { status: 400 });
    }

    const isSiteWide = issue.moduleName === "sitemap";
    const targetUrl = issue.url || website.url;

    // Fetch and parse target URL
    let fetchResult;
    if (isSiteWide || targetUrl.toLowerCase() === website.url.toLowerCase()) {
      fetchResult = await fetchPage(targetUrl);
    } else {
      fetchResult = await fetchSubpage(targetUrl);
    }

    const parsedPage = parsePage(fetchResult.html, fetchResult.finalUrl);

    // Run analyzer
    const runResult = await analyzer.analyze(parsedPage, fetchResult);
    
    // Check if the specific issue is still present
    const newIssuesForPage = runResult.issues || [];
    const isIssueStillPresent = newIssuesForPage.some((i: any) => i.id === issue.id);

    const isFixed = !isIssueStillPresent;

    if (!isFixed) {
      // Find the latest completed AiFix record and update it to "failed"
      // because the verification failed (issue still exists).
      const latestFix = await prisma.aiFix.findFirst({
        where: {
          userId: session.user.id,
          websiteId,
          issueId: issue.id,
          status: "completed",
        },
        orderBy: { createdAt: "desc" },
      });

      if (latestFix) {
        await prisma.aiFix.update({
          where: { id: latestFix.id },
          data: {
            status: "failed",
            explanation: "Verification failed: The issue was still found present on the page.",
          },
        });
      }
    }

    // Retrieve the latest completed analysis for this website
    const latestAnalysis = await prisma.analysis.findFirst({
      where: { websiteId, status: "completed" },
      orderBy: { startedAt: "desc" },
    });

    if (!latestAnalysis) {
      return Response.json({ isFixed, success: true });
    }

    // Retrieve the specific module result record
    const moduleResultRecord = await prisma.analysisResult.findFirst({
      where: { analysisId: latestAnalysis.id, module: issue.moduleName },
    });

    if (!moduleResultRecord) {
      return Response.json({ isFixed, success: true });
    }

    // Update the database issues and score
    // 1. Parse current combined issues list
    const currentCombinedIssues = (moduleResultRecord.issues as any[]) || [];

    // 2. Filter out old issues for this specific page URL
    const cleanCombinedIssues = currentCombinedIssues.filter((i: any) => (i.url || website.url) !== targetUrl);

    // 3. Add the newly generated page issues (marked with their URL)
    const newPageIssuesLabeled = newIssuesForPage.map((i: any) => ({
      ...i,
      url: targetUrl,
    }));

    const nextCombinedIssues = [...cleanCombinedIssues, ...newPageIssuesLabeled];

    // 4. Recalculate score
    const moduleData = (moduleResultRecord.data as Record<string, any>) || {};
    const scannedPages = (moduleData.scannedPages as string[]) || [targetUrl];

    let totalScoreSum = 0;
    const weights = SEVERITY_WEIGHTS[issue.moduleName] || SEVERITY_WEIGHTS.default;

    scannedPages.forEach((pageUrl) => {
      const pageIssues = nextCombinedIssues.filter((i: any) => (i.url || website.url) === pageUrl);
      const crit = pageIssues.filter((i: any) => i.severity === "critical").length;
      const h = pageIssues.filter((i: any) => i.severity === "high").length;
      const med = pageIssues.filter((i: any) => i.severity === "medium").length;
      const l = pageIssues.filter((i: any) => i.severity === "low").length;
      const pScore = Math.max(0, 100 - (crit * weights.critical + h * weights.high + med * weights.medium + l * weights.low));
      totalScoreSum += pScore;
    });

    const nextModuleScore = Math.round(totalScoreSum / scannedPages.length);

    // Save back to db
    await prisma.analysisResult.update({
      where: { id: moduleResultRecord.id },
      data: {
        issues: nextCombinedIssues as any,
        score: nextModuleScore,
      },
    });

    // Recalculate overall score for the analysis
    const allModulesResults = await prisma.analysisResult.findMany({
      where: { analysisId: latestAnalysis.id },
    });

    const allModules = allModulesResults.map((m) => {
      if (m.module === issue.moduleName) {
        return { ...m, score: nextModuleScore };
      }
      return m;
    });

    const MODULE_WEIGHTS: Record<string, number> = {
      technical: 0.15,
      onpage: 0.15,
      content: 0.15,
      schema: 0.10,
      images: 0.10,
      sitemap: 0.05,
      geo: 0.05,
      sxo: 0.10,
      performance: 0.05,
      pagespeed: 0.10,
    };

    let totalWeight = 0;
    let weightedSum = 0;

    allModules.forEach((m) => {
      if (m.status === "completed" && m.score !== null) {
        const weight = MODULE_WEIGHTS[m.module] || 0.1;
        weightedSum += m.score * weight;
        totalWeight += weight;
      }
    });

    const nextOverallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

    // Update overall analysis score
    await prisma.analysis.update({
      where: { id: latestAnalysis.id },
      data: {
        overallScore: nextOverallScore,
      },
    });

    // Return the updated analysis to the client
    const updatedFullAnalysis = await prisma.analysis.findUnique({
      where: { id: latestAnalysis.id },
      include: {
        results: true,
      },
    });

    const formattedAnalysis = {
      id: updatedFullAnalysis?.id,
      status: updatedFullAnalysis?.status,
      overallScore: updatedFullAnalysis?.overallScore,
      modules: updatedFullAnalysis?.results.map((r) => ({
        id: r.id,
        analysisId: r.analysisId,
        module: r.module,
        status: r.status,
        score: r.score,
        data: r.data,
        issues: r.issues,
        executionTimeMs: r.executionTimeMs,
      })),
    };

    return Response.json({
      success: true,
      isFixed,
      analysis: formattedAnalysis,
    });
  } catch (error) {
    console.error("Error verifying issue fix:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}
