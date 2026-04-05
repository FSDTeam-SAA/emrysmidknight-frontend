"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
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
        Top Author
      </h2>

      <div className="space-y-4">
        {/* ✅ Skeleton */}
        {isLoading &&
          [1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border border-[#D7D7D7] dark:border-[#2C2C2C] rounded-[8px] p-2"
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
          authors.map((author) => {
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
                className="block"
                onClick={(event) => {
                  if (!isLoggedIn) {
                    event.preventDefault();
                    event.stopPropagation();
                    toast.warning("Please login and continue.");
                  }
                }}
              >
                <div className="flex items-center gap-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border border-[#D7D7D7] dark:border-[#2C2C2C] rounded-[8px]">
                  <div className="flex-shrink-0 w-20 h-20 sm:w-[102px] sm:h-[102px] relative overflow-hidden">
                    <Image
                      src={profileSrc}
                      alt={displayName}
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full rounded-l-[8px]"
                    />
                  </div>

                  <div className="flex-1 pt-1">
                    <h3 className="text-[#121212] dark:text-white text-base sm:text-lg font-medium">
                      {displayName}
                    </h3>
                    <p className="text-[#121212] dark:text-[#D7D7D7] text-xs sm:text-sm mt-1">
                      @{author.userName}
                    </p>
                    <p className="text-[#121212] dark:text-[#FFFFFF] font-medium text-sm sm:text-base">
                      Followers:{" "}
                      {followers >= 1000
                        ? `${Math.floor(followers / 1000)}K`
                        : followers}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
