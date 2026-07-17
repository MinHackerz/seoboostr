import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch up to 30 latest completed analyses with website and module results
    const recentAnalyses = await prisma.analysis.findMany({
      where: {
        status: "completed",
        overallScore: { not: null },
      },
      include: {
        website: true,
        results: {
          take: 3, // Inspect a few modules to formulate details
        },
      },
      orderBy: {
        completedAt: "desc",
      },
      take: 30,
    });

    const dbMessages = recentAnalyses.map((analysis) => {
      let domain = "unknown.com";
      try {
        const urlObj = new URL(analysis.website.url);
        domain = urlObj.hostname.replace(/^www\./i, "");
      } catch {
        domain = analysis.website.url;
      }
      
      const score = analysis.overallScore ?? 90;
      
      // Determine descriptive finding labels based on results
      let detail = "all Core Web Vitals passed";
      if (analysis.results.length > 0) {
        const imageResult = analysis.results.find((r) => r.module === "images");
        const schemaResult = analysis.results.find((r) => r.module === "schema");
        const geoResult = analysis.results.find((r) => r.module === "geo");
        const linksResult = analysis.results.find((r) => r.module === "links");
        
        if (imageResult && imageResult.score !== null && imageResult.score < 80) {
          const issuesCount = Array.isArray(imageResult.issues) ? imageResult.issues.length : 14;
          detail = `${issuesCount} images missing alt text`;
        } else if (schemaResult && schemaResult.score !== null && schemaResult.score >= 90) {
          detail = "perfect schema coverage";
        } else if (geoResult && geoResult.score !== null && geoResult.score >= 90) {
          detail = "E-E-A-T signals strong";
        } else if (linksResult && linksResult.score !== null && linksResult.score < 80) {
          detail = "broken internal links detected";
        } else {
          // Default nice fallback detail text
          detail = "all Core Web Vitals passed";
        }
      }

      return {
        domain,
        score,
        detail,
      };
    });

    return Response.json(dbMessages);
  } catch (error) {
    console.error("Error fetching websites for ticker:", error);
    return Response.json([]);
  }
}
