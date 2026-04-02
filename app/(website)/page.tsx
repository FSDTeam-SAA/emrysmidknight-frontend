"use client";

import { StoryPost } from "@/components/home/StoryPost";
import { Blog } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  const token = session?.user?.accessToken;
  const isLoggedIn = !!token;

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const apiURL = isLoggedIn
    ? `${baseURL}/blog/blogs-with-lock-status`
    : `${baseURL}/blog`;

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blogData", isLoggedIn],
    enabled: status !== "loading",
    queryFn: async () => {
      const res = await fetch(apiURL, {
        headers: isLoggedIn
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      if (!res.ok) throw new Error("Failed to fetch blogs");

      return res.json();
    },
  });

  if (isLoading || status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="py-8">
      <div className="flex flex-col items-center gap-4 justify-center px-0 lg:px-4">
        {blogData?.data?.map((post: Blog, index: number) => (
          <StoryPost
            key={index}
            author={post.author?.fullName || "Unknown"}   // ✅ FIX
            handle={post.author?.userName}                // ✅ FIX
            avatar={post.author?.profileImage || ""}      // (fallback)
            timestamp={post.createdAt}
            title={post.title}
            content={post.content}                        // ✅ FIX
            likes={post.likes?.length || 0}               // ✅ FIX
            comments={post.comments?.length || 0}         // ✅ FIX
            image={post.image?.[0]}                       // ✅ FIX (array → single)
            video={post.audio?.[0]}                       // (optional use)
            
            // 🔒 lock logic (IMPORTANT)
            locked={post.isLocked === true}
          />
        ))}
      </div>
    </div>
  );
}