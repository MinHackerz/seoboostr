import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { encrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { githubPat, githubRepo, websiteId } = body;

    console.log("[GitHub Settings] Received configuration request:", {
      websiteId,
      githubRepo,
      hasPat: !!githubPat,
    });

    if (!websiteId) {
      return Response.json({ error: "websiteId is required" }, { status: 400 });
    }

    let parsedRepo = githubRepo ? githubRepo.trim() : null;

    // Validate and auto-extract owner/repo if provided
    if (parsedRepo) {
      // If a full GitHub URL was pasted, auto-extract the owner/repo path
      if (parsedRepo.includes("github.com/")) {
        try {
          const urlPath = parsedRepo.split("github.com/")[1] || "";
          const parts = urlPath.split("/");
          if (parts[0] && parts[1]) {
            parsedRepo = `${parts[0]}/${parts[1]}`.replace(/\.git$/i, "");
          }
        } catch {
          console.warn("[GitHub Settings] Failed to parse URL, fallback to raw input:", parsedRepo);
        }
      }

      const repoPattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
      if (!repoPattern.test(parsedRepo)) {
        return Response.json(
          { error: "Invalid repository format. Must be 'owner/repo' or a GitHub URL." },
          { status: 400 }
        );
      }
    }

    // Update website configurations
    await prisma.website.update({
      where: { 
        id: websiteId,
        userId: session.user.id
      },
      data: {
        githubPat: githubPat ? encrypt(githubPat.trim()) : null,
        githubRepo: parsedRepo,
      },
    });

    console.log("[GitHub Settings] Connection saved successfully.");
    return Response.json({ success: true });
  } catch (error) {
    console.error("[GitHub Settings] Error saving settings:", error);
    return Response.json(
      { error: "Failed to update GitHub configuration: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
