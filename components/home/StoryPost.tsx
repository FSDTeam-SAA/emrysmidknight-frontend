"use client";

import {
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { UnlockDialog } from "../Dialog/UnlockDialog";
import { CommentModal } from "../Dialog/CommentModal";
import { formatRelativeTime } from "@/lib/date";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ReplyData {
  id: string;
  author: string;
  avatar: string;
  handle: string;
  time: string;
  text: string;
  likes: number;
}

export interface CommentData {
  id: string;
  author: string;
  avatar: string;
  handle: string;
  time: string;
  text: string;
  likes: number;
  replies?: ReplyData[];
}

interface StoryPostProps {
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  commentsData?: CommentData[];
  image?: string;
  video?: string;
  locked?: boolean;
  bookmarked?: boolean;
  liked?: boolean;
  id?: string;
  price?: number;
  audienceType?: "free" | "paid";
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
  commentsData = [],
  image,
  video,
  locked,
  bookmarked = false,
  liked = false,
  id,
  price,
}: StoryPostProps) {
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";
  const isLoggedIn = session.status === "authenticated" && Boolean(TOKEN);

  const isLong = content.length > MAX_CHARS;
  const timestampLabel = formatRelativeTime(timestamp);
  // const displayedContent =
  //   expanded || !isLong ? content : content.slice(0, MAX_CHARS) + "...";

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blog/${postId}/like-unlike`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to like post");
      return res.json();
    },
    onError: (err) => {
      toast.error(
        err.message || "Failed to update like status. Please try again.",
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Like status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["blogData"] });
    },
  });

  const handleLike = () => {
    if (!isLoggedIn) {
      toast.warning("Please login first to like this post.");
      return;
    }
    if (!id || likeMutation.isPending) return;
    const currentlyLiked = isLiked;
    setIsLiked(!currentlyLiked);
    setLikeCount((prev) => (currentlyLiked ? prev - 1 : prev + 1));
    likeMutation.mutate(id);
  };

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookmark`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blog: postId }), // ✅ body add
        },
      );
      if (!res.ok) throw new Error("Failed to bookmark post");
      return res.json();
    },
    onError: (err) => {
      toast.error(
        err.message || "Failed to update bookmark status. Please try again.",
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Bookmark status updated successfully!");
      setIsBookmarked(true);
      queryClient.invalidateQueries({ queryKey: ["blogData"] });
    },
  });

  const handleBookmark = () => {
    if (!id || bookmarkMutation.isPending || isBookmarked) return;
    bookmarkMutation.mutate(id);
  };

  return (
    <>
      <div className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatar} alt={author} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-[#121212] dark:text-white leading-5">
                {author}
              </h3>
              <p className="text-xs text-[#9a9a9a]">@{handle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#121212] dark:text-[#D7D7D7]">
              {timestampLabel}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#121212] dark:text-[#8c8c8c]"
            >
              <MoreHorizontal className="w-6 h-6 dark:text-[#D7D7D7]" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <h2 className="px-5 pt-4 text-lg font-semibold leading-6 text-[#121212] dark:text-white">
          {title}
        </h2>

        {/* Content */}
        <div
          className={`transition-all duration-300 ${
            locked ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
          <p className="px-5 pt-3 text-sm leading-6 text-[#121212] dark:text-[#c9c9c9] whitespace-pre-wrap">
            <span
              dangerouslySetInnerHTML={{
                __html:
                  expanded || !isLong
                    ? content
                    : content.slice(0, MAX_CHARS) + "...",
              }}
            />

            {isLong && !locked && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 text-[#f26d7d] text-sm font-medium hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>

          {/* Image */}
          {image && !video && (
            <div className="mt-4 px-5">
              <Image
                src={image}
                alt="Post image"
                width={500}
                height={380}
                className="w-full h-[360px] object-cover rounded-lg"
              />
            </div>
          )}

          {/* Video */}
          {video && (
            <div className="mt-4 px-5">
              <video
                src={video}
                controls
                className="w-full h-[360px] rounded-xl object-cover"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-[#D7D7D7] px-5 py-4 text-[#8c8c8c]">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              <ThumbsUp
                className={`w-5.5 h-5 transition-all duration-200 ${
                  isLiked
                    ? "fill-[#F66F7D] stroke-[#F66F7D]"
                    : "fill-none stroke-[#71717a]"
                }`}
              />
              <span className="text-sm font-semibold text-[#121212] dark:text-white">
                {likeCount >= 1000
                  ? `${Math.floor(likeCount / 1000)}K`
                  : likeCount}
              </span>
            </button>

            <button
              onClick={() => setCommentModalOpen(true)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-semibold text-[#121212] dark:text-white">
                {comments}
              </span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkMutation.isPending || isBookmarked}
            className="h-8 w-8 flex items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            <Bookmark
              className={`w-5 h-5 transition-all duration-200 ${
                isBookmarked
                  ? "fill-[#F66F7D] stroke-[#F66F7D]"
                  : "fill-none stroke-[#71717a]"
              }`}
            />
          </button>
        </div>

        {/* Unlock overlay */}
        {locked && (
          <div className="absolute bottom-24 left-6 z-10">
            <UnlockDialog
              blogId={id}
              title={title}
              author={author}
              content={content}
              image={image}
              price={price}
            />
          </div>
        )}
      </div>

      {/* Comment Modal */}
      <CommentModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        author={author}
        handle={handle}
        avatar={avatar}
        id={id}
        timestamp={timestamp}
        title={title}
        content={content}
        liked={isLiked}
        totalLikes={likeCount}
        totalComments={comments}
        bookmarked={isBookmarked}
        commentsData={commentsData}
        image={image}
        video={video}
      />
    </>
  );
}
