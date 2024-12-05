const cron = require('node-cron');
const prismadb = require('../lib/prismadb').default;
const reddit = require('../lib/reddit').default;

interface SubredditData {
  subreddit: {
    name: string;
  }
}

async function startCronJob() {
  console.log('Starting cron job...');
  
  try {
    await cleanupOldMetrics();
    
    cron.schedule('*/5 * * * *', async () => {
      const now = new Date();
      console.log('Running metrics update at:', now.toISOString());
      
      try {
        const subreddits = await prismadb.userSubreddit.findMany({
          select: { subreddit: true },
          distinct: ['subredditId']
        });
        
        console.log(`Processing ${subreddits.length} subreddits`);
        
        await Promise.allSettled(
          subreddits.map(async (sub: SubredditData) => {
            try {
              const metrics = await reddit.getSubredditInfo(sub.subreddit.name, now);
              await prismadb.subredditMetrics.create({
                data: {
                  subreddit: sub.subreddit.name,
                  activeUsers: metrics.activeUsers,
                  subscribers: metrics.subscribers,
                  commentCounts: metrics.commentCounts,
                  upvotes: metrics.upvotes,
                  timestamp: now
                }
              });
            } catch (error) {
              console.error(`Failed to process ${sub.subreddit.name}:`, error);
            }
          })
        );
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