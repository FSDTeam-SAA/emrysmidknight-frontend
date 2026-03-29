"use client";

import { StoryPost } from "@/components/home/StoryPost";
import React, { useState } from "react";

type Tab = "single" | "author";

interface SubscriptionRow {
  id: number;
  author: string;
  plan: string;
  amount: string;
  date: string;
}

const subscriptions: SubscriptionRow[] = [
  {
    id: 1,
    author: "Jenny Wilson",
    plan: "All Access",
    amount: "€90",
    date: "24 May, 2020",
  },
  {
    id: 2,
    author: "Ronald Richards",
    plan: "Limited Post Access",
    amount: "€30",
    date: "21 Sep, 2020",
  },
  {
    id: 3,
    author: "Devon Lane",
    plan: "Selected Post Access",
    amount: "€50",
    date: "8 Sep, 2020",
  },
  {
    id: 4,
    author: "Kathryn Murphy",
    plan: "Limited Post Access",
    amount: "€30",
    date: "21 Sep, 2020",
  },
  {
    id: 5,
    author: "Darrell Steward",
    plan: "All Access",
    amount: "€90",
    date: "22 Oct, 2020",
  },
  {
    id: 6,
    author: "Robert Fox",
    plan: "Selected Post Access",
    amount: "€50",
    date: "17 Oct, 2020",
  },
  {
    id: 7,
    author: "Kristin Watson",
    plan: "All Access",
    amount: "€90",
    date: "24 May, 2020",
  },
  {
    id: 8,
    author: "Brooklyn Simmons",
    plan: "Selected Post Access",
    amount: "€50",
    date: "24 May, 2020",
  },
  {
    id: 9,
    author: "Jane Cooper",
    plan: "All Access",
    amount: "€90",
    date: "17 Oct, 2020",
  },
  {
    id: 10,
    author: "Jenny Wilson",
    plan: "All Access",
    amount: "€90",
    date: "24 May, 2020",
  },
  {
    id: 11,
    author: "Ronald Richards",
    plan: "Limited Post Access",
    amount: "€30",
    date: "21 Sep, 2020",
  },
  {
    id: 12,
    author: "Devon Lane",
    plan: "Selected Post Access",
    amount: "€50",
    date: "8 Sep, 2020",
  },
  {
    id: 13,
    author: "Kathryn Murphy",
    plan: "Limited Post Access",
    amount: "€30",
    date: "21 Sep, 2020",
  },
];

const dummyPosts = [
  {
    author: "Eleanor Pena",
    handle: "oliverking",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
    timestamp: "2 hours ago",
    title: "Dragon's Awakening – Chapter 5",
    content: `The mountains had always been quiet, their peaks covered with mist and ancient snow. But tonight the ground trembled beneath Mira's feet. A deep roar echoed through the valley as cracks of fire lit the sky. The villagers ran, but Mira stood still — she had been waiting for this moment her entire life.`,
    likes: 27,
    comments: 657,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    author: "Floyd Miles",
    handle: "lilywhite",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Floyd",
    timestamp: "4 hours ago",
    title: "The Dark Forest – Chapter 1",
    content: `The night was silent, and the wind whispered through the trees. Shadows danced around the ancient ruins, hiding secrets long forgotten. Jonathan stepped cautiously, the crunch of fallen leaves beneath his boots echoing in the empty forest. He felt a chill run down his spine as the moonlight flickered through the canopy. Somewhere in the distance, a branch snapped. He froze.`,
    likes: 15,
    comments: 342,
    // no image/video — text only
  },
  {
    author: "Sarah Chen",
    handle: "sarahwrites",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    timestamp: "6 hours ago",
    title: "Lost in the City – A Short Story",
    content: `The rain poured down on the grey streets of downtown. Maya clutched her journal close to her chest, wondering if she had made the right decision to leave everything behind.`,
    likes: 42,
    comments: 891,
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // example video
  },
  {
    author: "Marcus Rodriguez",
    handle: "marcusauthor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    timestamp: "8 hours ago",
    title: "The Last Light – Chapter 2",
    content: `As the sun began to set over the horizon, painting the sky in shades of amber and crimson, Elena understood what it meant to lose everything. The village below was silent now, the smoke from the fires finally clearing.`,
    likes: 19,
    comments: 524,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
  },
];

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("single");

  return (
    <div className="min-h-screen px-4 py-6">
      <h1 className="text-[#121212] dark:text-[#FFFF] lg:text-[40px] md:text-[30px] font-bold mb-10">
        Subscription
      </h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Tab Switcher — matches image exactly */}
        <div className="flex rounded-[8px] overflow-hidden p-1 gap-1 bg-[#FFFFFF]">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "single"
                ? "bg-[#E8634A] text-white"
                : "text-[#E8634A] hover:bg-[#E8634A] hover:text-white"
            }`}
          >
            Single Post
          </button>
          <button
            onClick={() => setActiveTab("author")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "author"
                ? "bg-[#E8634A] text-white"
                : "text-[#E8634A] hover:bg-[#E8634A] hover:text-white"
            }`}
          >
            Author
          </button>
        </div>

        {/* Author Table */}
        {activeTab === "author" && (
          <div className="rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 px-6 py-4 border-b border-gray-200">
              {[
                { label: "Author", align: "text-left" },
                { label: "Plan", align: "text-center" },
                { label: "Amount", align: "text-center" },
                { label: "Date", align: "text-right" },
              ].map((h) => (
                <span
                  key={h.label}
                  className={`text-[#111111] font-medium leading-[120%] text-[16px] ${h.align}`}
                >
                  {h.label}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {subscriptions.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-4 px-6 py-5 items-start hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[#111111] text-[16px] leading-[120%]">
                    {row.author}
                  </span>
                  <span className="text-[#111111] text-[16px] text-center leading-[120%] px-2">
                    {row.plan}
                  </span>
                  <span className="text-[#111111] text-[16px] text-center leading-[120%]">
                    {row.amount}
                  </span>
                  <span className="text-[#111111] text-[16px] text-right leading-[120%]">
                    {row.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Post placeholder */}
        {activeTab === "single" && (
          <div className="rounded-2xl text-start text-[#5E5E6A] text-sm">
            {dummyPosts.map((post, index) => (
              <StoryPost
                key={index}
                author={post.author}
                handle={post.handle}
                avatar={post.avatar}
                timestamp={post.timestamp}
                title={post.title}
                content={post.content}
                likes={post.likes}
                comments={post.comments}
                image={post.image}
                video={post.video}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
