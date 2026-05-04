import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        githubTokens: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const hasGithubToken = dbUser?.githubTokens.length ?  dbUser.githubTokens.length > 0 : false;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: dbUser?.id,
          name: dbUser?.name,
          email: dbUser?.email,
          image: dbUser?.image,
          username: dbUser?.username,
        },
        preferences: {
          theme: dbUser?.theme,
          vimMode: dbUser?.vimMode,
          autoSave: dbUser?.autoSave,
          defaultLanguage: dbUser?.defaultLanguage,
          terminalPosition: dbUser?.terminalPosition
        }, 
        hasGithubToken
      }
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}