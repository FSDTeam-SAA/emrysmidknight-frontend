"use client";

import {
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Lock,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

interface StoryPostProps {
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  image?: string;
  video?: string;
  locked?: boolean;
  bookmarked?: boolean;
  bookmarkColor?: string;
}

const MAX_CHARS = 220;

export function StoryPost({
  author,
  handle,
  avatar,
  timestamp,
  title,
  content,
  likes,
  comments,
  image,
  video,
  locked = false,
  bookmarked = false,
  bookmarkColor = "#F66F7D",
}: StoryPostProps) {
  const [expanded, setExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(locked);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

  const isLong = content.length > MAX_CHARS;
  const displayedContent =
    expanded || !isLong ? content : content.slice(0, MAX_CHARS) + "...";
  const likeDisplay = `${likes}K`;

  return (
    <div className="w-full max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl text-white relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      {/* ── Blurred content layer ── */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={avatar} alt={author} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-semibold text-base text-white leading-5">{author}</h3>
              <p className="text-[#9a9a9a] text-xs">@{handle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#D7D7D7] text-sm">{timestamp}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#8c8c8c] hover:text-white hover:bg-white/10"
            >
              <MoreHorizontal className="h-6 w-6 dark:text-[#D7D7D7] text-black font-bold" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <h2 className="px-5 pt-4 text-lg font-semibold text-white leading-6">
          {title}
        </h2>

        <div
          className={`transition-all duration-300 ${isLocked ? "blur-sm pointer-events-none select-none" : ""}`}
        >
          {/* Content */}
          <p className="px-5 pt-3 text-sm leading-6 text-[#c9c9c9] whitespace-pre-wrap">
            {displayedContent}
            {isLong && !isLocked && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 text-[#f26d7d] font-medium hover:underline text-sm"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>

          {/* Image */}
          {image && !video && (
            <div className="mt-4 px-5">
              <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
                <Image
                  width={500}
                  height={380}
                  src={image}
                  alt="Post image"
                  className="h-[240px] w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Video */}
          {video && (
            <div className="mt-4 px-5">
              <video
                src={video}
                controls
                className="h-[240px] w-full rounded-xl object-cover bg-black border border-[#2a2a2a]"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-[#2a2a2a] px-5 py-4 text-[#8c8c8c]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm font-semibold text-white">{likeDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-semibold text-white">{comments}</span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="h-8 w-8 flex items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Bookmark
              className="!h-5 !w-5 transition-all duration-200"
              style={
                isBookmarked
                  ? { fill: bookmarkColor, stroke: bookmarkColor }
                  : { fill: "none", stroke: "#71717a" }
              }
            />
          </button>
        </div>
      </div>

      {/* ── Unlock overlay (on top, not blurred) ── */}
      {isLocked && (
        <div className="absolute bottom-24 left-6 z-10">
          <button
            onClick={() => setIsLocked(false)}
            className="flex items-center gap-2 rounded-lg bg-[#f26d7d] px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:bg-[#e85d6b] active:scale-95"
          >
            <Lock size={15} />
            Unlock
          </button>
        </div>
      )}
    </div>
  );
}
