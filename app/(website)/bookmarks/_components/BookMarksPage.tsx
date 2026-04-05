"use client";
import { StoryPost } from "@/components/home/StoryPost";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

type BookmarkBlog = {
  _id: string;
  image?: string[];
  audio?: string[];
  category?: string;
  title?: string;
  content?: string;
  author?: string | { _id?: string; fullName?: string; userName?: string; profilePicture?: string };
  audienceType?: "free" | "paid";
  price?: number;
  likes?: string[];
  comments?: string[] | unknown[];
  createdAt?: string;
};

type BookmarkItem = {
  _id: string;
  blog?: BookmarkBlog;
};

type BookmarkResponse = {
  data?: BookmarkItem[];
};

type UserResponse = {
  data?: {
    _id?: string;
    fullName?: string;
    userName?: string;
    profilePicture?: string;
  };
};

export default function BookMarksPage() {
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";

  const { data: bookmarkData = [], isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookmark/my`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      const result: BookmarkResponse = await res.json();
      return result?.data ?? [];
    },
    enabled: !!TOKEN,
  });

  const authorIds = Array.from(
    new Set(
      bookmarkData
        .map((item) =>
          item.blog && typeof item.blog.author === "string"
            ? item.blog.author
            : undefined,
        )
        .filter(Boolean) as string[],
    ),
  );

  const { data: authorInfoMap = {} } = useQuery({
    queryKey: ["bookmark-authors", authorIds],
    queryFn: async () => {
      if (authorIds.length === 0) return {} as Record<string, UserResponse["data"]>;

      const entries = await Promise.all(
        authorIds.map(async (authorId) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${authorId}`,
          );
          if (!res.ok) return [authorId, {}] as const;
          const result: UserResponse = await res.json();
          return [authorId, result?.data ?? {}] as const;
        }),
      );

      return entries.reduce<Record<string, UserResponse["data"]>>((acc, [id, user]) => {
        acc[id] = user;
        return acc;
      }, {});
    },
    enabled: authorIds.length > 0,
  });
  return (
    <div className="min-h-screen font-sans pl-6">
      {/* Title */}
      <h1 className="text-[#121212] dark:text-white text-[28px] lg:text-[36px] font-bold mt-3 mb-5">
        Bookmarks
      </h1>

      {/* Posts */}
      <div className="flex flex-col items-center gap-4 justify-center">
        {isLoading
          ? [1, 2, 3].map((item) => (
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
            ))
          : null}

        {!isLoading &&
          bookmarkData.map((item) => {
            const blog = item.blog;
            if (!blog?._id) return null;

            const authorObj =
              typeof blog.author === "string"
                ? authorInfoMap[blog.author]
                : blog.author;
            const authorId =
              typeof blog.author === "string" ? blog.author : blog.author?._id;

            return (
              <StoryPost
                key={item._id}
                authorId={authorId || authorObj?._id}
                author={authorObj?.fullName || authorObj?.userName || "Unknown"}
                handle={authorObj?.userName || "author"}
                avatar={authorObj?.profilePicture || ""}
                timestamp={blog.createdAt || new Date().toISOString()}
                title={blog.title || "Untitled"}
                content={blog.content || ""}
                likes={blog.likes?.length || 0}
                comments={Array.isArray(blog.comments) ? blog.comments.length : 0}
                image={blog.image?.[0]}
                video={blog.audio?.[0]}
                locked={false}
                bookmarked={true}
                id={blog._id}
                price={blog.price || 0}
              />
            );
          })}

        {!isLoading && bookmarkData.length === 0 ? (
          <p className="text-sm text-[#7D7D7D] dark:text-[#D7D7D7] py-6">
            No bookmarks found.
          </p>
        ) : null}
      </div>
    </div>
  );
}
