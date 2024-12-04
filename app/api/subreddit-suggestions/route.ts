import { NextResponse } from 'next/server';
import redditClient from '@/lib/reddit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    console.log("Searching for query=>", query);
    const subreddits = await redditClient.searchSubreddits(query, 5);
    
    // Ensure we're returning an array of subreddit names
    const subredditNames = Array.isArray(subreddits) ? subreddits : [];

    console.log("Extracted Subreddits=>", subredditNames);
    return NextResponse.json(subredditNames.filter(Boolean));
  } catch (error) {
    console.error('Error fetching subreddit suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}