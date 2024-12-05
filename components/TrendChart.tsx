"use client";
import {useState, useEffect} from "react";
import dynamic from "next/dynamic";
import { MessageSquare, ListFilter, AlertCircle, ThumbsUp, Sparkles, Tag, TrendingUp, Loader2 } from "lucide-react";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {motion, AnimatePresence} from "framer-motion";
import {cn, formatNumber} from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useSubredditStore } from "@/lib/store/subreddit";

  interface UserSubreddit {
    subreddit: {
      name: string;
      description: string;
      subscribers: number;
    }
  }

  interface TopPost {
    title: string;
    score: number;
    comments: number;
    url: string;
    created: number;
    selftext?: string;
  }

  interface PostAnalysis {
    keywords: string[];
    sentiment:string;
    emotion: string;
    engagement_pattern: {
        pattern: string;
        description: string;
    }
  };

  const Chart = dynamic(() => import('./Chart'), { ssr: false });
  export default function TrendChart() {
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<TopPost | null>(null);
  const [postAnalysis, setPostAnalysis] = useState<PostAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartWidth, setChartWidth] = useState(1000);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setAvailableSubreddits, setCurrentSubreddit, currentSubreddit } = useSubredditStore();
  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth < 1280 ? window.innerWidth - 120 : 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const analyzePost = async (post: TopPost) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          content: post.selftext || '',
          score: post.score,
          comments: post.comments,
        }),
      });
      
      const analysis = await response.json();
      setPostAnalysis(analysis);
    } catch (err) {
      console.error('Failed to analyze post:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePostClick = (post: TopPost) => {
    setSelectedPost(post);
    analyzePost(post);
  };

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

  useEffect(() => {
    async function fetchTopPosts() {
      try {
        const response = await fetch(`/api/trending?subreddit=${currentSubreddit}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setTopPosts(data);

        // Automatically select and analyze the top post
        if (data.length > 0 && !selectedPost) {
          setSelectedPost(data[0]);
          analyzePost(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch top posts:', err);
      }
    }

    fetchTopPosts();
    const interval = setInterval(fetchTopPosts, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentSubreddit, selectedPost]);

  const formatPostTime = (timestamp: number) => {
    const date = new Date(timestamp); // Convert Unix timestamp to milliseconds
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }; 

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
        Top Posts Today
      </h2>
      <p className="text-xs md:text-sm text-gray-600">
      Shows the top 10 posts ranked by engagement in the last 24 hours
      </p>
    </div>
    </div>

    <div className="h-[400px] mt-4">
      <Chart topPosts={topPosts} />
      </div>
      </div>

        <AnimatePresence>
        {selectedPost && (
          <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 20}}
          className="bg-white rounded-xl shadow-sm border p-6 w-full mt-16"
          >
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
                <div className="space-y-2">
                <div className="flex items-center gap-2">
              <h4 className="text-xl font-semibold text-gray-900 line-clamp-2">{selectedPost.title}</h4>
              </div> 
              <p className="text-sm text-gray-500">Posted {formatPostTime(selectedPost.created)}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <ThumbsUp className="w-5 h-5 text-orange-500" />
                <span className="font-medium">
                {formatNumber(selectedPost.score)}
                </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="font-medium">
                {formatNumber(selectedPost.comments)}
                </span>
              </div>
            </div>
            </div>

            {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-14 h-14 animate-spin text-purple-600" />
                    {/* <span className="text-sm text-gray-600">
                      Analyzing post...
                    </span> */}
                  </div>
                </div>
            ) : (
              postAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 bg-purple-50 rounded-xl border border-purple-100"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-purple-600" />
                    <h5 className="font-medium text-purple-900">Keywords</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
        {postAnalysis.keywords.map((keyword, index) => (
          <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {keyword}
          </span>
            ))}
        </div>
        </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 bg-blue-50 rounded-xl border border-blue-100"
              >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h5 className="font-medium text-blue-900">Content Analysis</h5>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-700">Emotion: </span>
                      <span className="text-sm text-blue-600">{postAnalysis.emotion}</span>
                  </div>
                  </div>
                  </motion.div>

                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-green-50 rounded-xl border border-green-100 md:col-span-2"
                    >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h5 className="font-medium text-green-900">
                          Engagement Pattern
                      </h5>
                  </div>
                  <div className="space-y-2">
                        <p className="text-sm font-medium text-green-800">
                          {postAnalysis.engagement_pattern.pattern}
                        </p>
                        <p className="text-sm text-green-700">
                          {postAnalysis.engagement_pattern.description}
                        </p>
                      </div>
                    </motion.div>
                </div>
              )
            )}
          </div>
          </motion.div>
      )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          scale: isListOpen ? 1 : 0.9,
          opacity: isListOpen ? 1 : 0.8,
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className={cn(
            "rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white",
            isListOpen && "bg-purple-700"
          )}
          onClick={() => setIsListOpen(!isListOpen)}
        >
          <ListFilter className="w-5 h-5" />
        </Button>
        
        <AnimatePresence>
        {isListOpen && (
              <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-full right-0 mb-4 w-80 bg-white rounded-xl shadow-xl border p-4 max-h-[calc(100vh-6rem)] overflow-y-auto"
                  >
                 <h3 className="text-sm font-medium text-gray-900 mb-3">Trending Posts</h3>
                <div className="space-y-2">
                  {topPosts.map((post, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handlePostClick(post);
                        setIsListOpen(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                  <div className="flex justify-between items-start gap-3">
                  <span className="text-sm text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {post.title}
                      </span>
                      <div className="flex items-center gap-3 text-gray-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" /> {formatNumber(post.score)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {formatNumber(post.comments)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>  
        </motion.div>
    </div>
  )
}
