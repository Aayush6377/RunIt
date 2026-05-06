import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusTab = searchParams.get("tab") || "pending";
    const searchFilter = searchParams.get("search") || "";
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const whereClause: any = {
      receiverId: user.id
    };

    if (statusTab === "pending") {
      whereClause.status = "PENDING";
    } else if (statusTab === "past") {
      whereClause.status = { in: ["ACCEPTED", "REJECTED"] };
    }

    if (searchFilter) {
      whereClause.OR = [
        { snippet: { title: { contains: searchFilter, mode: "insensitive" } } },
        { sender: { username: { contains: searchFilter, mode: "insensitive" } } },
        { sender: { name: { contains: searchFilter, mode: "insensitive" } } }
      ];
    }

    const [totalCount, invitations, pendingCount, pastCount] = await Promise.all([
      prisma.invitation.count({ where: whereClause }),
      prisma.invitation.findMany({
        where: whereClause,
        include: {
          snippet: { select: { id: true, title: true, language: true } },
          sender: { select: { id: true, name: true, username: true, image: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.invitation.count({ where: { receiverId: user.id, status: "PENDING" } }),
      prisma.invitation.count({ where: { receiverId: user.id, status: { in: ["ACCEPTED", "REJECTED"] } } })
    ]);

    return NextResponse.json({ 
      success: true, 
      data: invitations,
      meta: {
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        },
        stats: {
          pending: pendingCount,
          past: pastCount,
          total: pendingCount + pastCount
        }
      }
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}