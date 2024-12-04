"use client";

import { Button } from "@/components/ui/button";
import {signIn} from "next-auth/react";

export default function CTA() {
  const handleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/home'
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        {/* Animated gradient orbs for visual interest */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container px-4 mx-auto text-center">
        {/* Small badge above title */}
        <div className="inline-flex items-center px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full mb-8 border border-purple-400/20">
          <span className="text-purple-100 text-sm font-medium">
            🚀 Limited Time Offer: 33% Off
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
            Transform
          </span>{" "}
          Your Reddit Presence?
        </h2>

        <p className="text-lg md:text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join over <span className="font-semibold text-white">100+ marketers</span> who are already using Reddimon to boost engagement by up to 100%.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button onClick={handleSignIn}    
            className="bg-white text-white px-8 py-2.5 rounded-lg
            hover:bg-purple-50 hover:scale-105
            transform transition-all duration-200
            shadow-lg hover:shadow-purple-500/50
            relative overflow-hidden
            group
            ">
    <span className="relative z-10 flex items-center text-purple-700 hover:text-purple-800">
    Get Started - free
                <svg 
      className="w-4 h-4 ml-2 -mr-1 transform transition-transform group-hover:translate-x-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  </span>
  </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center space-x-2 text-purple-200 text-sm">
          </div>
          <div className="text-purple-200 text-sm px-2">•</div>
          <div className="text-purple-200 text-sm">Used by Redditors</div>
          <div className="text-purple-200 text-sm px-2">•</div>
        </div>
      </div>
    </section>
  );
}