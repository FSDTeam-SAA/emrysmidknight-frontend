"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

/* ================= TYPES ================= */
type NotificationType =
  | "publish"
  | "recommendation"
  | "chapter"
  | "premium"
  | "new"
  | "author_follow_update"
  | (string & {});

type NotificationItemType = {
  id: string;
  avatar: string;
  name: string | null;
  message: string;
  highlight: string | null;
  subtext: string | null;
  time: string;
  unread: boolean;
  type: NotificationType;
};

type NotificationApiSender = {
  _id?: string;
  fullName?: string;
  profilePicture?: string;
};

type NotificationApiItem = {
  _id: string;
  sender?: NotificationApiSender | null;
  message?: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
};

type NotificationApiResponse = {
  data?: NotificationApiItem[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    unreadCount?: number;
  };
  message?: string;
  success?: boolean;
  statusCode?: number;
};

const DEFAULT_AVATAR = "https://randomuser.me/api/portraits/men/32.jpg";

const formatTimeAgo = (value?: string) => {
  if (!value) return "Just now";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return formatDistanceToNow(parsed, { addSuffix: true });
};

const normalizeMessage = (name: string | null, message?: string) => {
  if (!message) return "";
  if (!name) return message;
  const trimmed = message.trim();
  if (trimmed.startsWith(name)) {
    const rest = trimmed.slice(name.length).trimStart();
    return rest.startsWith(",") || rest.startsWith("-")
      ? rest.slice(1).trimStart()
      : rest;
  }
  return message;
};

const mapNotification = (item: NotificationApiItem): NotificationItemType => {
  const name = item.sender?.fullName ?? null;
  return {
    id: item._id,
    avatar: item.sender?.profilePicture || DEFAULT_AVATAR,
    name,
    message: normalizeMessage(name, item.message),
    highlight: null,
    subtext: null,
    time: formatTimeAgo(item.createdAt),
    unread: !item.isRead,
    type: (item.type ?? "new") as NotificationType,
  };
};

function NotificationsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 md:p-5 rounded-md bg-[#FFFFFF] dark:bg-[#FFFFFF0D]"
        >
          <Skeleton className="w-[52px] h-[52px] rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
          </div>
          <Skeleton className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700 mt-2" />
        </div>
      ))}
    </div>
  );
}

/* ================= PAGE ================= */
export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const isSessionLoading = status === "loading";
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<NotificationApiResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notification`,
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
      return result as NotificationApiResponse;
    },
    enabled: !!token,
  });

  const [items, setItems] = useState<NotificationItemType[]>([]);

  useEffect(() => {
    const apiItems = Array.isArray(data?.data) ? data?.data : [];
    setItems(apiItems.map(mapNotification));
  }, [data]);

  const markAllRead = (): void => {
    setItems((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  const markReadLocal = (id: string): void => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markReadMutation = useMutation<
    NotificationApiResponse,
    Error,
    string,
    { previous?: NotificationItemType[] }
  >({
    mutationFn: async (id) => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notification/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to mark notification read");
      }
      return result as NotificationApiResponse;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = items;
      markReadLocal(id);
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        setItems(context.previous);
      }
      const message =
        error instanceof Error ? error.message : "Failed to update notification";
      toast.error(message);
    },
    onSuccess: (result) => {
      const apiItems = Array.isArray(result?.data) ? result.data : [];
      if (apiItems.length) {
        setItems(apiItems.map(mapNotification));
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation<
    NotificationApiResponse,
    Error,
    string,
    { previous?: NotificationItemType[] }
  >({
    mutationFn: async (id) => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notification/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to delete notification");
      }
      return result as NotificationApiResponse;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = items;
      setItems((prev) => prev.filter((item) => item.id !== id));
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        setItems(context.previous);
      }
      const message =
        error instanceof Error ? error.message : "Failed to delete notification";
      toast.error(message);
    },
    onSuccess: (result) => {
      toast.success("Notification deleted");
      const apiItems = Array.isArray(result?.data) ? result.data : [];
      if (apiItems.length) {
        setItems(apiItems.map(mapNotification));
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation<
    NotificationApiResponse,
    Error,
    void,
    { previous?: NotificationItemType[] }
  >({
    mutationFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/notification/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to mark notifications read");
      }
      return result as NotificationApiResponse;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = items;
      markAllRead();
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        setItems(context.previous);
      }
      const message =
        error instanceof Error ? error.message : "Failed to update notifications";
      toast.error(message);
    },
    onSuccess: (result) => {
      const apiItems = Array.isArray(result?.data) ? result.data : [];
      if (apiItems.length) {
        setItems(apiItems.map(mapNotification));
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const isBusy = isLoading || isSessionLoading;
  const isMarkingAll = markAllReadMutation.isPending;
  const canMarkAllRead =
    !isBusy && !isMarkingAll && !!token && items.some((item) => item.unread);

  return (
    <div className="py-10 px-1 md:px-6">
      <div className="w-full  mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="dark:text-white text-xl md:text-3xl font-semibold">
            Notifications
          </h1>

          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={!canMarkAllRead}
            className="text-white text-xs md:text-sm hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
        </div>

        {/* List */}
        {isBusy ? (
          <NotificationsSkeleton />
        ) : !token ? (
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300">
            Please sign in to view notifications.
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300">
            No notifications yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((n, i) => (
              <NotificationItem
                key={n.id}
                item={n}
                index={i}
                onClick={() => markReadMutation.mutate(n.id)}
                onDelete={() => deleteMutation.mutate(n.id)}
              />
            ))}
          </div>
        )}

        {error && !isBusy && (
          <p className="mt-4 text-sm text-[#5E5E5E] dark:text-gray-300">
            Failed to load notifications. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= ITEM ================= */
type NotificationItemProps = {
  item: NotificationItemType;
  index: number;
  onClick: () => void;
  onDelete: () => void;
};

function NotificationItem({
  item,
  index,
  onClick,
  onDelete,
}: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex gap-4 p-4 md:p-5 rounded-md cursor-pointer transition-all duration-200 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] hover:bg-[#FFFFFF14] animate-fadeSlideIn"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Image
          src={item.avatar}
          alt={item.name ? `${item.name} avatar` : "avatar"}
          width={1000}
          height={1000}
          className={`w-[52px] h-[52px] md:w-12 md:h-12 rounded-full object-cover border border-[#2e2820] ${
            !item.unread ? "grayscale-[40%]" : ""
          }`}
        />

        {item.type === "premium" && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#d4a017] rounded-full border-2 border-black flex items-center justify-center text-[8px]">
            ★
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-[#1C1C1C] dark:text-[#F2F2F2] text-sm md:text-base leading-6">
          {item.name && (
            <span className="font-semibold mr-1">
              {item.name}
            </span>
          )}

          {item.message}{" "}

          {item.highlight && (
            <span className="font-semibold italic">
              {item.highlight}
            </span>
          )}

          {item.subtext && (
            <span className="ml-1 text-[#1C1C1C] dark:text-[#FFFFFF]">
              {item.subtext}
            </span>
          )}
        </p>

        <span className="text-[#7D7D7D] text-xs font-mono">
          {item.time}
        </span>
      </div>

      <div className="flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          aria-label="Delete notification"
          className="text-[#7D7D7D] hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Unread dot */}
        {item.unread && (
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1 shadow-[0_0_6px_rgba(255,0,0,0.6)]" />
        )}
      </div>
    </div>
  );
}
