import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const maxDuration = 60; // Allow up to 60s for Vercel/slow PageSpeed API

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error: "Google PageSpeed Insights API Key is not configured in .env",
        code: "MISSING_API_KEY",
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { analysisId } = body;

    if (!analysisId) {
      return Response.json({ error: "analysisId is required" }, { status: 400 });
    }

    // Verify ownership of the analysis through website
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

    const targetUrl = analysis.website.url;

    // Fetch Mobile and Desktop PSI in parallel
    const runPsi = async (strategy: "mobile" | "desktop") => {
      const url = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        targetUrl
      )}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=${strategy}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`PageSpeed API error (${strategy}):`, errorText);
        throw new Error(`Google PageSpeed API failed with status ${response.status}: ${errorText}`);
      }

      return response.json();
    };

    console.log(`[PageSpeed] Starting audits for ${targetUrl}...`);
    const startTime = Date.now();
    const [mobileData, desktopData] = await Promise.all([
      runPsi("mobile"),
      runPsi("desktop"),
    ]);
    const executionTimeMs = Date.now() - startTime;

    // Parse Lighthouse details helper
    const parseLighthouse = (data: any) => {
      const lh = data.lighthouseResult;
      if (!lh) throw new Error("Invalid response format from PageSpeed Insights API");

      const categories = lh.categories || {};
      const audits = lh.audits || {};

      const scores = {
        performance: Math.round((categories.performance?.score || 0) * 100),
        accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((categories.seo?.score || 0) * 100),
      };

      const metrics = {
        fcp: {
          title: audits["first-contentful-paint"]?.title || "First Contentful Paint",
          displayValue: audits["first-contentful-paint"]?.displayValue || "N/A",
          score: audits["first-contentful-paint"]?.score ?? null,
        },
        lcp: {
          title: audits["largest-contentful-paint"]?.title || "Largest Contentful Paint",
          displayValue: audits["largest-contentful-paint"]?.displayValue || "N/A",
          score: audits["largest-contentful-paint"]?.score ?? null,
        },
        tbt: {
          title: audits["total-blocking-time"]?.title || "Total Blocking Time",
          displayValue: audits["total-blocking-time"]?.displayValue || "N/A",
          score: audits["total-blocking-time"]?.score ?? null,
        },
        cls: {
          title: audits["cumulative-layout-shift"]?.title || "Cumulative Layout Shift",
          displayValue: audits["cumulative-layout-shift"]?.displayValue || "N/A",
          score: audits["cumulative-layout-shift"]?.score ?? null,
        },
        speedIndex: {
          title: audits["speed-index"]?.title || "Speed Index",
          displayValue: audits["speed-index"]?.displayValue || "N/A",
          score: audits["speed-index"]?.score ?? null,
        },
        tti: {
          title: audits["interactive"]?.title || "Time to Interactive",
          displayValue: audits["interactive"]?.displayValue || "N/A",
          score: audits["interactive"]?.score ?? null,
        },
      };

      return { scores, metrics, lhAudits: audits };
    };

    const mobileParsed = parseLighthouse(mobileData);
    const desktopParsed = parseLighthouse(desktopData);

    // Extract issues from lighthouse audits (focusing on mobile first since it represents the most critical core mobile-first indexing concerns)
    const issues: any[] = [];
    const opportunitiesAudits = [
      "render-blocking-resources",
      "unused-javascript",
      "unused-css-rules",
      "uses-optimized-images",
      "uses-responsive-images",
      "offscreen-images",
      "modern-image-formats",
      "uses-text-compression",
      "efficient-animated-content",
      "dom-size",
      "server-response-time",
      "redirects",
    ];

    opportunitiesAudits.forEach((auditKey) => {
      const audit = mobileParsed.lhAudits[auditKey];
      if (audit && typeof audit.score === "number" && audit.score < 0.9) {
        let severity: "critical" | "high" | "medium" | "low" = "medium";
        if (audit.score < 0.4) {
          severity = "high";
        } else if (audit.score < 0.1) {
          severity = "critical";
        } else if (audit.score > 0.7) {
          severity = "low";
        }

        issues.push({
          id: `pagespeed-${auditKey}`,
          title: audit.title,
          description: audit.description || "Lighthouse performance optimization opportunity.",
          severity,
          recommendation: `Optimize this asset/resource following the Google Lighthouse guidelines. Check your script bundling, CSS imports, or image optimization.`,
          value: audit.displayValue || `Score: ${Math.round(audit.score * 100)}%`,
          url: targetUrl,
        });
      }
    });

    // Save or update pagespeed results in AnalysisResult
    const dataPayload = {
      mobile: {
        scores: mobileParsed.scores,
        metrics: mobileParsed.metrics,
      },
      desktop: {
        scores: desktopParsed.scores,
        metrics: desktopParsed.metrics,
      },
    };

    // Calculate score for the module (overall average performance score of mobile and desktop)
    const pagespeedScore = Math.round((mobileParsed.scores.performance + desktopParsed.scores.performance) / 2);

    const result = await prisma.analysisResult.upsert({
      where: {
        analysisId_module: {
          analysisId: analysis.id,
          module: "pagespeed",
        },
      },
      update: {
        status: "completed",
        score: pagespeedScore,
        data: dataPayload,
        issues: issues,
        executionTimeMs,
      },
      create: {
        analysisId: analysis.id,
        module: "pagespeed",
        status: "completed",
        score: pagespeedScore,
        data: dataPayload,
        issues: issues,
        executionTimeMs,
      },
    });

    console.log(`[PageSpeed] Audits completed successfully for ${targetUrl}`);

    return Response.json({
      module: "pagespeed",
      status: "completed",
      score: pagespeedScore,
      data: dataPayload,
      issues: issues,
      executionTimeMs,
    });
  } catch (error) {
    console.error("[PageSpeed] Execution error:", error);
    return Response.json(
      {
        error: "Failed to perform PageSpeed Insights audit: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
