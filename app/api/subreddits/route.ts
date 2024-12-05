import { NextResponse } from 'next/server';
import Snoowrap from 'snoowrap';

interface SubredditInfo {
  name: string;
  display_name: string;
  subscribers: number;
  public_description?: string;
  description?: string;
  over18: boolean;
  quarantine: boolean;
}

const reddit = new Snoowrap({
  userAgent: 'web:reddimon:v1.0.0 (by /u/Ezeluaku)',
  clientId: process.env.REDDIT_CLIENT_ID!,
  clientSecret: process.env.REDDIT_CLIENT_SECRET!,
  username: process.env.REDDIT_USERNAME!,
  password: process.env.REDDIT_PASSWORD!
});

// Configure rate limiting
reddit.config({
  requestDelay: 1100,  // 1.1 seconds between requests
  maxRetryAttempts: 3,
  continueAfterRatelimitError: true,
  retryErrorCodes: [502, 503, 504, 522]
});


const CACHE_DURATION = 1000 * 60 * 5;
const searchCache = new Map();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword')?.toLowerCase();

  const cacheKey = `search_${keyword}`;
  const cachedResults = searchCache.get(cacheKey);

  if (cachedResults && Date.now()- cachedResults.timestamp < CACHE_DURATION) {
    return NextResponse.json(cachedResults.data)
  }

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    const searchResults = await reddit.search({
      query: keyword,
      time: 'year',
      sort: 'relevance',
      limit: 100
    });

    if (!Array.isArray(searchResults)) {
      return NextResponse.json({ error: 'Invalid search results' }, { status: 500 });
    }

    // Track subreddit activity
    const subredditStats = new Map();
    searchResults.forEach(post => {
      const subredditName = post.subreddit_name_prefixed.replace('r/', '');
      if (!subredditStats.has(subredditName)) {
        subredditStats.set(subredditName, {
          postCount: 0,
          totalComments: 0,
          totalScore: 0
        });
      }
      const stats = subredditStats.get(subredditName);
      stats.postCount += 1;
      stats.totalComments += post.num_comments || 0;
      stats.totalScore += post.score || 0;
    });

    // Get detailed info for top subreddits
    const subreddits = await Promise.all(
      Array.from(subredditStats.entries())
        .sort((a, b) => {
          const scoreA = a[1].totalScore + (a[1].totalComments * 2);
          const scoreB = b[1].totalScore + (b[1].totalComments * 2);
          return scoreB - scoreA;
        })
        .slice(0, 20)
        .map(async ([name]) => {
           return  reddit.getSubreddit(name).fetch()
           .then((subreddit) => {
            const subredditInfo = subreddit as unknown as SubredditInfo;
            const stats = subredditStats.get(name);
            
            const engagementScore = 
              (stats.totalScore / stats.postCount) + 
              (stats.totalComments / stats.postCount) * 2;

            return {
              id: subredditInfo.name,
              name: subredditInfo.display_name,
              subscribers: subredditInfo.subscribers,
              description: subredditInfo.public_description || subredditInfo.description,
              isNSFW: subredditInfo.over18,
              isQuarantined: subredditInfo.quarantine,
              relevanceScore: engagementScore,
              recentActivity: {
                posts: stats.postCount,
                avgComments: Math.round(stats.totalComments / stats.postCount),
                avgScore: Math.round(stats.totalScore / stats.postCount)
              }
            }
          })
          .catch (err => {
            console.error(`Error fetching subreddit ${name}:`, err);
            return null;
          })
        })
    );

    const filteredSubreddits = subreddits
      .filter(subreddit => 
        subreddit && 
        !subreddit.isNSFW && 
        !subreddit.isQuarantined && 
        subreddit.subscribers >= 500 &&
        !subreddit.name.match(/^(u_|admin|mod|bot)/i) &&
        subreddit.description && subreddit.description?.length > 0
      )
      .sort((a, b) => {
        const scoreA = (a!.relevanceScore * a!.recentActivity.posts);
        const scoreB = (b!.relevanceScore * b!.recentActivity.posts);
        return scoreB - scoreA;
      })
      .slice(0, 10);
    
      searchCache.set(cacheKey, {
        timestamp: Date.now(),
        data: filteredSubreddits
      });

    return NextResponse.json(filteredSubreddits);
    
  } catch (error) {
    console.error('Error fetching subreddits:', error);
    return NextResponse.json({ error: 'Failed to fetch subreddits' }, { status: 500 });
  }
}
