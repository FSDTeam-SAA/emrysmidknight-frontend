"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type AccountRow = {
  label: string;
  value?: string;
};

type UserProfile = {
  _id?: string;
  fullName?: string;
  userName?: string;
  email?: string;
  role?: string;
  pronounce?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AccountSettingsProps = {
  publicProfile: boolean;
  onTogglePublicProfile: () => void;
  matureContent: boolean;
  onToggleMatureContent: () => void;
};

const formatValue = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not set";
};

const formatUsername = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return "Not set";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
};

const formatTitle = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return "Not set";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const formatDate = (value?: string) => {
  if (!value) return "Not set";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const buildAccountRows = (profile: UserProfile): AccountRow[] => [
  { label: "Full Name", value: formatValue(profile.fullName) },
  { label: "Username", value: formatUsername(profile.userName) },
  { label: "Email Address", value: formatValue(profile.email) },
  { label: "Role", value: formatTitle(profile.role) },
  { label: "Pronouns", value: formatTitle(profile.pronounce) },
  { label: "Bio", value: formatValue(profile.bio) },
  { label: "Member Since", value: formatDate(profile.createdAt) },
];

function AccountInfoSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-2 px-4 py-4 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between animate-pulse"
        >
          <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-52 rounded bg-gray-200 dark:bg-gray-700 md:ml-auto" />
        </div>
      ))}
    </>
  );
}

export default function AccountSettings({
 
}: AccountSettingsProps) {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const isSessionLoading = status === "loading";

  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
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
    enabled: !!token,
  });

  const rows = profile ? buildAccountRows(profile) : [];
  const isBusy = isSessionLoading || isLoading;

  return (
    <div className="flex flex-col gap-4">
      {/* Account Info */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-white/5">
        {isBusy ? (
          <AccountInfoSkeleton />
        ) : rows.length > 0 ? (
          rows.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 px-4 py-4 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between"
            >
              <span className="text-base sm:text-lg lg:text-xl text-[#2C2C2C] dark:text-white">
                {item.label}
              </span>

              {item.value && (
                <span className="break-words text-left text-base sm:text-lg lg:text-xl text-[#2C2C2C] dark:text-white md:text-right">
                  {item.value}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="px-4 py-4 text-sm text-[#5E5E5E] dark:text-gray-300 sm:px-6 sm:py-[18px]">
            No profile details available.
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300">
          Failed to load account details. Please try again.
        </p>
      )}

      {/* Public Profile */}
      {/* <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-4 dark:bg-white/5 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="mb-1 text-lg font-medium text-[#2C2C2C] dark:text-white lg:text-xl">
            Public Profile
          </p>
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
            Anyone on the platform can view your profile information and activity.
          </p>
        </div>
        <div className="shrink-0">
          <Toggle checked={publicProfile} onChange={onTogglePublicProfile} />
        </div>
      </div> */}

      {/* Mature Content */}
      {/* <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-4 dark:bg-white/5 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="mb-1 text-lg font-medium text-[#2C2C2C] dark:text-white lg:text-xl">
            Mature Content
          </p>
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
            You must be 18+ to view mature stories or media.
          </p>
        </div>
        <div className="shrink-0">
          <Toggle checked={matureContent} onChange={onToggleMatureContent} />
        </div>
      </div> */}

      {/* Deactivate Account */}
      <div className="cursor-pointer rounded-xl bg-white px-4 py-4 transition-colors hover:border-gray-400 dark:bg-white/5 dark:hover:border-white/30 sm:px-6 sm:py-[18px]">
        <p className="mb-1 text-lg font-medium text-[#EE0000] lg:text-xl">
          Deactivate account
        </p>
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
          Deactivating will suspend your account until you sign back in.
        </p>
      </div>

      {/* Delete Account */}
      <div className="cursor-pointer rounded-xl bg-white px-4 py-4 transition-colors hover:border-[#EE0000] dark:bg-white/5 sm:px-6 sm:py-[18px]">
        <p className="mb-1 text-lg font-medium text-[#EE0000] lg:text-xl">
          Delete account
        </p>
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
          Permanently delete your account and all of your content.
        </p>
      </div>
    </div>
  );
}
