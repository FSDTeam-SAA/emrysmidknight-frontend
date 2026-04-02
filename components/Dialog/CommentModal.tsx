"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ThumbsUp,
  CornerUpLeft,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

interface Reply {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  replies?: Reply[];
}

const DUMMY_COMMENTS: Comment[] = [];

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
}

export function CommentModal({
  open,
  onClose,
  author,
  handle,
  avatar,
  timestamp,
  title,
  content,
  totalLikes,
  totalComments,
  bookmarked = false,
}: CommentModalProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: "You",
      avatar: "",
      time: "Just now",
      text: commentText.trim(),
      likes: 0,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const toggleLike = (type: "comment" | "reply", id: number) => {
    const key = `${type}-${id}`;
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="p-0 overflow-hidden flex flex-col !max-w-2xl w-full max-h-[90vh] rounded-lg">
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Post */}
          <div className="p-5 pb-0">
            <div className="flex justify-between items-center mb-3">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={avatar} alt={author} />
                  <AvatarFallback className="bg-pink-200 text-pink-500">
                    {author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-gray-900">{author}</p>
                  <p className="text-xs text-gray-400">@{handle}</p>
                </div>
              </div>

              {/* Timestamp + options */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{timestamp}</span>
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Title & Content */}
            <h2 className="text-[17px] font-bold text-gray-900 mb-2.5 leading-snug">
              {title}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {content}
            </p>

            {/* Actions */}
            <div className="flex justify-between items-center border-y border-gray-100 py-3">
              <div className="flex items-center gap-5">
                {/* Like */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex items-center gap-1.5 hover:text-pink-500 transition-colors duration-200"
                >
                  <ThumbsUp
                    size={16}
                    className={
                      isLiked
                        ? "fill-pink-500 stroke-pink-500"
                        : "stroke-gray-400"
                    }
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {totalLikes + (isLiked ? 1 : 0)}k
                  </span>
                </button>

                {/* Comments */}
                <div className="flex items-center gap-1.5">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#6b7280"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalComments}
                  </span>
                </div>
              </div>

              {/* Bookmark */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="hover:text-pink-500 transition-colors duration-200"
              >
                <Bookmark
                  size={18}
                  className={
                    isBookmarked
                      ? "fill-pink-500 stroke-pink-500"
                      : "stroke-gray-400"
                  }
                />
              </button>
            </div>
          </div>

          {/* Comment input */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
            <Avatar className="w-8 h-8">
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
                className="w-full h-9 px-3 pr-10 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <button
                onClick={handleAddComment}
                className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center text-gray-400 ${commentText.trim() && "text-pink-500"}`}
              >
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* Comments list */}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="px-5 py-4 border-b border-gray-100"
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-400">
                      · {comment.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug mb-2">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike("comment", comment.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors duration-200"
                    >
                      <ThumbsUp
                        size={13}
                        className={
                          likedComments.has(`comment-${comment.id}`)
                            ? "fill-pink-500 stroke-pink-500"
                            : "stroke-gray-400"
                        }
                      />
                      <span className="text-xs">
                        {comment.likes +
                          (likedComments.has(`comment-${comment.id}`) ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors duration-200">
                      <CornerUpLeft size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-11 flex flex-col gap-2">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex gap-2 bg-gray-50 rounded-lg p-3"
                    >
                      <Avatar className="w-7 h-7 flex-shrink-0">
                        <AvatarImage src={reply.avatar} alt={reply.author} />
                        <AvatarFallback className="text-[11px] bg-pink-200 text-pink-500">
                          {reply.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {reply.author}
                          </span>
                          <span className="text-xs text-gray-400">
                            · {reply.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-snug mb-1">
                          {reply.text}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleLike("reply", reply.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors duration-200"
                          >
                            <ThumbsUp
                              size={12}
                              className={
                                likedComments.has(`reply-${reply.id}`)
                                  ? "fill-pink-500 stroke-pink-500"
                                  : "stroke-gray-400"
                              }
                            />
                            <span className="text-xs">
                              {reply.likes +
                                (likedComments.has(`reply-${reply.id}`)
                                  ? 1
                                  : 0)}
                            </span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors duration-200">
                            <CornerUpLeft size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
