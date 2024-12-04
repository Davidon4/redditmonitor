"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { motion } from "framer-motion";
  
  const faqs = [
    {
      question: "What is Reddimon?",
      answer:
        "Reddimon is a reddit analytics platform that helps marketers understand subreddits better. We analyze multiple data points to provide you with real-time insights about subreddit's behavior, content performance, and engagement trends.",
    },
    {
      question: "How does the AI analysis work?",
      answer:
        "Our AI engine works by continuously analyzing three key areas of your subreddit: content performance (titles, types, and timing), user interaction patterns (voting behaviors, comment engagement, peak activity times), and community trends (viral topics, sentiment analysis, growth patterns). This multi-layered analysis helps predict what content will resonate with your audience and when to post for maximum impact.",
    },
    {
      question: "Can I track multiple subreddits?",
      answer:
      "Yes! Our package lets you track 3 subreddits simultaneously, giving you powerful cross-community insights. Compare performance metrics, spot trending topics across communities, and identify unique growth opportunities for each subreddit.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security seriously. We only access publicly available Reddit data and use industry-standard encryption to protect your information.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, we offer a 7-day free trial with full access to all features, allowing you to experience the full potential of Reddimon before committing.",
    },
  ];
  
  export default function FAQ() {
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };
  
    const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    };
  
    return (
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about Reddimon
              </p>
            </div>
  
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={item}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-white border border-gray-200 rounded-lg"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <span className="text-left font-medium text-gray-900">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    );
  }