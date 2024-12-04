"use client";
import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {

  return (
    <section className="relative bg-gradient-to-b from-purple-200 to-purple-100">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-8 pt-32 md:pb-20 md:pt-32">
          {/* Section header */}
          <div className="pb-8 text-center md:pb-8">
            <h1
              className="mb-6 border-y text-4xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.purple.300),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Subreddit Analytics Tool
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Struggling to market on Reddit? Get powerful insights into subreddit activity with Reddimon - the analytics tool that decodes your subreddit&apos;s behavior and engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}