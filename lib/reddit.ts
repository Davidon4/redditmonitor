import Snoowrap from "snoowrap";
import prismadb from "./prismadb";

interface RedditPost {
    created_utc: number;
    upvote_ratio: number;
    num_comments: number;
    num_crossposts: number;
    ups: number;
    name: string;   
}

interface SubredditMetrics {
    activeUsers: number;
    subscribers: number;
    upvotes?: number;
    commentCounts: number;
    timestamp?: Date;
  }

interface PostMetrics {
    id: string;
    ups: number;
    num_comments: number;
    created_utc: number;
}

interface GetPostsOptions {
  subredditName: string;
  limit: number;
  pageSize?: number;
  after?: string;
}

interface CachedPosts {
    posts: RedditPost[];
    timestamp: number;
  }

interface SubredditResponse {
  active_user_count: number;
  subscribers: number;
}

interface RedditPostResponse {
  id: string;
  ups: number;
  num_comments: number;
  created_utc: number;
}

class RedditClient {
private client: Snoowrap;
private requestQueue: Promise<unknown> = Promise.resolve();
private postsCache: Map<string, CachedPosts> = new Map();
private CACHE_DURATION = 5 * 60 * 1000;
private postMetricsCache: Map<string, PostMetrics[]> = new Map();

  constructor() {
    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET;
    const username = process.env.REDDIT_USERNAME;
    const password = process.env.REDDIT_PASSWORD;
    const userAgent = 'web:reddimon:v1.0.0 (by /u/Ezeluaku)';


  if (!clientId || !clientSecret || !username || !password) {
    throw new Error('Reddit API credentials not found in environment variables');
  }

  this.client = new Snoowrap({
    userAgent,
    clientId,
    clientSecret,
    username,
    password
  });

this.client.config({
    requestDelay: 1100,
    maxRetryAttempts: 3,
    continueAfterRatelimitError: true,
    retryErrorCodes: [502, 503, 504, 522]
})

void this.client.getMe();
console.log('Reddit client initialized');

setInterval(() => this.cleanupCache(), 60 * 60 * 1000);
}

private async throttledRequest<T>(request: () => Promise<T>): Promise<T> {
    const currentRequest = this.requestQueue
        .then(() => request())
        .catch((error: Error) => {
            throw error;
        });
    this.requestQueue = currentRequest.catch(() => {});
    return currentRequest;
}

// Update cache cleanup to keep 7 days of data
private cleanupCache() {
  const sevenDaysAgo = Date.now() / 1000 - (7 * 24 * 60 * 60);
  for (const [subreddit, posts] of this.postMetricsCache.entries()) {
    const recentPosts = posts.filter(post => post.created_utc >= sevenDaysAgo);
    if (recentPosts.length === 0) {
      this.postMetricsCache.delete(subreddit);
    } else {
      this.postMetricsCache.set(subreddit, recentPosts);
    }
  }
}

  async getNewPosts({ subredditName, limit }: GetPostsOptions): Promise<RedditPost[]> {
    const cacheKey = `${subredditName}-${limit}`;
    const cached = this.postsCache.get(cacheKey);

    // Return cached data if it's fresh
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.posts;
    }

    try {

        const requestLimit = Math.min(1000, limit);
        let allPosts: RedditPost[] = [];
        let after: string | null = null;
        let retryCount = 0;
        const maxRetries = 3;

        // Optimize batch size for larger requests
        const batchSize = requestLimit > 500 ? 100 : 25;

        while (allPosts.length < requestLimit) {
            try {

            const currentBatchSize = Math.min(batchSize, requestLimit - allPosts.length);

            const response = await this.throttledRequest(() => 
                this.client
                .getSubreddit(subredditName)
                .getNew({
                    limit: currentBatchSize,
                    after: after || undefined
                })
            );

        if(!Array.isArray(response)) {
            throw new Error('Expected array of posts from Reddit API');
          }

                if (response.length === 0) break;

                allPosts = allPosts.concat(response);
                after = response[response.length - 1].name;

                if (!after) break;

                await new Promise(resolve => setTimeout(resolve, batchSize === 25 ? 500 : 1100));
                
        } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) {
                console.error(`Failed after ${maxRetries} retries`);
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, retryCount)));
        }
    }

        const mappedPosts = allPosts.map(post => ({
            created_utc: post.created_utc,
            upvote_ratio: post.upvote_ratio,
            num_comments: post.num_comments,
            num_crossposts: post.num_crossposts,
            ups: post.ups,
            name: post.name 
        }));

        // Cache the results
      this.postsCache.set(cacheKey, {
        posts: mappedPosts,
        timestamp: Date.now()
      });

      return mappedPosts;
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        if (cached) {
            return cached.posts;
          }
        throw error;
    }
  }

  
  async getSubredditInfo(subredditName: string, timestamp?: Date): Promise<SubredditMetrics> {
    try {
      const fetchSubredditInfo = async () => {
      // Fetch posts from multiple time periods and sorts
      const [subreddit, hotPosts, newPosts, risingPosts] = await Promise.all([
        this.client.getSubreddit(subredditName).fetch() as Promise<SubredditResponse>,
        this.client.getSubreddit(subredditName).getTop({ time: 'week', limit: 100 }) as Promise<RedditPostResponse[]>,
        this.client.getSubreddit(subredditName).getHot({ limit: 50 }) as Promise<RedditPostResponse[]>,
        this.client.getSubreddit(subredditName).getNew({ limit: 50 }) as Promise<RedditPostResponse[]>,
        this.client.getSubreddit(subredditName).getRising({ limit: 50 }) as Promise<RedditPostResponse[]>
      ]);

      // Combine all posts and remove duplicates
      const allPosts = [...hotPosts, ...newPosts, ...risingPosts];
      const uniquePosts = Array.from(
        new Map(allPosts.map(post => [post.id, post])).values()
      );

      // Filter posts by age
      const sevenDaysAgo = Date.now() / 1000 - (7 * 24 * 60 * 60);
      const recentPosts = uniquePosts.filter(post => post.created_utc >= sevenDaysAgo);

      // Get previous metrics for these posts
      const previousMetrics = this.postMetricsCache.get(subredditName) || [];
        
      // Current metrics
      const currentMetrics = recentPosts.map(post => ({
        id: post.id,
        ups: post.ups,
        num_comments: post.num_comments,
        created_utc: post.created_utc
      }));

      // Calculate engagement (changes since last check)
        let newUpvotes = 0;
        let newComments = 0;
        const significantChanges: {
          postId: string;
          upvoteChange: number;
          commentChange: number;
          totalUpvotes?: number;
          totalComments?: number;
          isNew?: boolean;
          age: string;
        }[] = [];
        
        currentMetrics.forEach(current => {
        const previous = previousMetrics.find(p => p.id === current.id);

          if (previous) {
          const upvoteDiff = Math.max(0, current.ups - previous.ups);
          const commentDiff = Math.max(0, current.num_comments - previous.num_comments);

                    // Track posts with significant changes
                    if (upvoteDiff > 0 || commentDiff > 0) {
                      newUpvotes += upvoteDiff;
                      newComments += commentDiff;
                      
                      significantChanges.push({
                        postId: current.id,
                        upvoteChange: upvoteDiff,
                        commentChange: commentDiff,
                        totalUpvotes: current.ups,
                        totalComments: current.num_comments,
                        age: Math.floor((Date.now() / 1000 - current.created_utc) / 3600) + ' hours old'
                      });
                    }
          } else {
          // For new posts, only count if they have engagement
          if (current.ups > 0 || current.num_comments > 0) {
            newUpvotes += current.ups;
            newComments += current.num_comments;
            significantChanges.push({
            postId: current.id,
            upvoteChange: current.ups,
            commentChange: current.num_comments,
            isNew: true,
            age: Math.floor((Date.now() / 1000 - current.created_utc) / 3600) + ' hours old'
            });
          }
        }
        });

        // Update cache with current metrics
        this.postMetricsCache.set(subredditName, currentMetrics);

      // Log detailed engagement information
      if (significantChanges.length > 0) {
        console.log(`Active posts in r/${subredditName}:`, {
          totalNewUpvotes: newUpvotes,
          totalNewComments: newComments,
          activePostsCount: significantChanges.length,
          details: significantChanges.sort((a, b) => 
            (b.upvoteChange + b.commentChange) - (a.upvoteChange + a.commentChange)
          ).slice(0, 5) // Show top 5 most active posts
        });
      }

        return {
        activeUsers: subreddit.active_user_count || 0,
        subscribers: subreddit.subscribers || 0,
        commentCounts: newComments,
        upvotes: newUpvotes,
        timestamp: timestamp || new Date()
            };
          };
        
          return await this.throttledRequest(fetchSubredditInfo);
          } catch (error) {
              console.error(`Failed to fetch subreddit info for ${subredditName}:`, error);
              throw error;
            }
          }

async searchSubreddits(query: string, limit: number = 5) {
    try {
        const results = await this.throttledRequest(async () => {
            // Use search method with type parameter
            const searchResults = await this.client.search({
                query: `${query}`,
                limit: limit,
            });
            
            // Ensure we have an array and map it
            if (Array.isArray(searchResults)) {
                return searchResults.map(sub => sub.subreddit.display_name);
            } else {
                console.error('Unexpected search results format:', searchResults);
                return [];
            }
        });
        
        console.log('Processed results:', results);
        return results;
        
    } catch (error) {
        console.error("Failed to search subreddits:", error);
        return [];
    }
    }

async getSubredditHistory(subreddit: string, fromTimestamp: Date): Promise<SubredditMetrics[]> {
    try {
        const metrics = await prismadb.subredditMetrics.findMany({
        where: {
          subreddit: subreddit,
          timestamp: {
            gte: fromTimestamp
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return metrics.map((metric: {
        activeUsers: number;
        subscribers: number;
        upvotes: number;
        commentCounts: number;
        timestamp: Date;
      }) => ({
        activeUsers: metric.activeUsers,
        subscribers: metric.subscribers,
        upvotes: metric.upvotes,
        commentCounts: metric.commentCounts,
        timestamp: metric.timestamp
      }));
    } catch (error) {
      console.error(`Failed to fetch history for ${subreddit}:`, error);
      throw error;
    }
  }

  public async storeSubredditMetrics(subreddit: string, metrics: SubredditMetrics) {
    try {
      // Use the timestamp from metrics if provided, otherwise create a new UTC date
      const timestamp = metrics.timestamp || new Date();

        await prismadb.subredditMetrics.create({
            data: {
                subreddit,
                activeUsers: metrics.activeUsers || 0,
                subscribers: metrics.subscribers || 0,
                upvotes: metrics.upvotes || 0,
                commentCounts: metrics.commentCounts || 0,
                timestamp: timestamp
              }
      });

      console.log('Stored metrics for', subreddit, 'at:', timestamp.toISOString());
    } catch (error) {
      console.error(`Failed to store metrics for ${subreddit}:`, error);
    }
  }

  public async debugMetrics(subreddit: string) {
    const metrics = await prismadb.subredditMetrics.findMany({
        where: { subreddit },
        orderBy: { timestamp: 'desc' },
        take: 5
    });
    
    console.log('Recent metrics for', subreddit, ':', 
      metrics.map((m: { timestamp: Date; activeUsers: number; upvotes: number }) => ({
          timestamp: m.timestamp.toISOString(),
          activeUsers: m.activeUsers,
          upvotes: m.upvotes
      }))
    );
  }

  // Add this temporary cleanup method
  public async cleanupFutureMetrics() {
    try {
        const result = await prismadb.subredditMetrics.deleteMany({
            where: {
                timestamp: {
                    gt: new Date('2024-01-01')
                }
            }
        });
        console.log(`Deleted ${result.count} future metrics records`);
    } catch (error) {
        console.error('Failed to cleanup future metrics:', error);
    }
  }

  public async search(options: { 
    query: string; 
    time: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';  
    sort: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
    limit: number 
  }) {
    return this.throttledRequest(() => 
      this.client.search(options)
    );
  }
}

const redditClient = new RedditClient();
export default redditClient;
