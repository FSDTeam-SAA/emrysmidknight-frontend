'use client';

import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface StoryPostProps {
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

export function StoryPost({
  author,
  handle,
  avatar,
  timestamp,
  title,
  content,
  likes,
  comments,
}: StoryPostProps) {
  return (
    <div className="w-full max-w-2xl bg-[#FFFFFF0D]   rounded-[8px] p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-[44px] w-[44px]">
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-medium text-xl leading-5">{author}</h3>
            <p className="text-[#D7D7D7] text-sm">@{handle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-sm">{timestamp}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-3 leading-6">{title}</h2>

      {/* Content */}
      <p className="text-zinc-300 text-base leading-6 mb-4 whitespace-pre-wrap">
        {content}
      </p>

      {/* Footer - Engagement Metrics */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#5E5E5E] text-zinc-500">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          <span className="text-sm font-semibold text-white">{likes.toLocaleString()}k</span>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-semibold text-white">{comments}</span>
        </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10">
          <Bookmark className="!h-5 !w-5" />
        </Button>
      </div>
    </div>
  );
}
