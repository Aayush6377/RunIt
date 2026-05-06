import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const userInvolvedFilter = {
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } }
      ]
    };

    const [ allUserSnippets, collaborations, pendingInvites, recentRevisions ] = await Promise.all([
      prisma.snippet.findMany({
        where: userInvolvedFilter,
        select: { id: true, title: true, language: true, visibility: true, updatedAt: true, createdAt: true },
        orderBy: { updatedAt: "desc" }
      }),
      prisma.collaboration.count({ where: { userId: user.id } }),
      prisma.invitation.count({ where: { receiverId: user.id, status: "PENDING" } }),
      prisma.revision.findMany({
        where: { snippet: userInvolvedFilter },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" }
      })
    ]);

    const totalSnippets = allUserSnippets.length;
    const totalRevisions = recentRevisions.length;

    const languageCounts: Record<string, number> = {};
    allUserSnippets.forEach(snippet => {
      languageCounts[snippet.language] = (languageCounts[snippet.language] || 0) + 1;
    });
    
    const languageData = Object.entries(languageCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const activityMap: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; 
      activityMap[dateStr] = 0;
    }

    allUserSnippets.forEach(s => {
      const dateStr = s.createdAt.toISOString().split("T")[0];
      if (activityMap[dateStr] !== undefined) activityMap[dateStr] += 1;
    });

    recentRevisions.forEach(r => {
      const dateStr = r.createdAt.toISOString().split("T")[0];
      if (activityMap[dateStr] !== undefined) activityMap[dateStr] += 1;
    });

    const activityData = Object.entries(activityMap).map(([date, count]) => {
      const d = new Date(date);
      return {
        date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d),
        count
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalSnippets,
          collaborations,
          pendingInvites,
          totalRevisions
        },
        languageData,
        activityData,
        recentSnippets: allUserSnippets.slice(0, 5)
      }
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}