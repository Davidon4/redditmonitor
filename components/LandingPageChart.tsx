"use client";

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip as TooltipUI, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ThumbsUp, MessageSquare, FileText, Info, TrendingUp, TrendingDown } from 'lucide-react';

const dummyData = [
  { time: "2023-11-21T00:00:00Z", upvotes: 245, comments: 120 },
  { time: "2023-11-21T04:00:00Z", upvotes: 388, comments: 178 },
  { time: "2023-11-21T08:00:00Z", upvotes: 546, comments: 257 },
  { time: "2023-11-21T12:00:00Z", upvotes: 873, comments: 384 },
  { time: "2023-11-21T16:00:00Z", upvotes: 642, comments: 289 },
  { time: "2023-11-21T20:00:00Z", upvotes: 542, comments: 226 },
  { time: "2023-11-22T00:00:00Z", upvotes: 425, comments: 167 }
];

const dummyStats = {
    totalUpvotes: { value: 12, trend: "↑" },
    totalComments: { value: 10, trend: "↑" },
    activeUsers: { value: 5, trend: "↓" }
  };

  const renderTrendCard = (title: string, data: { value: number, trend: string }, icon: React.ReactNode) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
      </div>
      <div>
          <div className={cn(
            "flex items-center mt-1 text-sm font-semibold",
            data.value > 5 ? "text-green-600" : "text-red-600"
          )}>
            {data.value > 5 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            <span>{data.trend === "↑" ? '+' : ''}{data.value}%</span>
          </div>
        </div>
    </div>
  );
  

export default function LandingPageChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[400px] w-full bg-gray-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center">
        <div className="animate-pulse">Loading chart...</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Real-time Engagement Analytics
          </h2>
          <p className="text-lg text-gray-600">
            Track your subreddits&apos; performance with comprehensive analytics
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Minute-by-Minute Engagement Metrics</h2>
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger>
                  <Info className="w-5 h-5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-gray-200 text-black border border-gray-700 shadow-lg">
                  <p className="text-sm">
                    These metrics track real-time subreddit engagement at 5-minute intervals.
                  </p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {renderTrendCard("Upvotes", dummyStats.totalUpvotes, <ThumbsUp size={18} className="text-blue-600" />)}
            {renderTrendCard("Comments", dummyStats.totalComments, <MessageSquare size={18} className="text-green-600" />)}
            {renderTrendCard("Active Users", dummyStats.activeUsers, <FileText size={18} className="text-purple-600" />)}
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickMargin={10}
                  tickFormatter={(time) => {
                    const date = new Date(time);
                    return date.toLocaleTimeString('en-US', { 
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true 
                    });
                  }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="upvotes" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}