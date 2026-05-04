import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Language, Visibility } from "@prisma/client";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    
    const roleFilter = searchParams.get("role") || "all";
    const searchFilter = searchParams.get("search") || "";
    const languageFilter = searchParams.get("language");

    const whereClause: any = {};

    if (roleFilter === "owner") {
      whereClause.ownerId = user.id;
    } else if (roleFilter === "editor") {
      whereClause.collaborators = { some: { userId: user.id } };
    } else {
      whereClause.OR = [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } }
      ];
    }

    if (searchFilter) {
      whereClause.title = {
        contains: searchFilter,
        mode: "insensitive",
      };
    }

    if (languageFilter && Object.values(Language).includes(languageFilter as Language)) {
      whereClause.language = languageFilter as Language;
    }

    const snippets = await prisma.snippet.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        owner: {
          select: { name: true, username: true, image: true }
        },
        collaborators: {
          include: {
            user: { select: { name: true, username: true, image: true } }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: snippets }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const createSnippetSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").default("Untitled"),
  language: z.nativeEnum(Language),
  content: z.string().default(""),
  visibility: z.nativeEnum(Visibility).default("PRIVATE"),
});

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = createSnippetSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: parsedData.error.issues[0].message }, { status: 400 });
    }

    const { title, language, content, visibility } = parsedData.data;

    const snippet = await prisma.snippet.create({
      data: {
        title,
        language,
        content,
        visibility,
        ownerId: user.id,
      },
    });

    return NextResponse.json({ success: true, message: "Snippet created successfully", data: { id: snippet.id } }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}