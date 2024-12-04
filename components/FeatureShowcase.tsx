"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const features = [
  {
    id: "Top Post Analytics",
    title: "Top Post Analytics",
    description: "Uncover the DNA of viral posts with AI that analyzes what makes top content soar.",
    benefits: [
        "Get daily insights from Reddit's top 100 posts - including best times, titles, and content patterns that drive engagement",
        "Craft winning content strategies backed by real data from posts that reached millions",
        "Track 5+ key metrics including upvote ratios, comment velocity, and engagement patterns to replicate success"
    ],
    chartType: "line",
    data: [
        { name: "Post 1", score: 55, comments: 58 },
        { name: "Post 2", score: 50, comments: 42 },
        { name: "Post 3", score: 38, comments: 24 },
        { name: "Post 4", score: 18, comments: 16 },
    ]
  },
  {
    id: "Emotion Analysis",
    title: "Emotion Analysis",
    description: "Uncover the emotional landscape of your subreddit community with AI that analyzes trends.",
    benefits: [
        "Monitor key emotional dimensions in real-time to catch brewing issues before they escalate",
        "Spot emerging emotional trends across topics and threads with detailed charts",
        "Fine-tune your content and responses using mood analysis that shows what resonates most"
      ],
    chartType: "bar",
    data: [
        { name: "Excitement", count: 7 },
        { name: "Frustration", count: 6 },
        { name: "Curiosity", count: 5 },
        { name: "Anxiety", count: 4 },
        { name: "Gratitude", count: 3 },
    ]
  },
  {
    id: "Keyword Tracking",
    title: "Keyword Spotlight",
    description: "Find out which words get your subreddit talking and track hot topics as they happen.",
    benefits: [
        "See which words and phrases are trending in your subreddit right now",
        "Know which keywords lead to more comments and upvotes",
        "Get extracted keywords from top posts to inspire your own content"
      ],
    chartType: "line",
    data: [
        { name: "product", appearances:54, engagement: 12245 },
        { name: "building", appearances: 46, engagement: 11850},
        { name: "feedback", appearances: 43, engagement: 10546 },
        { name: "share", appearances: 35, engagement: 8457 },
    ]
  }
];

const renderChart = (feature: typeof features[0]) => {
    if (feature.id === "Top Post Analytics") {
        return (
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={feature.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#8B5CF6" />
              <Line type="monotone" dataKey="comments" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
          </div>
        );
    }

    if (feature.id === "Emotion Analysis") {
        return (
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feature.data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer> 
          </div> 
        );
    }

    if (feature.id === "Keyword Tracking") {
            return (
                <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={feature.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                        <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                        <Tooltip />
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="appearances" 
                            stroke="#8B5CF6" 
                            name="Appearances"
                        />
                        <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="engagement" 
                            stroke="#3B82F6" 
                            name="Engagement"
                        />
                    </LineChart>
                </ResponsiveContainer> 
              </div>
            );
    }
}

export default function FeatureShowcase() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-purple-100">
      <div className="container px-4 mx-auto">
        <SectionHeader
          title="See Reddimon in Action"
          description="Discover how our features help you understand and grow your Reddit presence"
        />

        <Tabs defaultValue="Top Post Analytics" className="mt-12">
          <TabsList className="grid w-full max-w-[600px] grid-cols-3 mx-auto mb-12">
            {features.map((feature) => (
              <TabsTrigger 
              key={feature.id} 
              value={feature.id}
              className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
              >
                {feature.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id}>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {feature.description}
                  </p>
                </div>
                <ul className="space-y-3">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="rounded-full bg-purple-100 p-1">
                          <Check className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    {renderChart(feature)}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}