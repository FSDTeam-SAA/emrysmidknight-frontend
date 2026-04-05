"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import FollowerCard from "./_components/Followercard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ApiUser = {
  _id?: string;
  fullName?: string;
  userName?: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  followersReaders?: string[];
  followersReadersCount?: number;
  totalStories?: number;
};

type MyFollowerItem = {
  _id?: string;
  followers?: ApiUser | string | null;
  author?: ApiUser | string | null;
};

type MyFollowersResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    };
    data?: MyFollowerItem[];
  };
};

type FollowerCardItem = {
  id: string;
  followRecordId: string;
  bannerSrc: string;
  avatarSrc: string | null;
  name: string;
  handle: string;
  followers: string;
  totalStories: number;
  bio: string;
};

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80";
const DEFAULT_AVATAR = "https://randomuser.me/api/portraits/men/32.jpg";

const formatCount = (value: number) =>
  value >= 1000 ? `${Math.floor(value / 1000)}K` : `${value}`;

const resolveName = (user: ApiUser) => {
  const fullName = user.fullName?.trim();
  if (fullName) return fullName;
  const userName = user.userName?.trim();
  if (userName) return userName;
  return "Unknown";
};

const resolveHandle = (user: ApiUser) => {
  const userName = user.userName?.trim();
  if (!userName) return "@unknown";
  return userName.startsWith("@") ? userName : `@${userName}`;
};

const mapFollowItem = (item: MyFollowerItem): FollowerCardItem | null => {
  const author =
    typeof item.author === "object" && item.author !== null ? item.author : null;
  const follower =
    typeof item.followers === "object" && item.followers !== null
      ? item.followers
      : null;
  const user = author ?? follower;
  if (!user) return null;

  const authorId =
    typeof item.author === "string" ? item.author : item.author?._id;
  const followerId =
    typeof item.followers === "string" ? item.followers : item.followers?._id;
  const id = authorId ?? followerId ?? item._id;
  if (!id || !item._id) return null;

  const followersCount =
    user.followersReadersCount ?? user.followersReaders?.length ?? 0;

  return {
    id,
    followRecordId: item._id,
    bannerSrc: user.coverPicture || DEFAULT_BANNER,
    avatarSrc: user.profilePicture || DEFAULT_AVATAR,
    name: resolveName(user),
    handle: resolveHandle(user),
    followers: formatCount(followersCount),
    totalStories: Number.isFinite(user.totalStories) ? user.totalStories ?? 0 : 0,
    bio: user.bio?.trim() || "No bio available.",
  };
};

function FollowingSkeleton() {
  return (
    <div
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-2
      "
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-white dark:bg-white/5"
        >
          <div className="relative h-[140px] sm:h-[170px] md:h-[210px] w-full overflow-hidden">
            <Skeleton className="h-full w-full rounded-none bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="relative z-10 -mt-10 sm:-mt-12 md:-mt-[54px] flex items-end gap-3 px-4 sm:px-5">
            <Skeleton className="h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[120px] md:w-[120px] rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-[#121019]" />

            <div className="mb-2 space-y-2">
              <Skeleton className="h-5 w-36 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 sm:gap-4 px-4 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <Skeleton className="h-[44px] sm:h-[48px] flex-1 rounded-[8px] bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-[44px] sm:h-[48px] flex-1 rounded-[8px] bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FollowingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const isSessionLoading = status === "loading";
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<MyFollowersResponse>({
    queryKey: ["my-followers"],
    queryFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/followers/my-followers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch following");
      }
      return result as MyFollowersResponse;
    },
    enabled: status !== "loading" && !!token,
  });

  const items = useMemo(() => {
    const rows = Array.isArray(data?.data?.data) ? data?.data?.data : [];
    return rows
      .map(mapFollowItem)
      .filter((item): item is FollowerCardItem => Boolean(item));
  }, [data]);

  const unfollowMutation = useMutation({
    mutationFn: async (followRecordId: string) => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/followers/${followRecordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to unfollow");
      }
      return result as { message?: string };
    },
    onSuccess: (result) => {
      toast.success(result?.message || "Unfollowed successfully");
      queryClient.invalidateQueries({ queryKey: ["my-followers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unfollow");
    },
  });

  function handleViewProfile(user: FollowerCardItem) {
    router.push(`/author-profile/${user.id}`);
  }

  function handleUnfollow(followRecordId: string) {
    unfollowMutation.mutate(followRecordId);
  }

  const isBusy = isLoading || isSessionLoading;

  return (
    <main className="px-1 py-10 sm:px-4 lg:px-2 overflow-visible">
      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] leading-tight font-semibold">
          Following
        </h1>
      </div>

      {isBusy ? (
        <FollowingSkeleton />
      ) : !token ? (
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300">
          Please sign in to view who you are following.
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300">
          You are not following anyone yet.
        </p>
      ) : (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-2
          "
        >
          {items.map((user) => (
            <FollowerCard
              key={user.id}
              bannerSrc={user.bannerSrc}
              avatarSrc={user.avatarSrc}
              name={user.name}
              handle={user.handle}
              followers={user.followers}
              totalStories={user.totalStories}
              bio={user.bio}
              onViewProfile={() => handleViewProfile(user)}
              onUnfollow={() => handleUnfollow(user.followRecordId)}
            />
          ))}
        </div>
      )}

      {error && !isBusy && (
        <p className="mt-4 text-sm text-[#5E5E5E] dark:text-gray-300">
          Failed to load following. Please try again.
        </p>
      )}
    </main>
  );
}
