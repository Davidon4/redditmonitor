
import HeroHome from "@/components/HeroHome";
import Features from "@/components/Features";
import CTA from "@/components/Cta";
import FeatureShowcase from "@/components/FeatureShowcase";
import LandingPageChartWrapper from "@/components/LandingPageChartWrapper";
import FAQ from "@/components/Faq";
import {getServerSession} from "next-auth";
import { redirect } from "next/navigation";
import LandingPagePricing from "@/components/LandingPagePricing";

export const metadata = {
  title: "Reddimon - AI-Powered Reddit Analytics",
  description: "Reddimon is a tool that allows you to monitor subreddits and get insights into their activity.",
  icons: {
    icon: '/reddimon.png',
    apple: '/apple-icon.png',
  },
};

export default async function LandingPage() {
    const session = await getServerSession();
    if(session) {
        redirect("/home")
    }

    return (
    <>
    <HeroHome />
      <Features />
      <LandingPageChartWrapper/>
      <FeatureShowcase/>
      <LandingPagePricing />
      <FAQ/>
      <CTA />
      </>
    )
}