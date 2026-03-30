'use client';

import { SuggestedAuthorSection } from "../Right-Sideber/SuggestedAuthorCard";
import { TopAuthorSection } from "../Right-Sideber/TopAuthorSection";
import { TrendingStoriesList } from "../Right-Sideber/TrendingStoryItem";

type RightsideberProps = {
  variant?: "sidebar" | "sheet";
};

export default function Rightsideber({ variant = "sidebar" }: RightsideberProps) {
  const isSheet = variant === "sheet";

  return (
    <div className={isSheet ? "w-full" : "w-full min-h-screen"}>
      <div className={`${isSheet ? "px-3 py-4 space-y-10" : "pl-6 py-7 space-y-5"}`}>
        {/* Top Authors Section */}
        <section>
          <TopAuthorSection />
        </section>

        {/* Suggested Authors Section */}
        <section>
          <SuggestedAuthorSection />
        </section>

        {/* Trending Stories Section */}
        <section>
          <TrendingStoriesList />
        </section>
      </div>
    </div>
  )
}
