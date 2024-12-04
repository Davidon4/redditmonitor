import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit parameter is required' }, { status: 400 });
  }

  try {
    // Get current metrics (most recent)
    const current = await prismadb.subredditMetrics.findFirst({
      where: { subreddit: subreddit },
      orderBy: { timestamp: 'desc' }
    });

    // Get previous metrics (second most recent)
    const previous = await prismadb.subredditMetrics.findFirst({
      where: { 
        subreddit: subreddit,
        timestamp: { lt: current?.timestamp }
      },
      orderBy: { timestamp: 'desc' }
    });
    console.log('Current metrics:', current);
    console.log('Previous metrics:', previous);

    return NextResponse.json({
      upvotes: {
        current: current?.upvotes || 0,
        previous: previous?.upvotes || 0
      },
      comments: {
        current: current?.commentCounts || 0,
        previous: previous?.commentCounts || 0
      },
      activeUsers: {
        current: current?.activeUsers || 0,
        previous: previous?.activeUsers || 0
      }
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}