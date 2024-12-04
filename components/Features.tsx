"use client";

import { BarChart3, Brain, Target, TrendingUp, Users2, Zap, LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import {motion} from "framer-motion";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Convert reddit data into actionable insights with comprehensive performance metrics, engagement analytics, and real-time subreddit trend analysis."
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Utilize intelligent AI technology to uncover hidden content patterns and optimize your posting strategy for maximum impact."
  },
  {
    icon: Users2,
    title: "Subreddit Insights",
    description: "Decode subreddit behavior patterns and trending keywords to craft perfectly timed, relevant content that resonates with your target audience."
  },
  {
    icon: Target,
    title: "Topic Analysis",
    description: "Deep dive into subreddit ecosystems to identify trending topics, engagement hotspots, and optimal posting windows for enhanced visibility."
  },
  {
    icon: TrendingUp,
    title: "Growth Tracking",
    description: "Stay ahead of the curve with real-time monitoring of viral potential, engagement metrics, and performance benchmarks to maximize your content's reach."
  },
  {
    icon: Zap,
    title: "Smart Scheduling",
    description: "Leverage data-driven timing algorithms to automatically determine the perfect posting schedule for maximum engagement and visibility across time zones."
  }
];

export default function Features() {

  const container = {
    hidden: { opacity: 0},
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: {opacity: 0, y: 20},
    show: {opacity: 1, y:0}
  }

      const FeatureCard =({ icon: Icon, title, description }: FeatureCardProps) => {
        return (
          <div className="relative group h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-300 to-purple-700 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative p-6 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 transition duration-300 h-full flex flex-col">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </div>
          </div>
        );
      }

  return (
    <section id="features" className="py-16 bg-gradient-to-b from-purple-100 gray-50">
      <div className="container px-4 mx-auto">
        <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{once: true}}
        variants={container}
        >
        <SectionHeader
          title="Powerful Features for Reddit Success"
          description="Everything you need to understand and grow your Reddit community effectively."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div variants={item} key={index}>
            <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
        </motion.div>
      </div>
    </section>
  );
}