/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { StoryPost } from "@/components/home/StoryPost";
import type { CommentData } from "@/components/home/StoryPost";
import { Blog } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { formatRelativeTime } from "@/lib/date";
import { Skeleton } from "@/components/ui/skeleton"; 
import { useSearchParams } from "next/navigation";
import MindButton from "@/components/home/MindButton";

type UserProfile = {
  fullName?: string;
  userName?: string;
  profilePicture?: string;
  profileImage?: string;
  avatar?: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const searchTerm = (searchParams.get("searchTerm") ?? "").trim();
  const role = session?.user?.role;
  const isAuthor = typeof role === "string" && role.toLowerCase() === "author";

  const token = session?.user?.accessToken;
  const currentUserId = session?.user?.id;
  const isLoggedIn = !!token;
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const baseApiURL = isLoggedIn
    ? `${baseURL}/blog/blogs-with-lock-status`
    : `${baseURL}/blog`;
  const apiParams = new URLSearchParams();
  if (searchTerm) apiParams.set("searchTerm", searchTerm);
  const apiURL = apiParams.toString()
    ? `${baseApiURL}?${apiParams.toString()}`
    : baseApiURL;

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    enabled: isAuthor && !!token,
    queryFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch profile");
      }
      return (result?.data ?? result) as UserProfile;
    },
  });

  const avatarUrl =
    profile?.profilePicture ||
    profile?.profileImage ||
    profile?.avatar ||
    "";
  const displayName =
    profile?.fullName ||
    profile?.userName ||
    session?.user?.fullName ||
    session?.user?.userName ||
    "User";

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blogData", isLoggedIn, searchTerm],
    enabled: status !== "loading",
    queryFn: async () => {
      const res = await fetch(apiURL, {
        headers: isLoggedIn ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });

  // ✅ Card-style Skeleton UI
  if (isLoading || status === "loading") {
    return (
      <div className="py-8 flex flex-col items-center gap-4 px-0 lg:px-4">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-lg dark:border-[#2a2a2a] p-5"
          >
            {/* Header */}
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

            {/* Title */}
            <div className="mt-4">
              <Skeleton className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Content */}
            <div className="mt-3 space-y-2">
              <Skeleton className="w-full h-4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="w-full h-4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Image */}
            <div className="mt-4">
              <Skeleton className="w-full h-[260px] rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-[#2a2a2a] pt-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="w-12 h-4 bg-gray-200 dark:bg-gray-700" />
              </div>
              <Skeleton className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex flex-col items-center gap-4 justify-center px-0 lg:px-4">
        {isAuthor ? <MindButton avatarUrl={avatarUrl} name={displayName} /> : null}
        {blogData?.data?.map((post: Blog, index: number) => {
          const rawComments = post.comments ?? [];

          const topLevel = rawComments.filter((c: any) => !c.parentComment);
          const replies = rawComments.filter((c: any) => !!c.parentComment);

          const commentsData: CommentData[] = topLevel.map((c: any) => ({
            id: c._id,
            author: c.user?.userName ?? "Anonymous",
            avatar: c.user?.profilePicture ?? "",
            handle: c.user?.userName ?? "",
            time: c.createdAt
              ? formatRelativeTime(c.createdAt)
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
                  ? formatRelativeTime(r.createdAt)
                  : "",
                text: r.text ?? "",
                likes: r.likes?.length ?? 0,
              })),
          }));

          return (
            <>
           
            <StoryPost
              key={index}
              author={post.author?.userName || "Unknown"}
              handle={post.author?.userName}
              avatar={post.author?.profilePicture || post.author?.profileImage || ""}
              timestamp={post.createdAt}
              title={post.title}
              content={post.content}
              likes={post.likes?.length || 0}
              liked={
                Array.isArray(post.likes) &&
                Boolean(currentUserId) &&
                post.likes.some(
                  (likedUserId: string) =>
                    likedUserId === currentUserId
                )
              }
              comments={post.comments?.length || 0}
              commentsData={commentsData}
              image={post.image?.[0]}
              video={post.audio?.[0]}
              locked={
                post.isLocked === true ||
                (!isLoggedIn && post.audienceType === "paid")
              }
              bookmarked={post.isBookmarked === true}
              id={post._id}
              price={post.price}
              audienceType ={post.audienceType}
            />
            </>
          );
        })}
      </div>
    </div>
  );
}
