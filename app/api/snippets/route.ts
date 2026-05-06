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
    
    const roleFilter = searchParams.get("role")?.toUpperCase() || "ALL";
    const searchFilter = searchParams.get("search") || "";
    const languageFilter = searchParams.get("language")?.toUpperCase() || "ALL";
    const visibilityFilter = searchParams.get("visibility")?.toUpperCase() || "ALL";
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (roleFilter === "OWNER") {
      whereClause.ownerId = user.id;
    } else if (["CO_OWNER", "EDITOR", "VIEWER"].includes(roleFilter)) {
      whereClause.collaborators = { some: { userId: user.id, role: roleFilter as Role } };
    } else {
      whereClause.OR = [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } }
      ];
    }

    if (searchFilter) {
      whereClause.title = { contains: searchFilter, mode: "insensitive" };
    }

    if (languageFilter !== "ALL" && Object.values(Language).includes(languageFilter as Language)) {
      whereClause.language = languageFilter as Language;
    }

    if (visibilityFilter !== "ALL" && Object.values(Visibility).includes(visibilityFilter as Visibility)) {
      whereClause.visibility = visibilityFilter as Visibility;
    }

    // Fetch data and calculate stats in parallel
    const [totalCount, snippets, totalOwned, totalShared] = await Promise.all([
      prisma.snippet.count({ where: whereClause }),
      prisma.snippet.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, name: true, username: true, image: true } },
          collaborators: {
            include: { user: { select: { id: true, name: true, username: true, image: true } } }
          }
        }
      }),
      prisma.snippet.count({ where: { ownerId: user.id } }), 
      prisma.snippet.count({ where: { collaborators: { some: { userId: user.id } } } }) 
    ]);

    return NextResponse.json({ 
      success: true, 
      data: snippets,
      meta: {
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        },
        stats: {
          totalOwned,
          totalShared,
          totalCombined: totalOwned + totalShared
        }
      }
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const createSnippetSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").default("Untitled"),
  fileName: z.string().min(1, "Filename cannot be empty").default("main"),
  language: z.nativeEnum(Language),
  content: z.string().default(""),
  visibility: z.nativeEnum(Visibility).default("PUBLIC"),
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

    const { title, fileName, language, content, visibility } = parsedData.data;

    const snippet = await prisma.snippet.create({
      data: {
        title,
        fileName,
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