import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

interface Metrics {
  timestamp: string;
  upvotes: number;
  commentCounts: number;
  subreddit: string;
  activeUsers: number;
}

export interface MetricsResponse {
  metrics: Metrics[];
  isNewSubreddit?: boolean;
  isCalculating?: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');
  const hours = parseInt(searchParams.get('hours') || '24');

  console.log('Fetching metrics for:', { subreddit, hours });

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit parameter is required' }, { status: 400 });
  }

  try {
    const metrics = await fetchStoredMetrics(subreddit, hours);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Metrics fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

async function fetchStoredMetrics(subreddit: string, hours: number): Promise<MetricsResponse> {
  // Check if this is a new subreddit by looking for any metrics
  const hasMetrics = await prismadb.subredditMetrics.findFirst({
    where: {
      subreddit: subreddit
    }
  });

  if (!hasMetrics) {
    return { metrics: [], isNewSubreddit: true };
  }

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - (hours * 60 * 60 * 1000));

  console.log('Current time:', new Date().toISOString());
  console.log('Fetching metrics from:', startTime.toISOString(), 'to:', endTime.toISOString());

  const metrics = await prismadb.subredditMetrics.findMany({
    where: {
      subreddit: subreddit,
      timestamp: {
        gte: startTime,
        lte: endTime
      }
    },
    orderBy: {
      timestamp: 'asc'
    }
  });

  // Add validation logging
  if (metrics.length > 0) {
    const oldestDate = new Date(metrics[0].timestamp);
    const newestDate = new Date(metrics[metrics.length - 1].timestamp);
    console.log('Actual data range:', {
      oldest: oldestDate.toISOString(),
      newest: newestDate.toISOString(),
      isOldestValid: oldestDate > startTime,
      isNewestValid: newestDate <= endTime
    });
  }

  console.log(`Found ${metrics.length} metrics for subreddit:`, subreddit);

  if (metrics.length === 0) {

    const totalMetrics = await prismadb.subredditMetrics.count({
      where: {
        subreddit: subreddit
      }
    });

    console.log('Total metrics available for subreddit:', totalMetrics);
    return { metrics: [], isCalculating: true };
  }

  // Add more detailed logging
  console.log('Time range of fetched metrics:', {
    oldest: metrics[0].timestamp,
    newest: metrics[metrics.length - 1].timestamp,
    count: metrics.length
  });

  return { 
    metrics: metrics.map((m: typeof metrics[0]) => ({
      timestamp: m.timestamp.toISOString(),
      upvotes: m.upvotes,
      commentCounts: m.commentCounts,
      activeUsers: m.activeUsers,
      subreddit: m.subreddit
    }))
  };
}