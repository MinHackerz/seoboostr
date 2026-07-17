import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { decrypt } from "@/lib/encryption";
import { calculateOverallScore } from "@/lib/analysis/orchestrator";

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
    if (session.user.email === "demo@seoptimised.com" && normalizedUrl !== "https://rasid.in/") {
      return Response.json(
        { error: "Demo mode is restricted to rasid.in only." },
        { status: 400 }
      );
    }

    // 2. Enforce max 10 websites per user
    const existingWebsite = await prisma.website.findUnique({
      where: {
        userId_url: {
          userId: session.user.id,
          url: normalizedUrl,
        },
      },
      include: {
        _count: {
          select: { analyses: true },
        },
      },
    });

    if (!existingWebsite) {
      const websiteCount = await prisma.website.count({
        where: { userId: session.user.id },
      });
      if (websiteCount >= 10) {
        return Response.json(
          { error: `You have reached the maximum limit of 10 websites. Remove an existing website to add a new one.` },
          { status: 400 }
        );
      }
    }

    // Check user's balance if initialResults are provided
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true },
    });

    const hasExistingAnalysis = existingWebsite ? existingWebsite._count.analyses > 0 : false;
    const isInitialAudit = Array.isArray(initialResults) && initialResults.length > 0 && !hasExistingAnalysis;
    const cost = 2.0; // 1-page homepage audit cost is 2.0 credits

    if (isInitialAudit) {
      if (!user || user.coins < cost) {
        return Response.json(
          { error: `Insufficient credits. You need at least ${cost.toFixed(1)} credits to save and import this website's report.` },
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
        // Only overwrite name if explicitly provided — preserve user's custom name
        ...(name ? { name } : {}),
      },
      create: {
        url: normalizedUrl,
        name: name || new URL(normalizedUrl).hostname,
        userId: session.user.id,
      },
    });

    // Save initialResults if provided, and no analysis exists
    if (isInitialAudit) {
      const existingAnalysisCount = await prisma.analysis.count({
        where: { websiteId: website.id },
      });

      if (existingAnalysisCount === 0) {
        console.log(`[POST /api/websites] Saving ${initialResults.length} initial results for ${normalizedUrl}`);

        // Deduct credits and log transaction
        await prisma.user.update({
          where: { id: session.user.id },
          data: { coins: { decrement: cost } },
        });

        await prisma.coinTransaction.create({
          data: {
            userId: session.user.id,
            amount: -cost,
            description: `Imported Initial Audit: ${normalizedUrl}`,
          },
        });
        
        const formattedResults = initialResults.map((r: any) => ({
          module: r.moduleId === "ai" ? "geo" : r.moduleId,
          status: "completed",
          score: typeof r.score === "number" ? r.score : 0,
        }));

        const overallScore = formattedResults.length > 0
          ? calculateOverallScore(formattedResults)
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

  if (session?.user?.email === "demo@seoptimised.com") {
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

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session?.user?.email === "demo@seoptimised.com") {
    return Response.json(
      { error: "Deleting websites is disabled in demo mode." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Website ID is required" }, { status: 400 });
    }

    // Verify ownership before deleting
    const website = await prisma.website.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!website) {
      return Response.json({ error: "Website not found" }, { status: 404 });
    }

    // Cascading deletes handle analyses, results, and fixes via Prisma schema
    await prisma.website.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting website:", error);
    return Response.json(
      { error: "Failed to delete website" },
      { status: 500 }
    );
  }
}
