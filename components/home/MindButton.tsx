import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MindButtonProps = {
  avatarUrl?: string;
  name?: string;
};

const getInitials = (value?: string) => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(" ").filter(Boolean);
  const letters = parts.map((part) => part[0]?.toUpperCase() ?? "");
  return letters.slice(0, 2).join("") || "U";
};

export default function MindButton({ avatarUrl, name }: MindButtonProps) {
  const handleClick = () => {
    console.log("Open post modal");
    // open modal / navigate
  };

  return (
    <div className="w-full flex justify-center py-4 sm:py-4">
      <div className="w-full  bg-white dark:bg-[#FFFFFF0D]  rounded-[8px] p-3 sm:p-4 ">
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Avatar */}
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border border-white/10">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={name ? `${name} avatar` : "avatar"} /> : null}
            <AvatarFallback className="bg-gray-200 text-gray-600 dark:bg-[#1b1b1b] dark:text-white/70">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          {/* Fake Input Button */}
          <Link href="/create-post" className="flex-1">
            <button
              onClick={handleClick}
              className="w-full text-left h-14 sm:h-16 rounded-2xl px-4 sm:px-5 bg-white dark:bg-[#1b1b1b] border dark:border-white/20 dark:text-white/70 text-base sm:text-lg transition-all duration-200"
            >
              What's on your mind?
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
