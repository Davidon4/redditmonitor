const cron = require('node-cron');
const prismadb = require('../lib/prismadb').default;
const reddit = require('../lib/reddit').default;

interface PostActivity {
  postId: string;
  upvoteChange: number;
  commentChange: number;
  totalUpvotes: number;
  totalComments: number;
  age: string;
}

interface SubredditActivity {
  totalNewUpvotes: number;
  totalNewComments: number;
  activePostsCount: number;
  details: PostActivity[];
}

async function startCronJob() {
  console.log('Starting cron job...');
  
  try {
    await cleanupOldMetrics();
    
    cron.schedule('*/10 * * * *', async () => {
      const now = new Date();
      console.log('Running metrics update at:', now.toISOString());
      
      try {
        const subreddits = await prismadb.userSubreddit.findMany({
          select: { subreddit: true },
          distinct: ['subredditId']
        });
        
        for (const sub of subreddits) {
          try {
            const activity: SubredditActivity = await reddit.getSubredditActivity(sub.subreddit.name);
            await prismadb.subredditMetrics.create({
              data: {
                subreddit: sub.subreddit.name,
                activeUsers: activity.activePostsCount,
                upvotes: activity.totalNewUpvotes,
                commentCounts: activity.totalNewComments,
                timestamp: now,
                postDetails: activity.details
              }
            });
            
            console.log(`Processed activity for r/${sub.subreddit.name}:`, activity);
          } catch (error) {
            console.error(`Failed to process ${sub.subreddit.name}:`, error);
          }
        }
      } catch (error) {
        console.error('Cron job execution error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to start cron job:', error);
  }
}

async function cleanupOldMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  try {
    await prismadb.subredditMetrics.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo
        }
      }
    });
    console.log('Cleaned up old metrics');
  } catch (error) {
    console.error('Failed to cleanup old metrics:', error);
  }
}

startCronJob();