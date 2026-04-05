"use client";

import { useState } from "react";
import { StoryPost } from "@/components/home/StoryPost";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { Blog } from "@/types/type";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("Fantasy");
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const currentUserId = session?.user?.id;
  const isLoggedIn = !!token;
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const apiURL = isLoggedIn
    ? `${baseURL}/blog/blogs-with-lock-status`
    : `${baseURL}/blog`;

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["explore-blogs", activeCategory, isLoggedIn],
    enabled: status !== "loading",
    queryFn: async () => {
      const url = `${apiURL}?category=${encodeURIComponent(activeCategory)}`;
      const res = await fetch(url, {
        headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch explore blogs");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen font-sans px-4">
      {/* Title */}
      <h1 className="text-[#121212] dark:text-white text-[28px] lg:text-[36px] font-bold mt-3 mb-5">
        Explore
      </h1>

      {/* Category Carousel */}
      <div className="mb-6 mx-auto">
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
      <div className="flex flex-col items-center gap-4 justify-center">
        {isLoading ? (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-lg p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="space-y-2">
                      <Skeleton className="w-32 h-4 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="w-20 h-3 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                  <Skeleton className="w-16 h-3 bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="mt-4">
                  <Skeleton className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="mt-3 space-y-2">
                  <Skeleton className="w-full h-4 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="w-full h-4 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="mt-4">
                  <Skeleton className="w-full h-[260px] rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </>
        ) : null}

        {!isLoading &&
          (blogsData?.data ?? []).map((post: Blog) => (
          <StoryPost
            key={post._id}
            author={post.author?.userName || "Unknown"}
            handle={post.author?.userName || ""}
            avatar={post.author?.profilePicture || post.author?.profileImage || ""}
            timestamp={post.createdAt}
            title={post.title}
            content={post.content}
            likes={post.likes?.length || 0}
            liked={
              Array.isArray(post.likes) &&
              Boolean(currentUserId) &&
              post.likes.some((likedUserId: string) => likedUserId === currentUserId)
            }
            comments={post.comments?.length || 0}
            image={post.image?.[0]}
            video={post.audio?.[0]}
            locked={post.isLocked === true}
            bookmarked={post.isBookmarked === true}
            id={post._id}
            price={post.price}
          />
          ))}
        {!isLoading && (blogsData?.data ?? []).length === 0 ? (
          <p className="text-sm text-[#7D7D7D] dark:text-[#D7D7D7] py-6">
            No posts found for this category.
          </p>
        ) : null}
      </div>
    </div>
  );
}
