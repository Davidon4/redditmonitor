import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserSubreddit {
  id: string;
  userId: string;
  subredditId: string;
  createdAt: Date;
  subreddit: {
    id: string;
    name: string;
    description?: string | null;
    subscribers: number;
    isTracked: boolean;
    redditId: string;
  }
}

interface SubredditStore {
  availableSubreddits: UserSubreddit[];
  currentSubreddit: string | null;
  setAvailableSubreddits: (subreddits: UserSubreddit[]) => void;
  setCurrentSubreddit: (subreddit: string) => void;
}

export const useSubredditStore = create<SubredditStore>()(
  persist(
    (set) => ({
      currentSubreddit: null,
      setCurrentSubreddit: (subreddit: string) => {
        set({ currentSubreddit: subreddit });
      },
      availableSubreddits: [],
      setAvailableSubreddits: (subreddits: UserSubreddit[]) => 
        set({ availableSubreddits: subreddits }),
    }),
    {
      name: 'subreddit-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSubreddit: state.currentSubreddit,
        availableSubreddits: state.availableSubreddits,
      }),
    }
  )
);

// Add a debug subscription
useSubredditStore.subscribe((state) => {
  console.log('Store updated:', state);
});