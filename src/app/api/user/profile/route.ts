import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        coins: true,
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
        fixes: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            website: {
              select: {
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!userProfile) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
