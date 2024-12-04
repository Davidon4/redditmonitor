import cron from 'node-cron';
import prismadb from '@/lib/reddit';
import reddit from '@/lib/reddit';

// Run every 5 minutes
export async function startCronJob() {
  console.log('Starting cron job...');
  
  // Add this cleanup call before starting the cron job
  await reddit.cleanupFutureMetrics();
  
  cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    console.log('Running cron job at:', now.toISOString());
    
    try {
      const subreddits = await prismadb.userSubreddit.findMany({
          select: { subreddit: true },
          distinct: ['subredditId']
      });
      
      console.log(`Found ${subreddits.length} subreddits to track`);
      
      for (const sub of subreddits) {
          try {
              const metrics = await reddit.getSubredditInfo(sub.subreddit.name, now);
              await reddit.storeSubredditMetrics(sub.subreddit.name, {
                  ...metrics,
                  timestamp: now  // Pass the same timestamp
              });
          } catch (error) {
              console.error(`Failed to process subreddit ${sub.subreddit.name}:`, error);
          }
      }
  } catch (error) {
      console.error('Cron job error:', error);
  }
});
console.log('Cron job scheduled');
}