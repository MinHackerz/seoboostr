import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { decrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { url, name, initialResults } = body;

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL
  let normalizedUrl: string;
  try {
    const urlObj = new URL(
      url.startsWith("http") ? url : `https://${url}`
    );
    normalizedUrl = urlObj.origin + urlObj.pathname;
    // Remove trailing slash except for root
    if (normalizedUrl.endsWith("/") && normalizedUrl !== urlObj.origin + "/") {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
  } catch {
    return Response.json({ error: "Invalid URL format" }, { status: 400 });
  }

  try {
    // 1. Enforce demo mode restriction
    if (session.user.email === "demo@seoboostr.io" && normalizedUrl !== "https://rasid.in/") {
      return Response.json(
        { error: "Demo mode is restricted to rasid.in only." },
        { status: 400 }
      );
    }

    // 2. Enforce single website limit for normal users (if it's a new website URL)
    const existingWebsite = await prisma.website.findUnique({
      where: {
        userId_url: {
          userId: session.user.id,
          url: normalizedUrl,
        },
      },
    });

    if (!existingWebsite) {
      const websiteCount = await prisma.website.count({
        where: { userId: session.user.id },
      });
      if (websiteCount >= 1) {
        return Response.json(
          { error: "You are restricted to scanning a single website only." },
          { status: 400 }
        );
      }
    }

    const website = await prisma.website.upsert({
      where: {
        userId_url: {
          userId: session.user.id,
          url: normalizedUrl,
        },
      },
      update: {
        name: name || normalizedUrl,
      },
      create: {
        url: normalizedUrl,
        name: name || new URL(normalizedUrl).hostname,
        userId: session.user.id,
      },
    });

    // Save initialResults if provided, and no analysis exists
    if (Array.isArray(initialResults) && initialResults.length > 0) {
      const existingAnalysisCount = await prisma.analysis.count({
        where: { websiteId: website.id },
      });

      if (existingAnalysisCount === 0) {
        console.log(`[POST /api/websites] Saving ${initialResults.length} initial results for ${normalizedUrl}`);
        
        const validScores = initialResults
          .filter((res: any) => typeof res.score === "number" && res.score > 0)
          .map((res: any) => res.score);
        
        const overallScore = validScores.length > 0
          ? Math.round(validScores.reduce((a: number, b: number) => a + b, 0) / validScores.length)
          : 70;

        const analysis = await prisma.analysis.create({
          data: {
            websiteId: website.id,
            status: "completed",
            overallScore,
            completedAt: new Date(),
          },
        });

        for (const item of initialResults) {
          const dbModule = item.moduleId === "ai" ? "geo" : item.moduleId;
          await prisma.analysisResult.create({
            data: {
              analysisId: analysis.id,
              module: dbModule,
              status: "completed",
              score: item.score,
              issues: item.issuesList || [],
              data: { finding: item.finding },
            },
          });
        }
      }
    }

    return Response.json(website, { status: 201 });
  } catch (error) {
    console.error("Error saving website:", error);
    return Response.json(
      { error: "Failed to save website" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const websites = await prisma.website.findMany({
    where: { userId: session.user.id },
    include: {
      analyses: {
        orderBy: { startedAt: "desc" },
        take: 1,
        select: {
          id: true,
          status: true,
          overallScore: true,
          startedAt: true,
          completedAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const decryptedWebsites = websites.map((w) => ({
    ...w,
    githubPat: w.githubPat ? decrypt(w.githubPat) : null,
  }));

  return Response.json(decryptedWebsites);
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session?.user?.email === "demo@seoboostr.io") {
    return Response.json(
      { error: "Website name editing is disabled in demo mode." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id) {
      return Response.json({ error: "Website ID is required" }, { status: 400 });
    }

    const updatedWebsite = await prisma.website.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name: name || null,
      },
    });

    return Response.json(updatedWebsite);
  } catch (error) {
    console.error("Error updating website name:", error);
    return Response.json(
      { error: "Failed to update website name" },
      { status: 500 }
    );
  }
}

