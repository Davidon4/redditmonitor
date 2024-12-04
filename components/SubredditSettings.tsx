'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, Trash2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSubredditStore } from "@/lib/store/subreddit";

interface SavedSubreddit {
    name: string;
    members: number;
    isDefault?: boolean;
    subreddit: {
        name: string;
        subscribers: number;
        description: string;
    }
}

interface SubredditSettingsProps {
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}   

export default function SubredditSettings({setIsLoading, setError}: SubredditSettingsProps) {
    const [savedSubreddits, setSavedSubreddits] = useState<SavedSubreddit[]>([]);
    const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([]);
    const { currentSubreddit, setCurrentSubreddit } = useSubredditStore();

// In SubredditSettings.tsx
useEffect(() => {
    let mounted = true;
    
    const fetchSavedSubreddits = async () => {
        if (!mounted) return;
        try {
            setIsLoading(true); // Set parent loading state
            setError(null);
            const response = await fetch('/api/user/subreddits', {
                credentials: "include"
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch subreddits');
            }
            
            const data = await response.json();

            if (!mounted) return;

            const transformedData = data.subreddits.map((item: {
                subreddit: {
                    name: string;
                    subscribers: number;
                    description: string;
                }
            }) => ({
                name: item.subreddit.name,
                members: item.subreddit.subscribers,
                subreddit: item.subreddit
            }));
            setSavedSubreddits(transformedData);
            setSelectedSubreddits(data.subreddits.map((item: {
                subreddit: { name: string }
            }) => item.subreddit.name));
        } catch (err) {
            if (!mounted) return;
            console.error("Failed to fetch subreddits:", err);
            setError(err instanceof Error ? err.message : 'Failed to fetch subreddits');
            setSavedSubreddits([]);
            setSelectedSubreddits([]);
        } finally {
            if (mounted) {
                setIsLoading(false);
            }
        }
    };

    fetchSavedSubreddits();

    return () => {
        mounted = false;
    }
}, [setIsLoading, setError]); // Add dependencies

    const handleDeleteSubreddit = async (subredditName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Don't allow deleting the current subreddit
        if (subredditName === currentSubreddit) return;
      
        try {
          const response = await fetch('/api/user/subreddits', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subreddit: subredditName }),
            credentials: "include"
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete subreddit');
          }

            // Update local state
            setSavedSubreddits(prev => prev.filter(sub => sub.name !== subredditName));
            setSelectedSubreddits(prev => prev.filter(name => name !== subredditName));

            // If deleted subreddit was in Zustand store, reset it
            if (currentSubreddit === subredditName) {
                setCurrentSubreddit('');
            }
        } catch (error) {
          console.error('Failed to delete subreddit:', error);
        }
      }


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-900">Subreddit Preferences</h2>
                    <p className="text-sm text-gray-500">
                        Manage your tracked subreddits
                    </p>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-5 h-5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-gray-200 text-black border border-gray-700 shadow-lg">
                            <p className="text-sm">
                            Manage your default subreddits
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="grid gap-4">
                {savedSubreddits.map((subreddit) => (
                    <div
                    key={subreddit.name}
                    className={`p-4 rounded-lg border ${
                        subreddit.isDefault
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">r/{subreddit.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {subreddit.members?.toLocaleString() || 0} members
                                </p>
                                </div>  
                                <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={selectedSubreddits.includes(subreddit.name) ? 'bg-green-100 text-green-600' : ''}
                                >
                                {selectedSubreddits.includes(subreddit.name) ? 'Selected' : 'Select'}
                                </Button>
                                <TooltipProvider>
                                <Tooltip>
                                <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleDeleteSubreddit(subreddit.name, e)}
                                    className={`hover:bg-transparent ${
                                        savedSubreddits.length === 1 
                                            ? 'text-red-300 cursor-not-allowed' 
                                            : 'text-red-600 hover:text-red-700'
                                    }`}
                                    disabled={subreddit.isDefault || savedSubreddits.length === 1}
                                >
                                {savedSubreddits.length === 1 ? (
                                    <AlertCircle className="h-4 w-4" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                                </TooltipTrigger>
                                {savedSubreddits.length === 1 && (
                                <TooltipContent className="bg-red-50 text-red-600 border border-red-200">
                                <p className="text-sm">Cannot delete the last subreddit</p>
                                </TooltipContent>
                                )}
                                </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>    
                ))}
                {savedSubreddits.length === 0 && (
                    <div className="text-center p-6 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500">No subreddits added yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}