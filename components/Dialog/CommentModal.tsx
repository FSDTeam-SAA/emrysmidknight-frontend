"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CornerUpLeft, Send, MoreHorizontal, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import type { CommentData, ReplyData } from "../home/StoryPost";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  title: string;
  content: string;
  totalLikes: number;
  totalComments: number;
  bookmarked?: boolean;
  liked?: boolean;
  commentsData?: CommentData[];
  image?: string;
  video?: string;
  id?: string;
}

export function CommentModal({
  open,
  onClose,
  author,
  handle,
  id,
  timestamp,
  title,
  content,
  totalLikes,
  bookmarked = false,
  liked = false,
  commentsData = [],
  image,
  video,
}: CommentModalProps) {
  const [commentText, setCommentText] = useState("");
  const [mergedComments, setMergedComments] = useState<CommentData[]>([]);
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    authorName: string;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const isLoggedIn =
    session.status === "authenticated" && Boolean(token);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setMergedComments(commentsData);
    }
  }, [open, commentsData, liked, totalLikes, bookmarked]);

  useEffect(() => {
    if (!open) return;

    const scrollToBottom = () => {
      const end = commentsEndRef.current;
      const container = scrollContainerRef.current;
      if (end) {
        end.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    const raf = requestAnimationFrame(scrollToBottom);
    const timeoutA = window.setTimeout(scrollToBottom, 120);
    const timeoutB = window.setTimeout(scrollToBottom, 280);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeoutA);
      clearTimeout(timeoutB);
    };
  }, [open, mergedComments]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Comment mutation ──
  const commentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!text || text.trim() === "")
        throw new Error("Comment text cannot be empty");
      const res = await fetch(`${baseURL}/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post comment");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Comment added successfully!");
      queryClient.invalidateQueries({ queryKey: ["blogData"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Failed to add comment"),
  });

  // ── Reply mutation ──
  const replyMutation = useMutation({
    mutationFn: async ({
      commentId,
      text,
    }: {
      commentId: string;
      text: string;
    }) => {
      const res = await fetch(`${baseURL}/comment/${id}/reply/${commentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to post reply");
      return res.json();
    },
    onSuccess: () => toast.success("Reply added!"),
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Failed to add reply"),
  });

  // ── Handlers ──
  const handleAddComment = () => {
    if (!isLoggedIn) {
      toast.warning("Please login first to comment on this post.");
      return;
    }
    if (!commentText.trim()) return;
    const newComment: CommentData = {
      id: String(Date.now()),
      author: "You",
      handle: "you",
      avatar: "",
      time: "Just now",
      text: commentText.trim(),
      likes: 0,
      replies: [],
    };
    setMergedComments((prev) => [newComment, ...prev]);
    setCommentText("");
    commentMutation.mutate(newComment.text);
  };

  const handleAddReply = (commentId: string) => {
    if (!isLoggedIn) {
      toast.warning("Please login first to reply on this comment.");
      return;
    }
    if (!replyText.trim()) return;
    const newReply: ReplyData = {
      id: String(Date.now()),
      author: "You",
      handle: "you",
      avatar: "",
      time: "Just now",
      text: replyText.trim(),
      likes: 0,
    };
    setMergedComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies ?? []), newReply] }
          : c,
      ),
    );
    replyMutation.mutate({ commentId, text: newReply.text });
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="p-0 flex flex-col !max-w-3xl w-full h-[90vh] rounded-lg overflow-hidden [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:w-6 [&>button]:h-6 [&>button]:rounded-full [&>button]:bg-red-500 hover:[&>button]:bg-red-600 [&>button]:transition-colors [&>button_svg]:text-white [&>button_svg]:w-3 [&>button_svg]:h-3"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#1a1a1a] scroll-smooth"
        >
          {/* ── Post ── */}
          <div className="p-5 pb-0">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {author}
                  </p>
                  <p className="text-xs text-gray-400">@{handle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(timestamp), {
                    addSuffix: true,
                  })}
                </span>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white mb-2.5 leading-snug">
              {title}
            </h2>

            <p
              className="text-sm text-gray-700 dark:text-[#c9c9c9] leading-relaxed mb-4 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {image && !video && (
              <div className="mb-4">
                <Image
                  src={image}
                  alt="Post image"
                  width={600}
                  height={380}
                  className="w-full h-[320px] object-cover rounded-[8px]"
                />
              </div>
            )}

            {video && (
              <div className="mb-4">
                <video
                  src={video}
                  controls
                  className="w-full h-[320px] rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          {/* ── Main comment input ── */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-[#2a2a2a]">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="text-[12px] bg-pink-200 text-pink-500">
                Y
              </AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Write a comment.."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
                className="w-full h-9 px-3 pr-10 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-pink-500 dark:bg-[#2a2a2a] dark:border-[#3a3a3a] dark:text-white dark:placeholder-gray-500"
              />
              <button
                onClick={handleAddComment}
                disabled={commentMutation.isPending}
                className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center transition-colors ${commentText.trim() ? "text-pink-500" : "text-gray-400"}`}
              >
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* ── Comments list ── */}
          {mergedComments.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              No comments yet. Be the first!
            </p>
          ) : (
            mergedComments.map((comment) => (
              <div
                key={comment.id}
                className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a2a]"
              >
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {comment.avatar ? (
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                    ) : (
                      <AvatarFallback className="text-[12px] bg-pink-200 text-pink-500">
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      {comment.handle && (
                        <span className="text-xs text-gray-400">
                          @{comment.handle}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        · {comment.time}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-[#c9c9c9] leading-snug mb-2">
                      {comment.text}
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo?.commentId === comment.id
                              ? null
                              : {
                                  commentId: comment.id,
                                  authorName: comment.author,
                                },
                          )
                        }
                        className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors duration-200"
                      >
                        <CornerUpLeft size={13} />
                        <span className="text-xs">Reply</span>
                      </button>
                    </div>

                    {replyingTo?.commentId === comment.id && (
                      <div className="mt-3 flex items-center gap-2">
                        <Avatar className="w-7 h-7 flex-shrink-0">
                          <AvatarFallback className="text-[11px] bg-pink-200 text-pink-500">
                            Y
                          </AvatarFallback>
                        </Avatar>
                        <div className="relative flex-1">
                          <input
                            autoFocus
                            type="text"
                            placeholder={`Reply to ${replyingTo.authorName}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddReply(comment.id);
                              if (e.key === "Escape") {
                                setReplyingTo(null);
                                setReplyText("");
                              }
                            }}
                            className="w-full h-8 px-3 pr-16 text-sm text-gray-900 bg-gray-100 border border-pink-300 rounded-full focus:outline-none focus:ring-1 focus:ring-pink-500 dark:bg-[#2a2a2a] dark:border-pink-400 dark:text-white dark:placeholder-gray-500"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={12} />
                            </button>
                            <button
                              onClick={() => handleAddReply(comment.id)}
                              disabled={replyMutation.isPending}
                              className={`transition-colors ${replyText.trim() ? "text-pink-500" : "text-gray-400"}`}
                            >
                              <Send size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {comment.replies.map((reply: ReplyData) => (
                          <div
                            key={reply.id}
                            className="flex gap-2 bg-gray-50 dark:bg-[#242424] rounded-lg p-3"
                          >
                            <Avatar className="w-7 h-7 flex-shrink-0">
                              {reply.avatar ? (
                                <AvatarImage
                                  src={reply.avatar}
                                  alt={reply.author}
                                />
                              ) : (
                                <AvatarFallback className="text-[11px] bg-pink-200 text-pink-500">
                                  {reply.author.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {reply.author}
                                </span>
                                {reply.handle && (
                                  <span className="text-xs text-gray-400">
                                    @{reply.handle}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400">
                                  · {reply.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-[#c9c9c9] leading-snug mb-1">
                                {reply.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
