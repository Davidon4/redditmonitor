import { NextResponse } from 'next/server';
import Snoowrap from 'snoowrap';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit is required' }, { status: 400 });
  }

  const reddit = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT!,
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    username: process.env.REDDIT_USERNAME!,
    password: process.env.REDDIT_PASSWORD!,
  });

  try {
    // Get top 50 trending posts
    const posts = await reddit
      .getSubreddit(subreddit)
      .getTop({ time: 'week', limit: 50 });

    // Count frequencies and track engagement
    const frequencies: { [key: string]: { count: number; engagement: number } } = {};
    posts.forEach(post => {

    const combinedText = `${post.title} ${post.selftext || ''}`;

      const postWords = combinedText.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['what', 'when', 'where', 'which', 'who', 'why', 'how', 
          'this', 'that', 'with', 'from', 'your', 'have', 'will', 'would', 'could', 
          'should', 'them', 'then', 'than', 'just', 'like', 'been', 'were', 'they',
          'want', 'need', 'some', 'here', 'there', 'about', 'into', 'more', 'their',
          'removed', 'deleted', 'edit', 'updated', 'reddit'].includes(word));

      postWords.forEach(word => {
        if (!frequencies[word]) {
          frequencies[word] = { count: 0, engagement: 0 };
        }
        frequencies[word].count += 1;
        frequencies[word].engagement += post.score + post.num_comments;
      });
    });

    // Convert to array and sort by count, using engagement as tiebreaker
    const sortedKeywords = Object.entries(frequencies)
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        engagement: data.engagement
      }))
      .sort((a, b) => b.count === a.count ? 
        b.engagement - a.engagement : 
        b.count - a.count)
      .slice(0, 30); // Get top 20 keywords

    return NextResponse.json(sortedKeywords);
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 });
  }
}