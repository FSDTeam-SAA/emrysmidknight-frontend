"use client";

import React, { useState } from "react";
import { StoryPost } from "@/components/home/StoryPost";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const categories = [
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Mystery",
  "Thriller",
  "Horror",
  "Adventure",
  "Drama",
  "Comedy",
  "Historical",
  "Historicall",
];

const dummyPosts = [
  {
    author: "Eleanor Pena",
    handle: "oliverking",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor",
    timestamp: "2 hours ago",
    title: "Dragon's Awakening – Chapter 5",
    content: `The mountains had always been quiet...`,
    likes: 27,
    comments: 657,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    locked: true,
  },
  {
    author: "Floyd Miles",
    handle: "lilywhite",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Floyd",
    timestamp: "4 hours ago",
    title: "The Shadow Kingdom – Chapter 1",
    content: `The moon hovered above the silent ruins of Eldoria...`,
    likes: 27,
    comments: 657,
  },
  {
    author: "Dianne Russell",
    handle: "noahsmith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dianne",
    timestamp: "2 hours ago",
    title: "Crown of Fire – Chapter 4",
    content: `In the kingdom of Emberfall...`,
    likes: 42,
    comments: 891,
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    author: "Marcus Rodriguez",
    handle: "marcusauthor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    timestamp: "8 hours ago",
    title: "The Last Light – Chapter 2",
    content: `As the sun began to set over the horizon...`,
    likes: 19,
    comments: 524,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
  },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("Fantasy");

  return (
    <div className="min-h-screen font-sans">
      {/* Title */}
      <h1 className="text-[#121212] dark:text-white text-[28px] lg:text-[36px] font-bold mt-3 mb-5">
        Explore
      </h1>

      {/* Category Carousel */}
      <div className="mb-6 w-[95%] mx-auto">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {categories.map((cat) => (
              <CarouselItem key={cat} className="pl-2 basis-auto">
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                    ${
                      activeCategory === cat
                        ? "bg-[#121212] dark:bg-white text-white dark:text-[#121212] border-[#121212] dark:border-white"
                        : "bg-transparent text-[#121212] dark:text-gray-300 border-[#D1D1D1] dark:border-[#2C2C2C] hover:border-[#F66F7D] hover:text-[#F66F7D]"
                    }`}
                >
                  {cat}
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Posts */}
      <div className="flex flex-col items-center gap-4 justify-center px-0 lg:px-4">
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
            locked={post.locked}
          />
        ))}
      </div>
    </div>
  );
}