
"use client";

import Image from "next/image";
import { useState } from "react";

/* ================= TYPES ================= */
type NotificationType =
  | "publish"
  | "recommendation"
  | "chapter"
  | "premium"
  | "new";

type NotificationItemType = {
  id: number;
  avatar: string;
  name: string | null;
  message: string;
  highlight: string | null;
  subtext: string | null;
  time: string;
  unread: boolean;
  type: NotificationType;
};

/* ================= DATA ================= */
const notifications: NotificationItemType[] = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/48?img=1",
    name: "Leslie Alexander",
    message: "has published a brand new story",
    highlight: '"The Shadow Kingdom"',
    subtext: "Discover the adventure now.",
    time: "1 hours ago",
    unread: true,
    type: "publish",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/48?img=2",
    name: null,
    message:
      "New story recommendations are ready for you. Discover trending fantasy and mystery stories today.",
    highlight: null,
    subtext: null,
    time: "18 hours ago",
    unread: false,
    type: "recommendation",
  },
  {
    id: 3,
    avatar: "https://i.pravatar.cc/48?img=3",
    name: "Arlene McCoy",
    message: "has published a new chapter",
    highlight: '"Moonlight Diary – Chapter 6"',
    subtext: null,
    time: "24 hours ago",
    unread: true,
    type: "chapter",
  },
  {
    id: 4,
    avatar: "https://i.pravatar.cc/48?img=4",
    name: null,
    message: "A new premium chapter is available now",
    highlight: '"Forest of Whispers – Chapter 5"',
    subtext: "Subscribe to unlock and continue reading.",
    time: "18 hours ago",
    unread: true,
    type: "premium",
  },
  {
    id: 5,
    avatar: "https://i.pravatar.cc/48?img=5",
    name: "Guy Hawkins",
    message: "just posted a new fantasy story",
    highlight: `"Dragon's Awakening – Chapter 3"`,
    subtext: "Don't miss the latest update.",
    time: "0 hours ago",
    unread: false,
    type: "new",
  },
];

/* ================= PAGE ================= */
export default function NotificationsPage() {
  const [items, setItems] =
    useState<NotificationItemType[]>(notifications);

  const markAllRead = (): void => {
    setItems((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  const markRead = (id: number): void => {
    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };



  return (
    <div className="py-10 px-1 md:px-6">
      <div className="w-full  mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="dark:text-white text-xl md:text-3xl font-semibold">
            Notifications 
          </h1>

          <button
            onClick={markAllRead}
            className="text-white text-xs md:text-sm hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {items.map((n, i) => (
            <NotificationItem
              key={n.id}
              item={n}
              index={i}
              onClick={() => markRead(n.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= ITEM ================= */
type NotificationItemProps = {
  item: NotificationItemType;
  index: number;
  onClick: () => void;
};

function NotificationItem({
  item,
  index,
  onClick,
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
          alt="avatar"
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

      {/* Unread dot */}
      {item.unread && (
        <div className="w-2 h-2 rounded-full bg-red-500 mt-1 shadow-[0_0_6px_rgba(255,0,0,0.6)]" />
      )}
    </div>
  );
}