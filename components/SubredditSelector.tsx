'use client';

import { useEffect } from 'react';
import EngagementMetricsChart from "@/components/EngagementMetricsChart";
import { useSubredditStore } from '@/lib/store/subreddit';

export default function SubredditSelector({ defaultSubreddit }: { defaultSubreddit: string }) {
    const { currentSubreddit, setCurrentSubreddit } = useSubredditStore();

    useEffect(() => {
        if (defaultSubreddit && (!currentSubreddit || currentSubreddit !== defaultSubreddit)) {
            console.log('Setting default subreddit:', defaultSubreddit); // Debug log
            setCurrentSubreddit(defaultSubreddit);
        }
    }, [defaultSubreddit, currentSubreddit, setCurrentSubreddit]);

    return (
        <div className="space-y-6">
            <EngagementMetricsChart 
                // initialHours={24} 
            />
        </div>
    );
}