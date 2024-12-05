'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useSubredditStore } from '@/lib/store/subreddit';

interface Subreddit {
  id: string;
  name: string;
  description?: string;
  subscribers?: number;
}

export default function WelcomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {setCurrentSubreddit} = useSubredditStore();
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([]);
  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    },
  })
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const handleSearch = async (searchTerm?: string) => {
    if (!searchTerm?.trim() && !keyword.trim()) return;
    
    setIsLoading(true);
    setIsInitialLoad(false);
    try {
      const response = await fetch(`/api/subreddits?keyword=${searchTerm || keyword}`);
      const data = await response.json();
      setSubreddits(data);
    } catch (error) {
      console.error('Error searching subreddits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (selectedSubreddits.length === 0) {
      setError('Please select at least one subreddit');
      return;
    }
  
    setIsDashboardLoading(true);
    const selectedSubredditData = subreddits.filter(sub => 
      selectedSubreddits.includes(sub.id)
    );
  
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedSubreddits: selectedSubredditData.map(sub => ({
            id: sub.id,
            name: sub.name,
            description: sub.description || '',
            subscribers: sub.subscribers || 0
          })),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      const firstSelectedSubreddit = selectedSubredditData[0];
      setCurrentSubreddit(firstSelectedSubreddit.name);
  
      await update({
        ...session,
        user: {
          ...session?.user,
          hasCompletedOnboarding: true
        }
      });
  
      await new Promise(resolve => setTimeout(resolve, 100));
  
      router.replace('/home');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete onboarding');
    } finally {
      setIsDashboardLoading(false);
    }
  };


  const toggleSubreddit = (subredditId: string) => {
    setError(null); // Clear any existing error
    
    setSelectedSubreddits(prev => {
      const isSelected = prev.includes(subredditId);
      
      // If trying to add a new subreddit when already at 3
      if (!isSelected && prev.length >= 3) {
        setError('You can only select up to 3 subreddits');
        return prev;
      }
      
      return isSelected
        ? prev.filter(id => id !== subredditId)
        : [...prev, subredditId];
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Target Subreddits
          </h1>
          <p className="text-lg text-gray-600">
            Enter keywords related to your product to discover relevant subreddits
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex gap-4 mb-8">
            <Input
              type="text"
              placeholder="Enter keywords (e.g., software, fitness, technology)"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
              }}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={() => handleSearch()}
              className="bg-purple-700 hover:bg-purple-800"
              disabled={isLoading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
          {error && (
        <div className="text-red-500 text-sm text-center mb-4">
          {error}
        </div>
      )}
            {isLoading && !isInitialLoad ? (
              <div className="text-center flex flex-col items-center py-8">
                <Loader2 className="w-14 h-14 md:w-20 md:h-20 animate-spin text-purple-700" />
                <p className="text-gray-600 mt-4">Searching subreddits...</p>
                <p className="text-sm text-gray-500 mt-2">This might take a few seconds...</p>
              </div>
            ) : subreddits.length > 0 ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {subreddits.map((subreddit: Subreddit) => (
                    <div 
                      key={subreddit.id} 
                      onClick={() => toggleSubreddit(subreddit.id)}
                      className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all
                        ${selectedSubreddits.includes(subreddit.id) 
                          ? 'ring-2 ring-purple-500 shadow-md' 
                          : 'hover:shadow-md'
                        }`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        r/{subreddit.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                          {new Intl.NumberFormat('en-US', { 
                          maximumFractionDigits: 0,
                          notation: "standard"
                          }).format(subreddit.subscribers || 0)} subscribers
                      </p>
                      <p className="text-sm text-gray-700">
                        {subreddit.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                {selectedSubreddits.length > 0 && (
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleComplete}
                      className="bg-purple-700 hover:bg-purple-800"
                      disabled={isDashboardLoading}
                    >
                      {isDashboardLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        'Continue to Dashboard'
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : keyword && (
              <div className="text-center py-8 text-gray-600">
                Click on the search button with &ldquo;{keyword}&rdquo;. Try different keywords to find what you&apos;re looking for.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}