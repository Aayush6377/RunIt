import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, description } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        githubTokens: true
      }
    });

    const githubAccount = dbUser?.githubTokens[0];
    const token = githubAccount?.token;

    if (!token) {
      return NextResponse.json({ success: false, message: "GitHub account not connected" }, { status: 403 });
    }

    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "RunIt-Playground-App",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        description: description || `Created via RunIt Playground`,
        public: true,
        files: {
          [title]: { content }
        }
      })
    });

    console.log(response);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.message || "Failed to push to GitHub" }, { status: response.status });
    }

    return NextResponse.json({ success: true, data: { url: data.html_url } }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}