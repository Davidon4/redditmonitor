"use client";

import dynamic from 'next/dynamic';

const LandingPageChart = dynamic(
    () => import('./LandingPageChart').then(mod => mod.default),
    {
      ssr: false,
      loading: () => (
        <div className="h-[400px] w-full bg-gray-100 rounded-lg" aria-hidden="true">
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse">Loading chart...</div>
          </div>
        </div>
      )
    }
  )

export default function LandingPageChartWrapper() {
  return <LandingPageChart />
}