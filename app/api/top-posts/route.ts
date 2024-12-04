import { NextResponse } from 'next/server';
import Snoowrap from 'snoowrap';
import { connectToDatabase} from "@/lib/mongodb";
import { EmotionCache } from "@/models/EmotionCache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');
  const limit = Number(searchParams.get('limit')) || 100;
  const timeframe = searchParams.get('timeframe') || 'week';

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit parameter is required' }, { status: 400 });
  }

  // Add retry logic for database connection
  let retries = 3;
  while (retries > 0) {
    try {
      await connectToDatabase();
      break; // Connection successful, exit loop
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Failed to connect to database after 3 attempts:', error);
        return NextResponse.json(
          { error: 'Database connection failed' }, 
          { status: 503 }
        );
      }
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  try {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Delete expired cache entries for this subreddit
    await EmotionCache.deleteMany({
    subreddit,
    weekEnd: { $lte: new Date() }
        });

    const cachedData = await EmotionCache.findOne({
        subreddit,
        weekStart: {$lte: new Date()},
        weekEnd: {$gt: new Date()}
    });

    if (cachedData) {
        console.log('Cache hit. Data type:', typeof cachedData.posts, 'Is Array:', Array.isArray(cachedData.posts));
        console.log('Cached data:', JSON.stringify(cachedData.posts).slice(0, 200)); // Log first 200 chars
        const posts = Array.isArray(cachedData.posts) ? cachedData.posts : [];
        return NextResponse.json(posts);
    }

  const reddit = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT!,
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    username: process.env.REDDIT_USERNAME!,
    password: process.env.REDDIT_PASSWORD!,
  });

    const topPosts = await reddit
      .getSubreddit(subreddit)
      .getTop({ time: timeframe as 'hour' | 'day' | 'week' | 'month' | 'year' | 'all', limit: limit });

      console.log('Reddit response type:', typeof topPosts, 'Is Array:', Array.isArray(topPosts));
      console.log('Reddit data:', JSON.stringify(topPosts).slice(0, 200)); // Log first 200 chars

    // Ensure topPosts is an array and has the expected structure
    if (!Array.isArray(topPosts)) {
        console.error('TopPosts is not an array:', topPosts);
        throw new Error('Reddit API did not return an array of posts');
    }

    const formattedPosts = topPosts.map(post => ({
      title: post.title,
      selftext: post.selftext,
      score: post.score,
      created: post.created_utc * 1000,
      url: post.url
    }));

    console.log('Formatted posts type:', typeof formattedPosts, 'Is Array:', Array.isArray(formattedPosts));

        // Verify formattedPosts is an array before caching
        if (!Array.isArray(formattedPosts)) {
            throw new Error('Failed to format posts array');
        }

    await EmotionCache.create({
        subreddit,
        posts: formattedPosts,
        lastFetched: new Date(),
        weekStart,
        weekEnd,
        emotions: []
    });

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching top posts:', error);
    return NextResponse.json({ error: 'Failed to fetch top posts' }, { status: 500 });
  }
}