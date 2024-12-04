import { NextResponse } from 'next/server';
import reddit from "../../../lib/reddit";
import prismadb from '../../../lib/prismadb';

// Convert to POST route handler
export async function POST(request: Request) {
  try {
    const { subredditNames } = await request.json();
    
    if (!Array.isArray(subredditNames) || subredditNames.length === 0) {
      return NextResponse.json({ error: 'No subreddits to track' }, { status: 400 });
    }

    await Promise.all(subredditNames.map(async (subredditName) => {
      try {
        const metrics = await reddit.getSubredditInfo(subredditName);
        
        const existingMetric = await prismadb.subredditMetrics.findFirst({
          where: {
            subreddit: subredditName,
            timestamp: {
              gte: new Date(Date.now() - 4 * 60 * 1000)
            }
          }
        });

        if (!existingMetric) {
          await reddit.storeSubredditMetrics(subredditName, metrics);
        }
      } catch (error) {
        console.error(`Error processing r/${subredditName}:`, error);
      }
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}