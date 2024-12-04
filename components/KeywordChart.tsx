"use client";

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSubredditStore } from '@/lib/store/subreddit';

interface KeywordData {
    keyword: string;
    count: number;
    engagement: number;
  }

export default function KeywordChart ()  {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {currentSubreddit} = useSubredditStore();

  useEffect(() => {
    const fetchKeywords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/keywords?subreddit=${currentSubreddit}`);
        if (!response.ok) {
            throw new Error("Failed to fetch keywords");
        }
        const data = await response.json();
        setKeywords(data.slice(0, 20)); // Get top 20 keywords
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occured");
        console.error('Error fetching keywords:', error);
      } finally {
          setIsLoading(false);
      }
    };

    fetchKeywords();
  }, [currentSubreddit]);

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
    <SidebarTrigger/>
    <div>
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-1">
      Trending Keywords: This Week in r/{currentSubreddit}
      </h2>
      <p className="text-xs md:text-sm text-gray-600">
      Discover the 20 hottest keywords driving conversations and engagement this week
      </p>
    </div>
    </div>
    </div>
    <div className="w-full h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={keywords}
          margin={{ top: 20, right: 25, left: 25, bottom: 120 }}
          barGap={0}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="keyword"
            angle={-45} // Angle the labels
            textAnchor="end"
            interval={0}
            height={100} // Give more space for labels
            tick={{ 
                fontSize: 10,
                fill: "#374151",
                fontWeight: 500
             }}
          />
            <YAxis
              yAxisId="left"
              tick={{
                fontSize: 11,
                fill: "#374151"
              }}
              width={50}
              label={{
                value: 'Appearances',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{
                fontSize: 11,
                fill: "#374151"
              }}
              width={50}
              label={{
                value: 'Engagement',
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 }
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2.5 md:p-4 shadow-lg rounded-lg border border-gray-200 max-w-[200px] md:max-w-[250px]">
                      <h3 className="font-medium text-gray-900 mb-1.5 text-sm md:text-base break-words">{label}</h3>
                      <div className="space-y-1">
                        <p className="text-xs md:text-sm text-gray-600">
                          Appearances:{' '}
                          <span className="font-medium text-purple-700">
                            {payload[0].value}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Engagement:{' '}
                          <span className="font-medium text-emerald-600">
                            {payload[1].value}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "20px"
            }}
            />
            <Bar
              yAxisId="left"
              dataKey="count"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              name="Appearances"
            />
              <Bar
              yAxisId="right"
              dataKey="engagement"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              name="Engagement"
            />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}