import { NextResponse } from "next/server";
import reddit from "../../../lib/reddit"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit parameter is required' }, { status: 400 });
  }

  try {
    // Get current active users
    const currentInfo = await reddit.getSubredditInfo(subreddit);
    const currentActiveUsers = currentInfo.activeUsers || 0;

    // Add to metrics array with timestamp
    const metric = {
      activeUsers: currentActiveUsers,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(metric);

  } catch (error) {
    console.error('Active users fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch active users' },
      { status: 500 }
    );
  }
}