"use client";

import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoryPost } from "@/components/home/StoryPost";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type AuthorProfile = {
  _id?: string;
  fullName?: string;
  userName?: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
};

type AuthorStats = {
  totalBlogs?: number;
  freeBlogs?: number;
  paidBlogs?: number;
  lockedBlogs?: number;
  totalFollowers?: number;
};

type SubscriptionPlan = {
  _id?: string;
  name?: string;
  price?: number;
  duration?: string;
  isSubscribed?: boolean;
  blogsCount?: number;
};

type BlogAuthor = {
  _id?: string;
  fullName?: string;
  userName?: string;
  profilePicture?: string;
};

type BlogItem = {
  _id?: string;
  image?: string[];
  audio?: string[];
  attachment?: string[];
  category?: string;
  title?: string;
  content?: string | null;
  previewContent?: string;
  author?: BlogAuthor;
  audienceType?: "free" | "paid";
  price?: number;
  likes?: string[];
  comments?: string[];
  createdAt?: string;
  updatedAt?: string;
  isLocked?: boolean;
  accessType?: string;
};

type AuthorProfileResponse = {
  author?: AuthorProfile;
  stats?: AuthorStats;
  subscriptionPlans?: SubscriptionPlan[];
  blogs?: {
    data?: BlogItem[];
  };
};

const formatCount = (value?: number) => {
  if (!value) return "0";
  return value >= 1000 ? `${Math.floor(value / 1000)}K` : `${value}`;
};

export default function StoriesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "free" | "locked">("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const params = useParams();
  const authorId = useMemo(() => {
    const raw = params?.id;
    if (Array.isArray(raw)) return raw[0];
    return raw as string | undefined;
  }, [params]);

  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery<AuthorProfileResponse>({
    queryKey: ["author-profile", authorId, token],
    queryFn: async () => {
      if (!authorId) throw new Error("Missing author id");
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/author-profile/${authorId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch author profile");
      }
      return (result?.data ?? {}) as AuthorProfileResponse;
    },
    enabled: !!authorId && !!token,
  });

  const author = profile?.author;
  const stats = profile?.stats;
  const subscriptionPlans = profile?.subscriptionPlans ?? [];
  const allBlogs = useMemo(() => profile?.blogs?.data ?? [], [profile?.blogs?.data]);

  const stories = useMemo(() => {
    if (activeTab === "free") {
      return allBlogs.filter(
        (story) =>
          story.audienceType === "free" ||
          story.price === 0 ||
          story.accessType === "free",
      );
    }
    if (activeTab === "locked") {
      return allBlogs.filter(
        (story) => story.isLocked || story.accessType === "locked",
      );
    }
    return allBlogs;
  }, [activeTab, allBlogs]);

  return (
    <div className="min-h-screen bg-[color:var(--page-bg)] text-[color:var(--page-text)]">
      <div className="w-full px-1">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 mb-6">
          <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">
            Stories
          </h1>
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="ghost"
            className="h-9 w-9 p-0 text-[color:var(--text-primary)] hover:bg-[color:var(--surface-alt)]"
          >
            ☰
          </Button>
        </div>

        {/* Backdrop for mobile drawer */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0  lg:hidden "
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-[370px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside>
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="rounded-[8px] p-6 bg-[#FFFFFF] dark:bg-[#FFFFFF0D]">
                <h2 className="text-[32px] font-semibold text-[color:var(--text-primary)] mb-3">
                  Personal details
                </h2>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[color:var(--text-secondary)] text-base leading-6 mb-6">
                      {author?.bio || "No bio available yet."}
                    </p>

                    <div className="space-y-3 text-xl">
                      <div>
                        <span className="text-[#121212] dark:text-white">
                          Followers:{" "}
                        </span>
                        <span className="text-[#121212] dark:text-white">
                          {formatCount(stats?.totalFollowers)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#121212] dark:text-white">
                          Total Stories:{" "}
                        </span>
                        <span className="text-[#121212] dark:text-white">
                          {stats?.totalBlogs ?? 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#121212] dark:text-white">
                          Email:{" "}
                        </span>
                        <span className="text-[#121212] dark:text-white">
                          {author?.email || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Collections */}
              <div className="">
                {/* <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)] mb-4">
                  Collections
                </h3> */}
                <div className="space-y-2">
                  {isLoading ? (
                    [1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="w-full flex items-center justify-between bg-[#FFFFFF] !rounded-[4px] dark:bg-[#FFFFFF0D] px-4 py-3"
                      >
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    ))
                  ) : subscriptionPlans.length > 0 ? (
                    subscriptionPlans.map((plan) => (
                      <button
                        key={plan._id || plan.name}
                        className="w-full flex items-center justify-between bg-[#FFFFFF] !rounded-[4px] dark:bg-[#FFFFFF0D] px-4 py-3 text-left text-base text-[#F66F7D] transition "
                      >
                        <span>
                          {plan.name || "Untitled plan"}
                          {plan.price !== undefined ? (
                            <span className="ml-2 text-xs text-[#9a9a9a]">
                              ${plan.price}/{plan.duration || "month"}
                            </span>
                          ) : null}
                        </span>
                        <Lock className="h-4 w-4 text-[#F66F7D]" />
                      </button>
                    ))
                  ) : (
                    <div className="rounded-[4px] bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-4 py-3 text-sm text-[#7D7D7D]">
                      No subscription plans available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            <div className="mx-auto max-w-2xl">
              {/* Sticky Tabs */}
              <div className="sticky top-0 z-10">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    if (
                      value === "all" ||
                      value === "free" ||
                      value === "locked"
                    ) {
                      setActiveTab(value);
                    }
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 rounded-[8px] bg-[#FFFFFF] dark:bg-[#FFFFFF0D]">
                    <TabsTrigger
                      value="all"
                      className="rounded-[8px] text-xs font-medium leading-[120%] text-[#121212] dark:text-white data-[state=active]:bg-[#FCD2D7] data-[state=active]:text-black dark:data-[state=active]:bg-[#F66F7D] dark:data-[state=active]:text-white md:text-sm"
                    >
                      All Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="free"
                      className="rounded-[8px] h-[48px] text-xs font-medium text-[#121212] dark:text-white data-[state=active]:bg-[#FCD2D7] data-[state=active]:text-black dark:data-[state=active]:bg-[#F66F7D] dark:data-[state=active]:text-white md:text-sm"
                    >
                      Free Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="locked"
                      className="rounded-[8px] text-xs font-medium text-[#121212] dark:text-white data-[state=active]:bg-[#FCD2D7] data-[state=active]:text-black dark:data-[state=active]:bg-[#F66F7D] dark:data-[state=active]:text-white md:text-sm"
                    >
                      Locked Content
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Tab Content */}
              <div className="pt-6 space-y-6">
                {isError ? (
                  <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                    {(error as Error)?.message ||
                      "Failed to load author stories."}
                  </div>
                ) : null}

                {isLoading ? (
                  [1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-lg p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-[180px] w-full" />
                    </div>
                  ))
                ) : stories.length > 0 ? (
                  stories.map((story) => {
                    const storyAuthor = story.author?.fullName?.trim()?.length
                      ? story.author?.fullName
                      : story.author?.userName || author?.fullName || "Author";
                    const storyHandle =
                      story.author?.userName || author?.userName || "unknown";
                    const storyAvatar =
                      story.author?.profilePicture ||
                      author?.profilePicture ||
                      "/profile1.png";
                    const storyImage = story.image?.[0];
                    const storyContent = story.content || story.previewContent || "";
                    const storyTimestamp =
                      story.createdAt || story.updatedAt || new Date().toISOString();
                    const isLocked = story.isLocked || story.accessType === "locked";

                    return (
                      <StoryPost
                        key={story._id}
                        id={story._id}
                        author={storyAuthor}
                        handle={storyHandle}
                        avatar={storyAvatar}
                        timestamp={storyTimestamp}
                        title={story.title || "Untitled"}
                        content={storyContent}
                        likes={story.likes?.length ?? 0}
                        comments={story.comments?.length ?? 0}
                        image={storyImage}
                        locked={isLocked}
                        price={story.price}
                        audienceType={story.audienceType}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[color:var(--text-secondary)]">
                      {activeTab === "all"
                        ? "No stories in this category"
                        : activeTab === "free"
                          ? "No free stories available"
                          : "No locked stories available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
