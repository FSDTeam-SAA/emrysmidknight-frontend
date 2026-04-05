"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ added
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type TopAuthor = {
  _id: string;
  fullName?: string;
  userName: string;
  bio?: string;
  profilePicture?: string;
  followersReaders?: string[];
  followersReadersCount?: number;
};

type TopAuthorsResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: TopAuthor[];
};

export function TopAuthorSection() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user?.accessToken);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_VISIBLE = 4;

  const { data: authors = [], isLoading, isError } = useQuery({
    queryKey: ["top-authors"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/top-authors`,
      );
      if (!res.ok) throw new Error("Failed to fetch top authors");
      const result: TopAuthorsResponse = await res.json();
      return result?.data ?? [];
    },
  });

  return (
    <div className="w-full rounded-lg">
      <h2 className="text-[#121212] dark:text-white text-xl sm:text-2xl lg:text-[28px] font-medium sm:mb-5">
        Top Authors
      </h2>

      <div className="space-y-4">
        {/* ✅ Skeleton */}
        {isLoading &&
          [1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border border-[#D7D7D7] dark:border-[#2C2C2C] rounded-xl p-2"
            >
              <Skeleton className="w-20 h-20 sm:w-[102px] sm:h-[102px] rounded-[8px] bg-gray-200 dark:bg-gray-700" />

              <div className="flex-1 space-y-2">
                <Skeleton className="w-40 h-4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="w-28 h-3 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="w-24 h-4 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}

        {/* Error */}
        {isError ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            Failed to load top authors. Please try again.
          </div>
        ) : null}

        {/* Empty */}
        {!isLoading && !isError && authors.length === 0 ? (
          <div className="rounded-[8px] border border-[#D7D7D7] dark:border-[#2C2C2C] bg-[#FFFFFF] dark:bg-[#FFFFFF0D] p-4 text-sm text-[#6B7280] dark:text-[#D7D7D7]">
            No top authors found.
          </div>
        ) : null}

        {/* Data */}
        {!isLoading &&
          !isError &&
          (showAll ? authors : authors.slice(0, INITIAL_VISIBLE)).map(
            (author) => {
            const displayName =
              author.fullName && author.fullName.trim().length > 0
                ? author.fullName
                : author.userName;

            const followers =
              typeof author.followersReadersCount === "number"
                ? author.followersReadersCount
                : author.followersReaders?.length || 0;

            const profileSrc =
              author.profilePicture && author.profilePicture.trim().length > 0
                ? author.profilePicture
                : "/Author.png";

            return (
              <Link
                key={author._id}
                href={`/author-profile/${author._id}`}
                className="block group"
                onClick={(event) => {
                  if (!isLoggedIn) {
                    event.preventDefault();
                    event.stopPropagation();
                    toast.warning("Please login and continue.");
                  }
                }}
              >
                <div className="flex items-center gap-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border border-[#D7D7D7] dark:border-[#2C2C2C] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/30">
                  <div className="flex-shrink-0 w-20 h-20 sm:w-[102px] sm:h-[102px] relative overflow-hidden">
                    <Image
                      src={profileSrc}
                      alt={displayName}
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full rounded-l-xl"
                    />
                  </div>

                  <div className="flex-1 py-2 pr-3">
                    <h3 className="text-[#121212] dark:text-white text-base sm:text-lg font-medium group-hover:text-[#0F172A] dark:group-hover:text-white">
                      {displayName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-[#121212] dark:text-[#D7D7D7]">
                      <span>@{author.userName}</span>
                      <span className="h-1 w-1 rounded-full bg-[#D7D7D7] dark:bg-[#2C2C2C]" />
                      <span className="font-medium text-[#121212] dark:text-[#FFFFFF]">
                        {followers >= 1000
                          ? `${Math.floor(followers / 1000)}K`
                          : followers}{" "}
                        followers
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

        {/* See more / less */}
        {!isLoading &&
          !isError &&
          authors.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full rounded-lg border border-[#D7D7D7] dark:border-[#2C2C2C] bg-[#FFFFFF] dark:bg-[#FFFFFF0D] py-2 text-sm font-medium text-[#121212] dark:text-white transition-colors hover:bg-[#F8F8F8] dark:hover:bg-[#1B1B1B]"
            >
              {showAll ? "Show less" : "See more"}
            </button>
          )}
      </div>
    </div>
  );
}
