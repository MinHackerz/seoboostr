import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const analysis = await prisma.analysis.findFirst({
    where: {
      id,
      website: { userId: session.user.id },
    },
    include: {
      results: true,
      website: {
        select: { url: true, name: true },
      },
    },
  });

  if (!analysis) {
    return Response.json({ error: "Analysis not found" }, { status: 404 });
  }

  return Response.json({
    id: analysis.id,
    websiteId: analysis.websiteId,
    status: analysis.status,
    overallScore: analysis.overallScore,
    startedAt: analysis.startedAt,
    completedAt: analysis.completedAt,
    errorMessage: analysis.errorMessage,
    website: analysis.website,
    modules: analysis.results.map((r: typeof analysis.results[number]) => ({
      module: r.module,
      status: r.status,
      score: r.score ?? 0,
      data: r.data || {},
      issues: r.issues || [],
      executionTimeMs: r.executionTimeMs ?? 0,
    })),
  });
}
