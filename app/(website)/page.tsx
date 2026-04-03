/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { StoryPost } from "@/components/home/StoryPost";
import type { CommentData } from "@/components/home/StoryPost";
import { Blog } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: session, status } = useSession();

  const token = session?.user?.accessToken;
  const currentUserId = session?.user?.id;
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
        headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {},
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
        {blogData?.data?.map((post: Blog, index: number) => {
          const rawComments = post.comments ?? [];

          // Separate top-level comments and replies using parentComment field
          const topLevel = rawComments.filter((c: any) => !c.parentComment);
          const replies = rawComments.filter((c: any) => !!c.parentComment);

          const commentsData: CommentData[] = topLevel.map((c: any) => ({
            id: c._id,
            author: c.user?.userName ?? "Anonymous",
            avatar: c.user?.profilePicture ?? "",
            handle: c.user?.userName ?? "",
            time: c.createdAt
              ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })
              : "",
            text: c.text ?? "",
            likes: c.likes?.length ?? 0,
            replies: replies
              .filter((r: any) => r.parentComment === c._id)
              .map((r: any) => ({
                id: r._id,
                author: r.user?.userName ?? "Anonymous",
                avatar: r.user?.profilePicture ?? "",
                handle: r.user?.userName ?? "",
                time: r.createdAt
                  ? formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })
                  : "",
                text: r.text ?? "",
                likes: r.likes?.length ?? 0,
              })),
          }));

          return (
            <StoryPost
              key={index}
              author={post.author?.userName || "Unknown"}
              handle={post.author?.userName}
              avatar={post.author?.profileImage || ""}
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
              commentsData={commentsData}
              image={post.image?.[0]}
              video={post.audio?.[0]}
              locked={post.isLocked === true}
              id={post._id}   // ✅ ADD THIS
            />
          );
        })}
      </div>
    </div>
  );
}
