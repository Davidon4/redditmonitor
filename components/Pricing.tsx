'use client'

import { motion } from "framer-motion";
import { Check, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const pricingPlan = {
  originalPrice: "$15",
  price: "$10",
  period: "/month",
  features: [
    "Advanced analytics",
    "Maximize Reddit Engagement",
    "Analyze Top-Performing Content Strategies",
    "Optimize Emotional Engagement Techniques",
    "Priority support",
  ],
}

export default function Pricing({onClick, buttonText}: {onClick: () => void, buttonText: string}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl blur opacity-20" />
      
      <div className="relative rounded-xl bg-white">
        <div className="p-6">
          {/* Early adopter badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
              <Timer size={14} className="mr-1" />
              <span className="font-medium">33% OFF - Limited Time!</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center space-x-2">
              <span className="text-4xl font-bold text-gray-900">{pricingPlan.price}</span>
              <span className="text-lg line-through text-gray-400">{pricingPlan.originalPrice}</span>
              <span className="text-gray-500">{pricingPlan.period}</span>
            </div>
            <p className="text-green-600 text-sm font-medium mt-1">Save $5 monthly!</p>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            {pricingPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center p-1.5 hover:bg-purple-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Check size={12} className="text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="bg-purple-50 p-3 rounded-lg mb-6">
            <div className="flex justify-center mb-1">
              {"★★★★★".split("").map((star, i) => (
                <span key={i} className="text-yellow-400 text-sm">{star}</span>
              ))}
            </div>
            <p className="text-xs text-center text-gray-600">
              &ldquo;Grew my website traffic just 1 week after using this tool!&rdquo;
              <br />
              <span className="font-medium text-gray-700">- John D., Redditor</span>
            </p>
          </div>

          <Button
            onClick={onClick}
            className="w-full py-5 text-base font-medium bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
          >
           {buttonText}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}