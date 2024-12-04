import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');
  const start = parseInt(searchParams.get('start') || '0');
  const end = parseInt(searchParams.get('end') || '0');

  if (!subreddit || !start || !end) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const activeUsersHistory = await prismadb.subredditMetrics.findMany({
      where: {
        subreddit: subreddit,
        timestamp: {
          gte: new Date(start * 1000),
          lte: new Date(end * 1000)
        }
      },
      select: {
        activeUsers: true,
        upvotes: true,      
        commentCounts: true,
        timestamp: true
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    return NextResponse.json(activeUsersHistory);
  } catch (error) {
    console.error('Failed to fetch historical active users:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}