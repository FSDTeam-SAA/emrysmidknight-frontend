"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ added

type SuggestedAuthor = {
  _id: string;
  fullName?: string;
  userName: string;
  bio?: string;
  profilePicture?: string;
  followersReaders?: string[];
  followersReadersCount?: number;
};

type SuggestedAuthorResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: SuggestedAuthor[];
};

type MyFollowingItem = {
  _id: string;
  author?: {
    _id?: string;
  } | string;
};

type MyFollowingResponse = {
  data?: {
    data?: MyFollowingItem[];
  };
};

interface SuggestedAuthorCardProps {
  author: SuggestedAuthor;
  followersCount: number;
  isFollowing: boolean;
  isPending: boolean;
  isLoggedIn: boolean;
  onFollow: (author: SuggestedAuthor) => void;
}

export function SuggestedAuthorCard({
  author,
  followersCount,
  isFollowing,
  isPending,
  isLoggedIn,
  onFollow,
}: SuggestedAuthorCardProps) {
  const displayName =
    author.fullName && author.fullName.trim().length > 0
      ? author.fullName
      : author.userName;

  const profileSrc =
    author.profilePicture && author.profilePicture.trim().length > 0
      ? author.profilePicture
      : "/profile.png";

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <Link
          href={`/author-profile/${author._id}`}
          className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0"
          onClick={(event) => {
            if (!isLoggedIn) {
              event.preventDefault();
              event.stopPropagation();
              toast.warning("Please login and continue.");
            }
          }}
        >
          <Image
            src={profileSrc}
            alt={displayName}
            fill
            className="rounded-full object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/author-profile/${author._id}`}
            onClick={(event) => {
              if (!isLoggedIn) {
                event.preventDefault();
                event.stopPropagation();
                toast.warning("Please login and continue.");
              }
            }}
          >
            <h3 className="font-medium text-[20px] sm:text-xl text-[#121212] dark:text-[#FFFFFF] truncate">
              {displayName}
            </h3>
          </Link>

          <p className="text-base sm:text-sm text-[#7D7D7D] mt-0.5">
            Followers:{" "}
            {followersCount >= 1000
              ? `${Math.floor(followersCount / 1000)}K`
              : followersCount}
          </p>
        </div>
      </div>

      <Button
        onClick={() => onFollow(author)}
        disabled={isPending}
        variant="outline"
        className="ml-3 sm:ml-4 text-xs sm:text-sm bg-transparent font-normal text-[#F66F7D] border-[#F66F7D] h-8 sm:h-[37px] px-[15px] whitespace-nowrap disabled:opacity-70"
      >
        {isPending ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}

export function SuggestedAuthorSection() {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = session?.data?.user?.accessToken || "";
  const isLoggedIn = Boolean(token);

  const [showAll, setShowAll] = useState(false);
  const INITIAL_VISIBLE = 4;

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [followingRecordMap, setFollowingRecordMap] = useState<Record<string, string>>({});
  const [followersDeltaMap, setFollowersDeltaMap] = useState<Record<string, number>>({});
  const [pendingAuthorId, setPendingAuthorId] = useState<string | null>(null);

  const {
    data: authors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["suggested-authors"],
    queryFn: async () => {
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/?role=author`,
        {
          method: "GET",
          headers,
        },
      );
      if (!res.ok) throw new Error("Failed to fetch suggested authors");
      const result: SuggestedAuthorResponse = await res.json();
      return result?.data ?? [];
    },
  });

  const { data: followingByAuthorId = {} } = useQuery({
    queryKey: ["my-followings", token],
    queryFn: async () => {
      if (!token) return {} as Record<string, string>;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/followers/my-followers?limit=200&page=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) return {} as Record<string, string>;
      const result: MyFollowingResponse = await res.json();
      const rows = result?.data?.data ?? [];

      return rows.reduce<Record<string, string>>((acc, row) => {
        const authorId =
          typeof row.author === "string" ? row.author : row.author?._id;
        if (authorId && row._id) {
          acc[authorId] = row._id;
        }
        return acc;
      }, {});
    },
    enabled: !!token,
  });

  const followMutation = useMutation({
    mutationFn: async ({
      authorId,
      followerRecordId,
      isAlreadyFollowing,
    }: {
      authorId: string;
      followerRecordId?: string;
      isAlreadyFollowing: boolean;
    }) => {
      if (!token) throw new Error("Please login first to follow authors");
      const targetId =
        isAlreadyFollowing && followerRecordId ? followerRecordId : authorId;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/followers/${targetId}`, {
        method: isAlreadyFollowing ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.message ||
            (isAlreadyFollowing ? "Failed to unfollow author" : "Failed to follow author"),
        );
      }

      return { authorId, data, isAlreadyFollowing };
    },
    onSuccess: ({ authorId, data, isAlreadyFollowing }) => {
      setFollowingMap((prev) => ({ ...prev, [authorId]: !isAlreadyFollowing }));
      setFollowersDeltaMap((prev) => ({
        ...prev,
        [authorId]: (prev[authorId] || 0) + (isAlreadyFollowing ? -1 : 1),
      }));
      if (isAlreadyFollowing) {
        setFollowingRecordMap((prev) => {
          const next = { ...prev };
          delete next[authorId];
          return next;
        });
      } else {
        const createdFollowerId = data?.data?._id;
        if (createdFollowerId) {
          setFollowingRecordMap((prev) => ({ ...prev, [authorId]: createdFollowerId }));
        }
      }
      toast.success(
        data?.message || (isAlreadyFollowing ? "Unfollowed successfully" : "Followed successfully"),
      );
      queryClient.invalidateQueries({ queryKey: ["my-followings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Request failed");
    },
    onSettled: () => {
      setPendingAuthorId(null);
    },
  });

  const isAuthorFollowing = (author: SuggestedAuthor) => {
    if (author._id in followingMap) return !!followingMap[author._id];
    return !!followingByAuthorId[author._id];
  };

  const handleFollow = (author: SuggestedAuthor) => {
    if (!isLoggedIn) {
      toast.warning("Please login and continue.");
      return;
    }
    const authorId = author._id;
    const isAlreadyFollowing = isAuthorFollowing(author);
    const followerRecordId =
      followingRecordMap[authorId] || followingByAuthorId[authorId];
    setPendingAuthorId(authorId);
    followMutation.mutate({ authorId, followerRecordId, isAlreadyFollowing });
  };

  const visibleAuthors = showAll ? authors : authors.slice(0, INITIAL_VISIBLE);

  return (
    <div className="space-y-4">
      <h2 className="dark:text-white text-[#121212] text-xl sm:text-2xl lg:text-[28px] font-medium mb-6 sm:mb-8 lg:mb-5">
        Suggested Authors
      </h2>

      <div className="space-y-2 sm:space-y-3 bg-[#FFFFFF] border border-[#D7D7D7] dark:border-[#2C2C2C] dark:bg-[#FFFFFF0D] rounded-[8px]">
        
        {/* ✅ Skeleton */}
        {isLoading &&
          [1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 sm:p-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2 w-full">
                  <Skeleton className="w-40 h-4 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="w-28 h-3 bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
              <Skeleton className="w-20 h-8 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}

        {isError ? (
          <div className="p-4 text-sm text-red-500">
            Failed to load suggested authors.
          </div>
        ) : null}

        {!isLoading && !isError && authors.length === 0 ? (
          <div className="p-4 text-sm text-[#7D7D7D]">
            No suggested authors found.
          </div>
        ) : null}

        {!isLoading &&
          !isError &&
          visibleAuthors.map((author) => {
            const baseFollowers =
              typeof author.followersReadersCount === "number"
                ? author.followersReadersCount
                : author.followersReaders?.length || 0;
            const followersCount = Math.max(
              0,
              baseFollowers + (followersDeltaMap[author._id] || 0),
            );
            return (
              <SuggestedAuthorCard
                key={author._id}
                author={author}
                followersCount={followersCount}
                isFollowing={isAuthorFollowing(author)}
                isPending={
                  pendingAuthorId === author._id && followMutation.isPending
                }
                isLoggedIn={isLoggedIn}
                onFollow={handleFollow}
              />
            );
          })}
      </div>

      {!isLoading && !isError && authors.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="w-full rounded-lg border border-[#D7D7D7] dark:border-[#2C2C2C] bg-[#FFFFFF] dark:bg-[#FFFFFF0D] py-2 text-sm font-medium text-[#121212] dark:text-white transition-colors hover:bg-[#F8F8F8] dark:hover:bg-[#1B1B1B]"
        >
          {showAll ? "Show less" : "See more"}
        </button>
      )}
    </div>
  );
}
