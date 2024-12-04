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

interface SubredditState {
  currentSubreddit: string | null;
  setCurrentSubreddit: (subreddit: string) => void;
  availableSubreddits: UserSubreddit[];
  setAvailableSubreddits: (subreddits: UserSubreddit[]) => void;
}

export const useSubredditStore = create<SubredditState>()(
  persist(
    (set) => ({
      currentSubreddit: null,
      setCurrentSubreddit: (subreddit: string) => {
        set({ currentSubreddit: subreddit });
      },
      availableSubreddits: [],
      setAvailableSubreddits: (subreddits) => set({ availableSubreddits: subreddits }),
    }),
    {
      name: 'subreddit-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentSubreddit: state.currentSubreddit }),
    }
  )
);

// Add a debug subscription
useSubredditStore.subscribe((state) => {
  console.log('Store updated:', state);
});