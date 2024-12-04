"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Loader2, Search, AlertCircle, TrendingUp, Trash2, MoreVertical, TrendingDown, Clock } from "lucide-react";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {useSubredditStore} from "@/lib/store/subreddit";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricsResponse } from "@/app/api/engagement/route";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type TimeRange = {
  label: string;
  hours: number;
}

interface PeakPeriod {
  startTime: string;
  endTime: string;
  comments: number;
  upvotes: number;
  activeUsers: number;
}

interface Metrics {
  timestamp: string;
  upvotes: number;
  commentCounts: number;
  activeUsers: number;
}

interface MetricInterval extends Metrics {
  count: number;
  engagementRate: number;
}

interface SubredditSuggestion {
  id: string;
  name: string;
  description?: string;
  subscribers?: number;
}

export default function EngagementMetricsChart() {
  const { currentSubreddit, setCurrentSubreddit, setAvailableSubreddits, availableSubreddits } = useSubredditStore();
  const { data: session } = useSession();
  const [metricsData, setMetricsData] = useState<MetricsResponse>({ metrics: [] });
  const [selectedHours, setSelectedHours] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [peakPeriods] = useState<PeakPeriod[]>([]);
  const [open, setOpen] = useState(false);
  const [newSubreddit, setNewSubreddit] = useState('');
  const [suggestions, setSuggestions] = useState<SubredditSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubredditChange = (newSubreddit: string) => {
    setCurrentSubreddit(newSubreddit)
  }

  const TIME_RANGES: TimeRange[] = [
    {label: "Last 1 hour", hours: 1},
    {label: "Last 6 hours", hours: 6},
    {label: "Last 24 hours", hours: 24},
    {label: "Last 3 days", hours: 72},
    {label: "Last 7 days", hours: 168}
]

useEffect(() => {
  async function fetchUserSubreddits() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/subreddits', {
        credentials: 'include'
      });
      const data = await response.json();
      
      // Update both local state and store
      setAvailableSubreddits(data.subreddits);
      
      // Set first subreddit as current if none selected
      if (!currentSubreddit && data.subreddits.length > 0) {
        setCurrentSubreddit(data.subreddits[0].subreddit.name);
      }
    } catch (error) {
      console.error('Error fetching user subreddits:', error);
      setError('Failed to fetch subreddits');
    } finally {
      setIsLoading(false);
    }
  }

  if (session?.user) {
    fetchUserSubreddits();
  } else {
    setAvailableSubreddits([]);
    setCurrentSubreddit("");
  }
}, [session, currentSubreddit, setAvailableSubreddits, setCurrentSubreddit]);

// Update the fetchMetricsData function
useEffect(() => {
  async function fetchMetricsData() {
    if (!currentSubreddit) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/engagement?subreddit=${currentSubreddit}&hours=${selectedHours}&t=${Date.now()}`,
        {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );
      
      const data = await response.json();
      console.log('Fetched metrics data:', data);
      
      if (data.isNewSubreddit) {
        setError("New subreddit detected! We're analyzing it now. Please check back in a few minutes...");
        setMetricsData({ metrics: [] });
        setSelectedHours(1);
      } else if (data.isCalculating) {
        setError("Calculating metrics, kindly hold on...");
        setMetricsData({ metrics: [] });
      } else {
        setMetricsData(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError("Failed to fetch metrics data");
      setMetricsData({ metrics: [] });
    } finally {
      setIsLoading(false);
    }
  }

  if (currentSubreddit) {
    fetchMetricsData();
    const intervalId = setInterval(fetchMetricsData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }
}, [currentSubreddit, selectedHours]);

useEffect(() => {
  if (metricsData.isNewSubreddit) {
    setError("New subreddit detected! We're analyzing it now. Please check back in a few minutes...");
    setMetricsData({ metrics: [] });
    setSelectedHours(1);
  }
}, [currentSubreddit, metricsData]);

// Get user's timezone
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Update the format date function
const formatDateTime = (timestamp: string, hours: number) => {
  const date = new Date(timestamp);
  
  if (hours <= 24) {
    // For 24 hours or less, show time only with AM/PM
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: userTimeZone
    });
  } else {
    // For more than 24 hours, show time first, then date
    return date.toLocaleString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // AM/PM
      month: 'short',
      day: 'numeric',
      timeZone: userTimeZone
    }).replace(',', ''); // Remove comma between time and date
  }
};

// Get available time ranges based on data
const getIsTimeRangeAvailable = (hours: number) => {
  if (metricsData.metrics.length === 0) return hours === 1;
  const oldestDataPoint = new Date(metricsData.metrics[0].timestamp);
  const now = new Date();
  const hoursDiff = (now.getTime() - oldestDataPoint.getTime()) / (1000 * 60 * 60);
  return hours <= hoursDiff;
};

const renderTrendCard = (title: string, trend: number, icon: React.ReactNode) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className={cn(
            "flex items-center mt-1 text-sm font-semibold",
            trend > 0 ? "text-green-600" : 
            trend < 0 ? "text-red-600" : 
            "text-gray-600"
          )}>
            {trend > 0 ? <TrendingUp size={16} className="mr-1" /> : 
             trend < 0 ? <TrendingDown size={16} className="mr-1" /> : 
             <span className="mr-1">—</span>}
            <span>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs text-gray-500 ml-1">
              {trend !== 0 ? 'from previous' : 'no change'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);


const calculateTrend = (metric: 'upvotes' | 'commentCounts') => {
  if (metricsData.metrics.length < 2) return 0;
  
  const latestMetric = metricsData.metrics[metricsData.metrics.length - 1];
  const previousMetric = metricsData.metrics[metricsData.metrics.length - 2];
  
  console.log(`${metric} Latest:`, latestMetric[metric]);
  console.log(`${metric} Previous:`, previousMetric[metric]);
  
  const currentValue = latestMetric[metric] || 0;
  const previousValue = previousMetric[metric] || 0;
  
  if (previousValue === 0) return 0;
  
  const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  return Math.round(percentageChange);
};

const calculateActiveUsersTrend = () => {
  if (metricsData.metrics.length < 2) return 0;
  
  const latestMetric = metricsData.metrics[metricsData.metrics.length - 1];
  const previousMetric = metricsData.metrics[metricsData.metrics.length - 2];
  
  console.log('Active Users Latest:', latestMetric.activeUsers);
  console.log('Active Users Previous:', previousMetric.activeUsers);
  
  const currentUsers = latestMetric.activeUsers || 0;
  const previousUsers = previousMetric.activeUsers || 0;
  
  if (previousUsers === 0) return 0;
  
  const percentageChange = ((currentUsers - previousUsers) / previousUsers) * 100;
  return Math.round(percentageChange);
};

const EngagementTimeCard = ({ period }: { period: PeakPeriod }) => {
  const startTime = new Date(period.startTime);
  const endTime = new Date(period.endTime);
  const startHour = startTime.getHours();
  
  // Calculate engagement rate
  const engagementRate = period.activeUsers > 0 
    ? ((period.comments + period.upvotes) / period.activeUsers) * 100 
    : 0;
  
  // Determine time of day
  let timeOfDay = "Morning";
  if (startHour >= 12 && startHour < 17) {
    timeOfDay = "Afternoon";
  } else if (startHour >= 17 && startHour < 21) {
    timeOfDay = "Evening";
  } else if (startHour >= 21 || startHour < 5) {
    timeOfDay = "Night";
  }

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formattedStartTime = startTime.toLocaleTimeString('en-US', timeFormat);
  const formattedEndTime = endTime.toLocaleTimeString('en-US', timeFormat);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="p-2 rounded-lg bg-purple-50">
          <Clock className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-600">{timeOfDay}</h3>
        <p className="text-xs text-gray-500 mt-1">{formattedStartTime} - {formattedEndTime}</p>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm text-gray-500">Activity:</span>
          <span className="text-sm text-gray-600">💬 {period.comments} comments</span>
          <span className="text-sm text-gray-600">⬆️ {period.upvotes} upvotes</span>
          <span className="text-sm text-gray-600">👥 {period.activeUsers} users</span>
          <span className="text-lg font-bold text-purple-600 mt-2">{engagementRate.toFixed(1)}%</span>
          <span className="text-xs text-gray-500">engagement</span>
        </div>
      </div>
    </div>
  );
};

const calculatePeakPeriods = useCallback(() => {
  if (!metricsData.metrics.length) return [];

  // Always use last 24 hours for peak periods
  const now = new Date();
  const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  
  const dailyMetrics = metricsData.metrics.filter(metric => {
    const metricTime = new Date(metric.timestamp);
    // Only include complete hours (exclude current hour)
    return metricTime >= last24Hours && metricTime.getHours() !== now.getHours();
  });

  // Group metrics by hour
  const hourlyMetrics = dailyMetrics.reduce((acc: Record<string, {
    startTime: Date;
    endTime: Date;
    comments: number;
    upvotes: number;
    activeUsers: number;
    count: number;
  }>, metric) => {
    const date = new Date(metric.timestamp);
    date.setMinutes(0, 0, 0);
    const hour = date.toISOString();

    if (!acc[hour]) {
      acc[hour] = {
        startTime: date,
        endTime: new Date(date.getTime() + 60 * 60 * 1000),
        comments: 0,
        upvotes: 0,
        activeUsers: 0,
        count: 0
      };
    }

    acc[hour].comments += metric.commentCounts || 0;
    acc[hour].upvotes += metric.upvotes || 0;
    acc[hour].activeUsers += metric.activeUsers || 0;
    acc[hour].count++;

    return acc;
  }, {});

  // Only include hours that have complete data
  const completeHours = Object.values(hourlyMetrics).filter(hour => 
    hour.count >= 11  // Assuming data points every 5 minutes (12 points per hour, requiring at least 11)
  );

  return completeHours
    .map(hour => ({
      startTime: hour.startTime.toISOString(),
      endTime: hour.endTime.toISOString(),
      comments: Math.round(hour.comments / hour.count),
      upvotes: Math.round(hour.upvotes / hour.count),
      activeUsers: Math.round(hour.activeUsers / hour.count)
    }))
    .sort((a, b) => {
      const engagementA = a.activeUsers > 0 ? (a.comments + a.upvotes) / a.activeUsers : 0;
      const engagementB = b.activeUsers > 0 ? (b.comments + b.upvotes) / b.activeUsers : 0;
      return engagementB - engagementA;
    })
    .slice(0, 5);
}, [metricsData]);


useEffect(() => {
  calculatePeakPeriods();
}, [calculatePeakPeriods]);

// Function to aggregate data based on time interval
const aggregateMetricsData = (metrics: MetricInterval[], hours: number) => {
  const intervalMinutes = hours <= 1 ? 15 : // 15 min intervals for 1 hour
                         hours <= 6 ? 30 : // 30 min intervals for <= 6 hours
                         hours <= 24 ? 60 : // 1 hour intervals for <= 24 hours
                         hours <= 72 ? 180 : // 3 hour intervals for 3 days
                         360; // 6 hour intervals for 7 days

  return Array.from(metrics
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .reduce((acc, current) => {
      const timestamp = new Date(current.timestamp);
      // Round to nearest interval
      timestamp.setMinutes(Math.floor(timestamp.getMinutes() / intervalMinutes) * intervalMinutes, 0, 0);
      const timeKey = timestamp.getTime();

      if (!acc.has(timeKey)) {
        acc.set(timeKey, {
          timestamp: timestamp.toISOString(),
          upvotes: current.upvotes || 0,
          commentCounts: current.commentCounts || 0,
          activeUsers: current.activeUsers || 0,
          count: 1,
          engagementRate: current.activeUsers > 0 
            ? ((current.commentCounts + current.upvotes) / current.activeUsers) * 100 
            : 0
        });
      } else {
        const existing = acc.get(timeKey)!;
        existing.upvotes += current.upvotes || 0;
        existing.commentCounts += current.commentCounts || 0;
        existing.activeUsers += current.activeUsers || 0;
        existing.count += 1;
        existing.engagementRate = existing.activeUsers > 0
          ? ((existing.commentCounts + existing.upvotes) / existing.activeUsers) * 100
          : 0;
      }
      return acc;
    }, new Map())
    .values())
    .map((interval: unknown) => {
      const metrics = interval as MetricInterval;
      return {
        ...metrics,
        upvotes: Math.round(metrics.upvotes / metrics.count),
        commentCounts: Math.round(metrics.commentCounts / metrics.count),
        activeUsers: Math.round(metrics.activeUsers / metrics.count),
        engagementRate: metrics.activeUsers > 0 
          ? ((metrics.commentCounts + metrics.upvotes) / metrics.activeUsers) * 100 
          : 0
      };
    });
  }

const fetchSubredditSuggestions = async (query: string) => {
  if (query.length < 2) {
    setSuggestions([]);
    return;
  }
  
  setIsSearching(true);
  try {
    const response = await fetch(`/api/subreddits?keyword=${query}`);
    
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    
    const data = await response.json();
    // Filter and sort suggestions to prioritize exact matches
    const subreddits = data
      .map((sub: SubredditSuggestion) => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        subscribers: sub.subscribers
      }))
      .filter((sub: SubredditSuggestion, index: number, self: SubredditSuggestion[]) => 
        // Remove duplicates based on name
        index === self.findIndex((s) => s.name.toLowerCase() === sub.name.toLowerCase())
      )
      .sort((a: SubredditSuggestion, b: SubredditSuggestion) => {
        // Prioritize exact matches and matches that start with the query
        const exactMatchA = a.name.toLowerCase() === query.toLowerCase();
        const exactMatchB = b.name.toLowerCase() === query.toLowerCase();
        const startsWithA = a.name.toLowerCase().startsWith(query.toLowerCase());
        const startsWithB = b.name.toLowerCase().startsWith(query.toLowerCase());
        
        if (exactMatchA) return -1;
        if (exactMatchB) return 1;
        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;
        return (b.subscribers || 0) - (a.subscribers || 0); // Sort by subscriber count as fallback
      });
    
    setSuggestions(subreddits);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    setSuggestions([]);
  } finally {
    setIsSearching(false);
  }
};

const handleAddSubreddit = async () => {
  if (!newSubreddit) return;
  
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/user/subreddits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subreddit: newSubreddit }),
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add subreddit');
    }
    
    // Refresh the subreddits list
    const updatedResponse = await fetch('/api/user/subreddits', {
      credentials: 'include'
    });
    const updatedData = await updatedResponse.json();
    
    // Update both store states
    setAvailableSubreddits(updatedData.subreddits);
    setCurrentSubreddit(newSubreddit);  // This ensures the store is updated
    
    // Clear form state
    setNewSubreddit('');
    setOpen(false);
    
  } catch (error) {
    console.error('Error details:', error);
    setError(error instanceof Error ? error.message : 'Failed to add subreddit');
  } finally {
    setIsLoading(false);
  }
};

const handleDeleteSubreddit = async (subName: string, e: React.MouseEvent) => {
  e.stopPropagation();
  // Don't allow deleting the current subreddit
  if (subName === currentSubreddit) return;

  try {
    const response = await fetch('/api/user/subreddits', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subreddit: subName }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete subreddit');
    }

    // Refresh the page to update the subreddit list
    window.location.reload();
  } catch (error) {
    console.error('Failed to delete subreddit:', error);
    setError('Failed to delete subreddit');
  }
} 

  return (
    <div className="w-full bg-gray-50">
      <div className="space-y-6 md:space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
          <SidebarTrigger/>
            <h1 className="text-xl text-2xl font-semibold text-gray-800">Subreddit Engagement Analytics</h1>
            </div>
            {/* <h2 className="text-lg font-semibold text-purple-600 ml-10">r/{subreddit}</h2>
            </div> */}
            <div className="flex items-center gap-3 ml-10">
                {availableSubreddits.length > 1 ? (
                  <Select
                    value={currentSubreddit || ""}
                    onValueChange={handleSubredditChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a subreddit" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubreddits.map((sub) => (
                        <SelectItem key={sub.id} value={sub.subreddit.name}>
                          r/{sub.subreddit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <h2 className="text-lg font-semibold text-purple-600">r/{currentSubreddit}</h2>
                )}
              </div>
            </div>
            <Select
              onValueChange={(value) => setSelectedHours(Number(value))}
              value={selectedHours.toString()}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Time Range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map((range) => (
                  <SelectItem 
                    key={range.hours} 
                    value={range.hours.toString()}
                    disabled={!getIsTimeRangeAvailable(range.hours)}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mt-6">
      <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={aggregateMetricsData(metricsData.metrics.map(metric => ({
                ...metric,
                count: 1,
                engagementRate: metric.activeUsers > 0 
                  ? ((metric.commentCounts + metric.upvotes) / metric.activeUsers) * 100 
                  : 0
              })), selectedHours)}
              margin={{ 
                top: 20, 
                right: typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 30,
                left: typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20,
                bottom: 40 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp"
                angle={0}
                textAnchor="middle"
                height={60}
                tickFormatter={(timestamp) => formatDateTime(timestamp, selectedHours)}
                interval="preserveStartEnd"
                stroke="#e5e7eb"
                tick={{
                  fontSize: 12,
                  fill: '#666',
                  style: {
                    fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '10px' : '12px'
                  }
                }}
              />
              <YAxis 
                // tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12, fill: '#666' }}
                stroke="#e5e7eb"
                width={60}
              />
              <Tooltip 
              contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                labelFormatter={(label) => {
                return new Date(label).toLocaleString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                month: 'short',
                day: 'numeric',
                timeZone: userTimeZone
                      });
                    }}
                formatter={(value, name) => {
                  if (name === "Engagement Rate") {
                    return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="engagementRate"
                name="Engagement Rate"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
                />
            </LineChart>
          </ResponsiveContainer>
      </div>

      <div className="space-y-4">
    <div className="flex items-center gap-3 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 ">Chart Engagement Metrics</h2>
        <TooltipProvider>
            <TooltipUI>
                <TooltipTrigger>
                    <Info className="w-5 h-5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-gray-200 text-black border border-gray-700 shadow-lg">
                    <p className="text-sm">
                    These metrics demonstrate how the engagement rate of the subreddit is tracked at each interval.
                    </p>
                </TooltipContent>
            </TooltipUI>
        </TooltipProvider>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {renderTrendCard(
        "Upvotes Trend",
        calculateTrend('upvotes'),
        <TrendingUp className="w-5 h-5 text-gray-600" />
      )}
      {renderTrendCard(
        "Comments Trend",
        calculateTrend('commentCounts'),
        <TrendingUp className="w-5 h-5 text-gray-600" />
      )}
      {renderTrendCard(
        "Active Users Trend",
        calculateActiveUsersTrend(),
        <TrendingUp className="w-5 h-5 text-gray-600" />
      )}
    </div>

        {/* Peak Engagement Times Section */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {peakPeriods.length > 0 ? (
        peakPeriods.map((period) => (
          <EngagementTimeCard key={period.startTime.toString()} period={period} />
        ))
      ) : (
        <div className="col-span-full p-6 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
          <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-gray-600">
          Peak engagement times will be available once we&apos;ve collected 24 hours of data.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Please check back later!
          </p>
        </div>
      )}
    </div>

      {/* Subreddits Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Your Subreddits ({availableSubreddits.length})</h2>
            <form
              className="flex w-full sm:w-auto flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSubreddit();
              }}
            >
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full sm:w-[240px] justify-between"
                  >
                    {newSubreddit || "Search subreddit..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[240px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Enter subreddit name"
                      value={newSubreddit}
                      onValueChange={(value) => {
                        setNewSubreddit(value);
                        fetchSubredditSuggestions(value);
                      }}
                    />
                    <CommandList>
                      {isSearching ? (
                        <CommandEmpty className="py-6 text-center">
                          <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                          <span className="text-sm text-gray-500">Searching...</span>
                        </CommandEmpty>
                      ) : newSubreddit.length < 2 ? (
                        <CommandEmpty className="py-6 text-center">
                          <span className="text-sm text-gray-500">Type at least 2 characters...</span>
                        </CommandEmpty>
                      ) : suggestions.length === 0 ? (
                        <CommandEmpty className="py-6 text-center">
                          <span className="text-sm text-gray-500">No subreddits found</span>
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {suggestions.map((subreddit) => (
                            <CommandItem
                              key={subreddit.id}
                              value={subreddit.name}
                              onSelect={() => {
                                setNewSubreddit(subreddit.name);
                                setOpen(false);
                              }}
                              className="flex flex-col items-start py-3"
                            >
                              <div className="font-medium">r/{subreddit.name}</div>
                              {subreddit.subscribers && (
                                <div className="text-xs text-gray-500">
                                  {subreddit.subscribers.toLocaleString()} members
                                </div>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                // disabled={!newSubreddit || loading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                 )}
                Add
              </Button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              // Loading State
              <div className="col-span-full flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-3 text-gray-600">Loading subreddits...</span>
              </div>
            ) : error ? (
              // Error State
              <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            ) : availableSubreddits.length === 0 ? (
              // Empty State
              <div className="col-span-full text-center p-8 bg-white rounded-xl border border-gray-100">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-600 font-medium mb-1">No subreddits added yet</h3>
                <p className="text-sm text-gray-500">Add your first subreddit to start tracking engagement</p>
              </div>
            ) : (
              // Subreddit Cards
              availableSubreddits.map((sub) => (
                <div
                  key={sub.id}
                  className={cn(
                    "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4",
                    sub.subreddit.name === currentSubreddit && "ring-2 ring-purple-500"
                  )}
                  onClick={() => {
                    if (sub.subreddit.name !== currentSubreddit) {
                      setCurrentSubreddit(sub.subreddit.name);
                    }
                  }}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          sub.subreddit.name === currentSubreddit ? "bg-purple-100" : "bg-blue-100"
                        )}>
                          <span className={cn(
                            "text-sm font-medium",
                            sub.subreddit.name === currentSubreddit ? "text-purple-600" : "text-blue-600"
                          )}>{sub.subreddit.name[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">r/{sub.subreddit.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{sub.subreddit.subscribers.toLocaleString()} members</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "hover:bg-gray-100",
                              sub.subreddit.name === currentSubreddit && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className={cn(
                              "text-red-600",
                              sub.subreddit.name === currentSubreddit && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={(e) => handleDeleteSubreddit(sub.subreddit.name, e)}
                            disabled={sub.subreddit.name === currentSubreddit}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {sub.subreddit.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {sub.subreddit.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  )
}