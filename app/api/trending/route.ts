import { NextResponse } from 'next/server';
import Snoowrap from 'snoowrap';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit parameter is required' }, { status: 400 });
  }

  const reddit = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT!,
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    username: process.env.REDDIT_USERNAME!,
    password: process.env.REDDIT_PASSWORD!,
  });

  try {
    const topPosts = await reddit
      .getSubreddit(subreddit)
      .getTop({ time: 'day', limit: 10 });

    const formattedPosts = topPosts.map(post => ({
      title: post.title, // Truncate title for better display
      score: post.score,
      comments: post.num_comments,
      created: post.created_utc * 1000,
      selftext: post.selftext
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching top posts:', error);
    return NextResponse.json({ error: 'Failed to fetch top posts' }, { status: 500 });
  }
}