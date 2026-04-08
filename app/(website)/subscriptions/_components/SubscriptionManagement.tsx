"use client";

import { StoryPost } from "@/components/home/StoryPost";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "single" | "author";

interface SubscriptionRow {
  id: string;
  author: string;
  plan: string;
  planMeta?: string;
  amount: string;
  status?: string;
  date: string;
}

type PaymentUser = {
  _id?: string;
  fullName?: string;
  userName?: string;
  profilePicture?: string;
};

type PaymentBlog = {
  _id?: string;
  title?: string;
  content?: string;
  image?: string[];
  audio?: string[];
  likes?: string[];
  comments?: string[] | unknown[];
  author?: PaymentUser | string;
  createdAt?: string;
  price?: number;
};

type PaymentPlan = {
  _id?: string;
  author?: PaymentUser | string;
  name?: string;
  price?: number;
  duration?: string;
  features?: string[];
  blogs?: PaymentBlog[];
};

type PaymentItem = {
  _id: string;
  blog?: PaymentBlog;
  plan?: PaymentPlan;
  user?: PaymentUser;
  paymentType?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
};

type BlogCardItem = {
  id: string;
  blog: PaymentBlog;
  payment: PaymentItem;
  plan?: PaymentPlan;
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

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState<Tab>("single");
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["blogAndAuthorData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/my-payments?paymentType=subscription`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      const result: PaymentsResponse = await res.json();
      return result?.data?.data ?? [];
    },
    enabled: !!TOKEN,
  });

  const subscriptionPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          payment.plan &&
          payment.plan._id &&
          payment.status === "completed",
      ),
    [payments],
  );

  const singlePostItems = useMemo(() => {
    const map = new Map<string, BlogCardItem>();

    payments.forEach((payment) => {
      if (payment.blog && payment.blog._id) {
        map.set(payment.blog._id, {
          id: payment.blog._id,
          blog: payment.blog,
          payment,
        });
      }

      if (Array.isArray(payment.plan?.blogs)) {
        payment.plan.blogs.forEach((blog) => {
          if (blog._id) {
            map.set(blog._id, {
              id: blog._id,
              blog,
              payment,
              plan: payment.plan,
            });
          }
        });
      }
    });

    return Array.from(map.values());
  }, [payments]);

  const authorIds = useMemo(() => {
    const ids = new Set<string>();
    payments.forEach((payment) => {
      const authorField = payment.blog?.author;
      const planAuthorField = payment.plan?.author;
      const authorId =
        typeof authorField === "string" ? authorField : authorField?._id;
      const planAuthorId =
        typeof planAuthorField === "string"
          ? planAuthorField
          : planAuthorField?._id;
      if (authorId) ids.add(authorId);
      if (planAuthorId && typeof planAuthorField === "string") {
        ids.add(planAuthorId);
      }
    });
    return Array.from(ids);
  }, [payments]);

  const { data: authorInfoMap = {} } = useQuery({
    queryKey: ["subscription-authors", authorIds],
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

  const authorRows = useMemo(() => {
    const rowsMap = new Map<string, SubscriptionRow>();

    subscriptionPayments.forEach((payment) => {
      const plan = payment.plan;
      if (!plan) return;

      const planAuthor = plan.author;
      const authorId =
        typeof planAuthor === "string" ? planAuthor : planAuthor?._id;
      if (!authorId) return;

      const authorNameRaw =
        typeof planAuthor === "string"
          ? (authorInfoMap[planAuthor]?.fullName ||
            authorInfoMap[planAuthor]?.userName ||
            "")
          : planAuthor?.fullName || planAuthor?.userName || "";
      const authorName = authorNameRaw || "Unknown Author";

      const amountValue =
        typeof payment.amount === "number"
          ? payment.amount
          : typeof plan.price === "number"
            ? plan.price
            : 0;
      const dateText = payment.createdAt
        ? format(new Date(payment.createdAt), "d MMM, yyyy")
        : "-";
      const blogCount = Array.isArray(plan.blogs) ? plan.blogs.length : 0;
      const durationLabel = plan.duration || "monthly";
      const planMeta = `${durationLabel}${
        blogCount ? ` • ${blogCount} blog${blogCount > 1 ? "s" : ""}` : ""
      }`;

      rowsMap.set(payment._id, {
        id: payment._id,
        author: authorName,
        plan: plan.name || "Subscription",
        planMeta,
        amount: `$${amountValue.toFixed(2)}`,
        status: payment.status,
        date: dateText,
      });
    });

    return Array.from(rowsMap.values());
  }, [subscriptionPayments, authorInfoMap]);

  return (
    <div className="min-h-screen px-4">
      <h1 className="text-[#121212] dark:text-white text-[28px] lg:text-[36px] font-bold mt-3 mb-5">
        Subscription
      </h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Tab Switcher — matches image exactly */}
        <div className="flex rounded-[8px] overflow-hidden p-1 gap-1 bg-[#FFFFFF] dark:bg-[#FFFFFF0D]">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "single"
                ? "bg-[#FCD2D7] dark:bg-[#F66F7D] text-black dark:text-white"
                : "text-[#F66F7D] hover:bg-[#FCD2D7] dark:hover:bg-[#F66F7D] hover:text-black"
            }`}
          >
            Single Post
          </button>
          <button
            onClick={() => setActiveTab("author")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "author"
                ? "bg-[#FCD2D7] dark:bg-[#F66F7D] text-black dark:text-white"
                : "text-[#F66F7D] hover:bg-[#FCD2D7] dark:hover:bg-[#F66F7D] hover:text-black"
            }`}
          >
            Author
          </button>
        </div>

        {/* Author Table */}
        {activeTab === "author" && (
          <div className="rounded-lg overflow-hidden dark:bg-[#FFFFFF0D] bg-[#FFFFFF]">
            {/* Table Header */}
            <div className="grid grid-cols-4 px-6 py-4 border-b dark:border-[#5E5E5E] border-[#D7D7D7]">
              {[
                { label: "Author", align: "text-left" },
                { label: "Plan", align: "text-center" },
                { label: "Amount", align: "text-center" },
                { label: "Date", align: "text-right" },
              ].map((h) => (
                <span
                  key={h.label}
                  className={`text-[#111111] dark:text-white font-medium leading-[120%] text-[16px] ${h.align}`}
                >
                  {h.label}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y dark:divide-[#5E5E5E] divide-[#D7D7D7]">
              {isLoading
                ? [1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="grid grid-cols-4 px-6 py-5 items-start"
                    >
                      <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-20 mx-auto bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-16 mx-auto bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-20 ml-auto bg-gray-200 dark:bg-gray-700" />
                    </div>
                  ))
                : null}
              {!isLoading && authorRows.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-[#7D7D7D]">
                  No author subscriptions found.
                </div>
              ) : null}
              {authorRows.map((row) => {
                const statusClass =
                  row.status === "completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200"
                    : row.status === "pending"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                      : "bg-[#F2F2F2] text-[#5E5E6A] dark:bg-[#FFFFFF14] dark:text-[#CFCFCF]";

                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-4 px-6 py-5 items-start hover:bg-[#FFFFFF0D] transition-colors"
                  >
                    <span className="text-[#111111] dark:text-white text-[16px] leading-[120%]">
                      {row.author}
                    </span>
                    <span className="text-[#111111] dark:text-white text-[16px] text-center leading-[120%] px-2">
                      <span className="block">{row.plan}</span>
                      {row.planMeta ? (
                        <span className="mt-1 block text-xs text-[#7D7D7D] dark:text-[#B0B0B0]">
                          {row.planMeta}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[#111111] dark:text-white text-[16px] text-center leading-[120%]">
                      <span className="block">{row.amount}</span>
                      {row.status ? (
                        <span
                          className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass}`}
                        >
                          {row.status}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[#111111] dark:text-white text-[16px] text-right leading-[120%]">
                      {row.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Single Post placeholder */}
        {activeTab === "single" && (
          <div className="rounded-2xl text-start text-[#5E5E6A] mb-4 text-sm flex flex-col gap-6">
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
            {!isLoading && singlePostItems.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#D7D7D7] dark:border-[#5E5E5E] px-6 py-8 text-center text-sm text-[#7D7D7D]">
                No single post purchases found.
              </div>
            ) : null}
            {singlePostItems.map((item) => {
              const blog = item.blog;
              const planAuthor = item.plan?.author;
              const blogAuthor = blog.author;
              const author =
                typeof blogAuthor === "object" && blogAuthor
                  ? blogAuthor
                  : typeof planAuthor === "object" && planAuthor
                    ? planAuthor
                    : typeof blogAuthor === "string"
                      ? (authorInfoMap[blogAuthor] ?? undefined)
                      : typeof planAuthor === "string"
                        ? (authorInfoMap[planAuthor] ?? undefined)
                        : undefined;
              const authorId =
                typeof blogAuthor === "string"
                  ? blogAuthor
                  : blogAuthor?._id ||
                    (typeof planAuthor === "string"
                      ? planAuthor
                      : planAuthor?._id);
              return (
                <StoryPost
                  key={item.id}
                  authorId={authorId || author?._id}
                  author={author?.fullName || author?.userName || "Unknown"}
                  handle={author?.userName || "author"}
                  avatar={author?.profilePicture || ""}
                  timestamp={
                    blog.createdAt ||
                    item.payment.createdAt ||
                    new Date().toISOString()
                  }
                  title={blog.title || "Untitled"}
                  content={blog.content || ""}
                  likes={blog.likes?.length || 0}
                  comments={Array.isArray(blog.comments) ? blog.comments.length : 0}
                  image={blog.image?.[0]}
                  video={blog.audio?.[0]}
                  locked={false}
                  id={blog._id}
                  price={blog.price || item.payment.amount || 0}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
