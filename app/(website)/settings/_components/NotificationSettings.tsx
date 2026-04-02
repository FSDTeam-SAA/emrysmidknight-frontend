"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Toggle } from "./Controls";

type NotificationRow<K extends string> = {
  key: K;
  label: string;
};

type NotificationSettingsData = {
  newChapterUpdates: boolean;
  authorPosts: boolean;
  premiumContentAlerts: boolean;
  recommendedStories: boolean;
  authorYouFollowUpdates: boolean;
  paymentSuccessConfirmation: boolean;
  paymentFailedAlert: boolean;
  emailNotifications: boolean;
};

type NotificationSettingsProps = {
  notificationRows: ReadonlyArray<NotificationRow<keyof NotificationSettingsData>>;
};

const buildSettings = (value: unknown): NotificationSettingsData => {
  const fallback: NotificationSettingsData = {
    newChapterUpdates: false,
    authorPosts: false,
    premiumContentAlerts: false,
    recommendedStories: false,
    authorYouFollowUpdates: false,
    paymentSuccessConfirmation: false,
    paymentFailedAlert: false,
    emailNotifications: false,
  };
  if (!value || typeof value !== "object") return fallback;
  const record = value as Partial<NotificationSettingsData>;
  return {
    newChapterUpdates: Boolean(record.newChapterUpdates),
    authorPosts: Boolean(record.authorPosts),
    premiumContentAlerts: Boolean(record.premiumContentAlerts),
    recommendedStories: Boolean(record.recommendedStories),
    authorYouFollowUpdates: Boolean(record.authorYouFollowUpdates),
    paymentSuccessConfirmation: Boolean(record.paymentSuccessConfirmation),
    paymentFailedAlert: Boolean(record.paymentFailedAlert),
    emailNotifications: Boolean(record.emailNotifications),
  };
};

export default function NotificationSettings({
  notificationRows,
}: NotificationSettingsProps) {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const isSessionLoading = status === "loading";
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notification/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch notifications");
      }
      return buildSettings(result?.data ?? result);
    },
    enabled: !!token,
  });

  const updateMutation = useMutation<
    NotificationSettingsData,
    Error,
    NotificationSettingsData,
    { previous?: NotificationSettingsData }
  >({
    mutationFn: async (nextSettings) => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notification/settings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nextSettings),
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to update notifications");
      }
      return buildSettings(result?.data ?? result);
    },
    onMutate: async (nextSettings) => {
      await queryClient.cancelQueries({ queryKey: ["notification-settings"] });
      const previous = queryClient.getQueryData<NotificationSettingsData>([
        "notification-settings",
      ]);
      queryClient.setQueryData(["notification-settings"], nextSettings);
      return { previous };
    },
    onError: (error, _next, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notification-settings"], context.previous);
      }
      const message =
        error instanceof Error ? error.message : "Failed to update notifications";
      toast.error(message);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["notification-settings"], updated);
      toast.success("Notification settings updated");
    },
  });

  const settings = data ?? buildSettings(null);
  const isBusy = isSessionLoading || isLoading || updateMutation.isPending;

  const handleToggle = (key: keyof NotificationSettingsData) => {
    if (isBusy) return;
    const nextSettings = {
      ...settings,
      [key]: !settings[key],
    };
    updateMutation.mutate(nextSettings);
  };

  return (
    <div className="  overflow-hidden space-y-4">
      {notificationRows.map((item) => (
        <div
          key={item.key}
          className={`flex justify-between items-center px-6 py-[20px] bg-white dark:bg-white/5 rounded-[8px]  `}
        >
          <span className="text-base md:text-xl text-[#2C2C2C] dark:text-white">
            {item.label}
          </span>

          <Toggle
            checked={Boolean(settings[item.key])}
            onChange={() => handleToggle(item.key)}
          />
        </div>
      ))}

      {error && (
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300">
          Failed to load notification settings. Please try again.
        </p>
      )}
    </div>
  );
}
