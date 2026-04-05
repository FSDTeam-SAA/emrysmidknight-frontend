"use client";
import { SubscriptionModal } from "@/components/Dialog/SubscriptionModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AuthorProfile = {
  _id?: string;
  fullName?: string;
  userName?: string;
  email?: string;
  role?: string;
  pronounce?: string;
  gender?: string;
  phoneNumber?: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  dateOfBirth?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthorProfileViewer = {
  isOwner?: boolean;
  role?: string;
  isFollowing?: boolean;
  followStatus?: string;
  followAction?: string;
  hasActiveSubscription?: boolean;
  subscriptionStatus?: string;
  subscriptionAction?: string;
};

type AuthorProfileStats = {
  totalBlogs?: number;
  freeBlogs?: number;
  paidBlogs?: number;
  lockedBlogs?: number;
  totalFollowers?: number;
  totalPlans?: number;
};

type AuthorProfileData = {
  author?: AuthorProfile;
  stats?: AuthorProfileStats;
  viewer?: AuthorProfileViewer;
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

const UnfollowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MoreIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export default function ProfileHeader() {
  const params = useParams();
  const authorId = useMemo(() => {
    const raw = params?.id;
    if (Array.isArray(raw)) return raw[0];
    return raw as string | undefined;
  }, [params]);

  const { data: session, status } = useSession();
  const token = session?.user?.accessToken || "";

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery<AuthorProfileData>({
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
      return (result?.data ?? {}) as AuthorProfileData;
    },
    enabled: !!authorId && !!token,
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
        const rowAuthorId =
          typeof row.author === "string" ? row.author : row.author?._id;
        if (rowAuthorId && row._id) {
          acc[rowAuthorId] = row._id;
        }
        return acc;
      }, {});
    },
    enabled: !!token,
  });

  const [following, setFollowing] = useState(false);
  const [followRecordId, setFollowRecordId] = useState<string | undefined>();
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const viewer = profile?.viewer;
    if (!viewer && !authorId) return;

    const viewerFollowing =
      typeof viewer?.isFollowing === "boolean"
        ? viewer.isFollowing
        : viewer?.followStatus === "follow";
    const mappedFollowId = authorId ? followingByAuthorId[authorId] : undefined;
    const nextFollowing = Boolean(mappedFollowId || viewerFollowing);
    const nextSubscribed =
      typeof viewer?.hasActiveSubscription === "boolean"
        ? viewer.hasActiveSubscription
        : viewer?.subscriptionStatus === "subscribed";

    setFollowing(nextFollowing);
    setSubscribed(nextSubscribed);
    if (mappedFollowId) {
      setFollowRecordId(mappedFollowId);
      return;
    }
    if (
      viewer?.followAction &&
      !["follow", "unfollow"].includes(viewer.followAction)
    ) {
      setFollowRecordId(viewer.followAction);
    } else {
      setFollowRecordId(undefined);
    }
  }, [profile?.viewer, followingByAuthorId, authorId]);

  const author = profile?.author;
  const displayName =
    author?.fullName && author.fullName.trim().length > 0
      ? author.fullName
      : author?.userName || "Unknown Author";
  const handle = author?.userName ? `@${author.userName}` : "@unknown";
  const coverSrc =
    author?.coverPicture && author.coverPicture.trim().length > 0
      ? author.coverPicture
      : "/authorbg.png";
  const avatarSrc =
    author?.profilePicture && author.profilePicture.trim().length > 0
      ? author.profilePicture
      : "/profile1.png";

  const handleSubscribeClick = () => {
    setSubscriptionModalOpen(true);
  };

  const followMutation = useMutation({
    mutationFn: async ({
      isAlreadyFollowing,
      followerId,
    }: {
      isAlreadyFollowing: boolean;
      followerId?: string;
    }) => {
      if (!token) throw new Error("Missing auth token");
      if (!authorId) throw new Error("Missing author id");

      const targetId = isAlreadyFollowing ? followerId || authorId : authorId;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/followers/${targetId}`,
        {
          method: isAlreadyFollowing ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          result?.message ||
            (isAlreadyFollowing
              ? "Failed to unfollow author"
              : "Failed to follow author"),
        );
      }

      return { result, isAlreadyFollowing };
    },
    onSuccess: ({ result, isAlreadyFollowing }) => {
      setFollowing(!isAlreadyFollowing);
      if (isAlreadyFollowing) {
        setFollowRecordId(undefined);
      } else {
        const newFollowerId = result?.data?._id;
        if (newFollowerId) {
          setFollowRecordId(newFollowerId);
        }
      }
      toast.success(
        result?.message ||
          (isAlreadyFollowing
            ? "Unfollowed successfully"
            : "Followed successfully"),
      );
      queryClient.invalidateQueries({
        queryKey: ["author-profile", authorId, token],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-followings", token],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Request failed");
    },
  });

  const handleFollowToggle = () => {
    if (!token) {
      toast.warning("Please login and continue.");
      return;
    }
    followMutation.mutate({
      isAlreadyFollowing: following,
      followerId: followRecordId || (authorId ? followingByAuthorId[authorId] : undefined),
    });
  };

  if (isLoading || status === "loading") {
    return (
      <div className="py-6">
        <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] rounded-2xl overflow-visible">
          <div className="relative w-full h-[280px] rounded-t-2xl overflow-hidden">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3 px-6 pb-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] rounded-full -mt-[100px]" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap pt-2">
              <Skeleton className="h-[48px] w-[120px] rounded-[8px]" />
              <Skeleton className="h-[48px] w-[120px] rounded-[8px]" />
              <Skeleton className="h-[48px] w-[48px] rounded-[10px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-6">
        {isError ? (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {(error as Error)?.message || "Failed to load author profile."}
          </div>
        ) : null}

        <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] rounded-2xl overflow-visible">

          {/* Banner */}
          <div className="relative w-full h-[280px] rounded-t-2xl overflow-hidden">
            <Image src={coverSrc} alt="Profile Banner" fill className="object-cover" />
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-6 pb-5">

            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] rounded-full -mt-[100px] overflow-hidden shrink-0 z-10 shadow-xl">
                <Image src={avatarSrc} alt="Author Avatar" width={1000} height={1000} className="object-cover w-full h-full" />
              </div>
              <div className="pt-2">
                <h1 className="dark:text-[#FFFFFF] font-semibold text-xl md:text-[32px] tracking-tight leading-tight m-0">
                  {displayName}
                </h1>
                <p className="text-[#7D7D7D] dark:text-[#D7D7D7] text-[16px] mt-0.5 m-0">{handle}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap pt-2">

              {/* Unfollow / Follow */}
              <button
                onClick={handleFollowToggle}
                disabled={followMutation.isPending}
                className="flex items-center gap-1.5 px-4 h-[48px] rounded-[8px] border border-[#F66F7D] bg-transparent text-[#F66F7D] font-medium text-[16px] cursor-pointer hover:border-[#f47280] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <UnfollowIcon />
                {followMutation.isPending
                  ? "Processing..."
                  : following
                    ? "Unfollow"
                    : "Follow"}
              </button>

              {/* Subscribe → opens modal */}
              <button
                onClick={handleSubscribeClick}
                className={`flex items-center gap-1.5 px-4 h-[48px] rounded-[8px] border-0 font-medium text-[16px] cursor-pointer transition-all duration-150 ${
                  subscribed
                    ? "bg-[#f0f0f0] text-[#F66F7D]"
                    : "bg-[#F66F7D] text-white shadow-[0_4px_14px_rgba(244,114,128,0.35)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(244,114,128,0.45)]"
                }`}
              >
                <BellIcon />
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>

              {/* More */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center justify-center w-[48px] h-[48px] rounded-[10px] border border-white/10 bg-[#F2F2F2] text-[#121212] cursor-pointer transition-all duration-150"
                >
                  <MoreIcon />
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] bg-[#1e2029] border border-white/10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] min-w-[160px] z-50 p-1.5"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    {["Share Profile", "Report", "Block User"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setMenuOpen(false)}
                        className={`block w-full text-left px-3.5 py-2 border-0 bg-transparent text-[13px] font-medium cursor-pointer rounded-lg hover:bg-white/[0.07] transition-colors duration-150 ${
                          item === "Block User" ? "text-[#f47280]" : "text-[#d1d5db]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Modal */}
      <SubscriptionModal
        open={subscriptionModalOpen}
        authorId={authorId}
        onClose={() => {
          setSubscriptionModalOpen(false);
        }}
      />
    </>
  );
}
