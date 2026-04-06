"use client";

import { StoryPost } from "@/components/home/StoryPost";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

type PaymentUser = {
  _id?: string;
  fullName?: string;
  userName?: string;
  profilePicture?: string;
};

type PaymentBlog = {
  _id?: string;
  title?: string;
  content?: string | null;
  previewContent?: string;
  image?: string[];
  audio?: string[];
  likes?: string[];
  comments?: string[] | unknown[];
  author?: PaymentUser | string;
  createdAt?: string;
  price?: number;
};

type PaymentItem = {
  _id: string;
  blog?: PaymentBlog;
  paymentType?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
};

type PaymentsResponse = {
  data?: {
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data?: PaymentItem[];
  };
};

type UserResponse = {
  data?: {
    _id?: string;
    fullName?: string;
    userName?: string;
    profilePicture?: string;
  };
};

export default function UnlockedBlogsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["my-unlocked-blogs", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/my-payments?paymentType=blog`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch unlocked blogs");
      const result: PaymentsResponse = await res.json();
      return result?.data?.data ?? [];
    },
    enabled: !!token,
  });

  const blogPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.blog &&
          payment.blog._id &&
          (payment.status ? payment.status === "completed" : true),
      ),
    [payments],
  );

  const authorIds = useMemo(() => {
    const ids = new Set<string>();
    blogPayments.forEach((payment) => {
      const authorField = payment.blog?.author;
      const authorId =
        typeof authorField === "string" ? authorField : authorField?._id;
      if (authorId) ids.add(authorId);
    });
    return Array.from(ids);
  }, [blogPayments]);

  const { data: authorInfoMap = {} } = useQuery({
    queryKey: ["unlocked-blog-authors", authorIds],
    queryFn: async () => {
      if (authorIds.length === 0) return {} as Record<string, PaymentUser>;

      const entries = await Promise.all(
        authorIds.map(async (authorId) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${authorId}`,
          );
          if (!res.ok) return [authorId, {} as PaymentUser] as const;
          const result: UserResponse = await res.json();
          return [authorId, (result?.data ?? {}) as PaymentUser] as const;
        }),
      );

      return entries.reduce<Record<string, PaymentUser>>((acc, [id, user]) => {
        acc[id] = user;
        return acc;
      }, {});
    },
    enabled: authorIds.length > 0,
  });

  return (
    <div className="min-h-screen px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-[#121212] dark:text-white text-[28px] md:text-[32px] font-semibold">
            My Unlock Blogs
          </h1>
          <p className="text-sm text-[#7D7D7D] dark:text-[#B0B0B0]">
            Blogs you have unlocked from purchases.
          </p>
        </div>

        <div className="space-y-6">
          {isLoading
            ? [1, 2].map((item) => (
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

          {!isLoading && blogPayments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#D7D7D7] dark:border-[#5E5E5E] px-6 py-8 text-center text-sm text-[#7D7D7D]">
              No unlocked blogs found.
            </div>
          ) : null}

          {blogPayments.map((payment) => {
            const blog = payment.blog!;
            const blogAuthor = blog.author;
            const author =
              typeof blogAuthor === "object" && blogAuthor
                ? blogAuthor
                : typeof blogAuthor === "string"
                  ? (authorInfoMap[blogAuthor] ?? undefined)
                  : undefined;
            const authorId =
              typeof blogAuthor === "string" ? blogAuthor : blogAuthor?._id;
            const storyContent = blog.content || blog.previewContent || "";

            return (
              <StoryPost
                key={blog._id || payment._id}
                authorId={authorId || author?._id}
                author={author?.fullName || author?.userName || "Unknown"}
                handle={author?.userName || "author"}
                avatar={author?.profilePicture || ""}
                timestamp={
                  blog.createdAt || payment.createdAt || new Date().toISOString()
                }
                title={blog.title || "Untitled"}
                content={storyContent}
                likes={blog.likes?.length || 0}
                comments={Array.isArray(blog.comments) ? blog.comments.length : 0}
                image={blog.image?.[0]}
                video={blog.audio?.[0]}
                locked={false}
                id={blog._id}
                price={blog.price || payment.amount || 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
