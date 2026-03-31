// "use client";

// import {
//   MessageCircle,
//   Bookmark,
//   MoreHorizontal,
//   ThumbsUp,
// } from "lucide-react";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import Image from "next/image";
// import { UnlockDialog } from "../Dialog/UnlockDialog";

// interface StoryPostProps {
//   author: string;
//   handle: string;
//   avatar: string;
//   timestamp: string;
//   title: string;
//   content: string;
//   likes: number;
//   comments: number;
//   image?: string;
//   video?: string;
//   locked?: boolean;
//   bookmarked?: boolean;
//   bookmarkColor?: string;
// }

// const MAX_CHARS = 220;

// export function StoryPost({
//   author,
//   handle,
//   avatar,
//   timestamp,
//   title,
//   content,
//   likes,
//   comments,
//   image,
//   video,
//   locked = false,
//   bookmarked = false,
//   bookmarkColor = "#F66F7D",
// }: StoryPostProps) {
//   const [expanded, setExpanded] = useState(false);
//   const [isLocked] = useState(locked);
//   const [isBookmarked, setIsBookmarked] = useState(bookmarked);

//   const isLong = content.length > MAX_CHARS;
//   const displayedContent =
//     expanded || !isLong ? content : content.slice(0, MAX_CHARS) + "...";
//   const likeDisplay = `${likes}K`;

//   return (
//     <div className="w-full max-w-2xl dark:bg-[#1a1a1a] bg-[#FFFFFF] rounded-[8px] text-white relative overflow-hidden">
//       {/* ── Blurred content layer ── */}
//       <div>
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 pt-5">
//           <div className="flex items-center gap-3">
//             <Avatar className="h-10 w-10">
//               <AvatarImage src={avatar} alt={author} />
//               <AvatarFallback>{author.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <h3 className="font-semibold text-base dark:text-white text-[#121212] leading-5">{author}</h3>
//               <p className="text-[#9a9a9a] text-xs">@{handle}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="dark:text-[#D7D7D7] text-[#121212] text-sm">{timestamp}</span>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 dark:text-[#8c8c8c] text-[#121212] hover:text-white hover:bg-white/10"
//             >
//               <MoreHorizontal className="h-6 w-6 dark:text-[#D7D7D7] text-black font-bold" />
//             </Button>
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="px-5 pt-4 text-lg font-semibold dark:text-white text-[#121212] leading-6">
//           {title}
//         </h2>

//         <div
//           className={`transition-all duration-300 ${isLocked ? "blur-sm pointer-events-none select-none" : ""}`}
//         >
//           {/* Content */}
//           <p className="px-5 pt-3 text-sm leading-6 dark:text-[#c9c9c9] text-[#121212] whitespace-pre-wrap">
//             {displayedContent}
//             {isLong && !isLocked && (
//               <button
//                 onClick={() => setExpanded(!expanded)}
//                 className="ml-1 text-[#f26d7d] font-medium hover:underline text-sm"
//               >
//                 {expanded ? "Show less" : "Show more"}
//               </button>
//             )}
//           </p>

//           {/* Image */}
//           {image && !video && (
//             <div className="mt-4 px-5">
//               <div className="overflow-hidden">
//                 <Image
//                   width={500}
//                   height={380}
//                   src={image}
//                   alt="Post image"
//                   className="h-[360px] w-full object-cover"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Video */}
//           {video && (
//             <div className="mt-4 px-5">
//               <video
//                 src={video}
//                 controls
//                 className="h-[360px] w-full rounded-xl object-cover bg-black border border-[#2a2a2a]"
//               />
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-5 flex items-center justify-between border-t border-[#D7D7D7] px-5 py-4 text-[#8c8c8c]">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <ThumbsUp className="h-4 w-4" />
//               <span className="text-sm font-semibold dark:text-white text-[#121212]">{likeDisplay}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <MessageCircle className="h-4 w-4" />
//               <span className="text-sm font-semibold dark:text-white text-[#121212]">{comments}</span>
//             </div>
//           </div>

//           {/* Bookmark Button */}
//           <button
//             onClick={() => setIsBookmarked(!isBookmarked)}
//             className="h-8 w-8 flex items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
//           >
//             <Bookmark
//               className="!h-5 !w-5 transition-all duration-200"
//               style={
//                 isBookmarked
//                   ? { fill: bookmarkColor, stroke: bookmarkColor }
//                   : { fill: "none", stroke: "#71717a" }
//               }
//             />
//           </button>
//         </div>
//       </div>

//       {/* ── Unlock overlay (on top, not blurred) ── */}
//       {isLocked && (
//         <div className="absolute bottom-24 left-6 z-10">
//           {/* <button
//             onClick={() => setIsLocked(false)}
//             className="flex items-center gap-2 rounded-lg bg-[#f26d7d] px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:bg-[#e85d6b] active:scale-95"
//           >
//             <Lock size={15} />
//             Unlock
//           </button> */}
//           <UnlockDialog />
//         </div>
//       )}
//     </div>
//   );
// }



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
  // bookmarkColor = "#F66F7D",
}: StoryPostProps) {
  const [expanded, setExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const isLong = content.length > MAX_CHARS;
  const displayedContent =
    expanded || !isLong ? content : content.slice(0, MAX_CHARS) + "...";
  const likeDisplay = `${likes}K`;

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
              <h3 className="text-base font-semibold text-[#121212] dark:text-white leading-5">{author}</h3>
              <p className="text-xs text-[#9a9a9a]">@{handle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#121212] dark:text-[#D7D7D7]">{timestamp}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#121212] dark:text-[#8c8c8c] hover:text-white hover:bg-white/10"
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
        <div className={`transition-all duration-300 ${locked ? "blur-sm pointer-events-none select-none" : ""}`}>
          <p className="px-5 pt-3 text-sm leading-6 text-[#121212] dark:text-[#c9c9c9] whitespace-pre-wrap">
            {displayedContent}
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
                className="w-full h-[360px] rounded-xl object-cover border border-[#2a2a2a] bg-black"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-[#D7D7D7] px-5 py-4 text-[#8c8c8c]">
          <div className="flex items-center gap-4">
            {/* Likes */}
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-semibold text-[#121212] dark:text-white">{likeDisplay}</span>
            </div>

            {/* Comments */}
            <button
              onClick={() => setCommentModalOpen(true)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-semibold text-[#121212] dark:text-white">{comments}</span>
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="h-8 w-8 flex items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Bookmark
              className={`w-5 h-5 transition-all duration-200 ${
                isBookmarked ? "fill-[#F66F7D] stroke-[#F66F7D]" : "fill-none stroke-[#71717a]"
              }`}
            />
          </button>
        </div>

        {/* Unlock overlay */}
        {locked && (
          <div className="absolute bottom-24 left-6 z-10">
            <UnlockDialog />
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
        timestamp={timestamp}
        title={title}
        content={content}
        totalLikes={likes}
        totalComments={comments}
        bookmarked={isBookmarked}
      />
    </>
  );
}