"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { formatNumber } from "@/lib/utils";
import {useSubredditStore} from "@/lib/store/subreddit";
import {Loader2, AlertCircle} from "lucide-react";
import {Button} from "@/components/ui/button";

interface Post {
  title: string;
  selftext: string;
  score: number;
  created: number;
}

interface EmotionData {
  emotion: string;
  count: number;
  posts: Post[];
}

export default function EmotionChart() {
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {currentSubreddit} = useSubredditStore();
  console.log("Current Subreddit=>", currentSubreddit);

  useEffect(() => {
    async function fetchAndAnalyzeEmotions() {
      try {
        setIsLoading(true);
        // First, fetch top 100 posts from the past 7 days
        const response = await fetch(`/api/top-posts?subreddit=${currentSubreddit}&limit=100&timeframe=week`);
        const posts = await response.json();

        const now = new Date();
        const nextSunday = new Date(now);
        nextSunday.setDate(now.getDate() + (7 - now.getDay()));
        nextSunday.setHours(0, 0, 0, 0);
        setNextUpdate(nextSunday);

        // Analyze emotions for all posts
        const emotionsResponse = await fetch('/api/analyze-emotions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            posts: posts.map((post: Post) => ({
              title: post.title,
              content: post.selftext || '',
            })),
            currentSubreddit
          }),
        });

        const emotions = await emotionsResponse.json();
        setEmotionData(emotions);
      } catch (error) {
        setError('Error fetching emotion data');
        console.error('Error fetching emotion data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAndAnalyzeEmotions();
  }, [currentSubreddit]);

  // if (isLoading) {
  //   return (
  //     <div className="w-full bg-white rounded-lg shadow-sm p-6">
  //       <div className="animate-pulse">
  //         <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
  //         <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
  //         <div className="h-[400px] bg-gray-100 rounded"></div>
  //       </div>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return(
      <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center bg-white/80">
        <Loader2 className="w-16 h-16 md:w-20 md:h-20 animate-spin text-purple-700" />
    </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-[600px] flex flex-col items-center justify-center space-y-4 bg-white rounded-lg shadow-sm p-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
                Try again
            </Button>
        </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-3 md:p-6">
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger />
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-1">
            EmotiSense: r/{currentSubreddit} Post & Topic Analysis
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
            Discover the emotional pulse of r/{currentSubreddit} - Top 20 sentiments from last week
              {nextUpdate && (
                <span className="text-gray-500 ml-2">
                  · Next update {nextUpdate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              )}
            </p>
          </div>
        </div>
        </div>

        <div className="h-[400px] sm:h-[450px] md:h-[500px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={emotionData}
              margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="emotion"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{
                  fontSize: 12,
                  fill: '#4B5563',
                  fontWeight: 500
                }}
                tickMargin={25}
              />
              <YAxis
                tickFormatter={formatNumber}
                tick={{
                  fontSize: 12,
                  fill: '#4B5563'
                }}
                width={50}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {label}
                        </p>
                        <p className="text-sm text-gray-600">
                          Count: <span className="font-medium text-indigo-600">
                            {formatNumber(payload[0].value as number)}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
}