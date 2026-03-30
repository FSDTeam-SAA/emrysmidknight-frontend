import Image from "next/image";

type FollowerCardProps = {
  bannerSrc: string;
  avatarSrc: string | null;
  name: string;
  handle: string;
  followers: string;
  totalStories: number;
  bio: string;
  onViewProfile: () => void;
  onUnfollow: () => void;
  onMore: () => void;
};

export default function FollowerCard({
  bannerSrc,
  avatarSrc,
  name,
  handle,
  followers,
  totalStories,
  bio,
  onViewProfile,
  onUnfollow,
  onMore,
}: FollowerCardProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-white dark:bg-white/5">

      {/* Hover Glow */}
      {/* <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,#ff4d6d2a,transparent_55%)]" /> */}

      {/* Banner */}
      <div className="relative h-[140px] sm:h-[170px] md:h-[210px] w-full overflow-hidden">
        <Image
          src={bannerSrc}
          alt={`${name} cover`}
          width={1000}
          height={210}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      </div>

      {/* Avatar + Name */}
      <div className="relative z-10 -mt-10 sm:-mt-12 md:-mt-[54px] flex items-end gap-3 px-4 sm:px-5">
        
        <div className="relative h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] md:h-[120px] md:w-[120px] shrink-0 overflow-hidden rounded-full bg-[#2e2e38] ring-4 ring-[#121019]">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={name}
              width={120}
              height={120}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg viewBox="0 0 72 72" className="h-full w-full text-[#555]" fill="currentColor">
              <circle cx="36" cy="28" r="14" />
              <ellipse cx="36" cy="62" rx="22" ry="14" />
            </svg>
          )}
        </div>

        <div className="mb-1">
          <p className="text-lg sm:text-xl md:text-[24px] font-semibold leading-tight text-[#121212] dark:text-white">
            {name}
          </p>
          <p className="text-sm sm:text-base text-gray-500 dark:text-[#D7D7D7]">
            {handle}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4 px-4 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4">
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <p className="text-sm sm:text-base md:text-[18px] dark:text-[#121212] dark:dark:text-white">
            Followers | {followers}
          </p>
          <p className="text-sm sm:text-base md:text-[18px] dark:text-white">
            Stories : {totalStories}
          </p>
        </div>

        {/* Bio */}
        <p className="text-sm sm:text-base leading-relaxed text-[#121212] dark:text-[#D7D7D7] line-clamp-3">
          {bio}
        </p>

        {/* Actions */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          
          {/* View Profile */}
          <button
            onClick={onViewProfile}
            type="button"
            className="flex w-full text-nowrap sm:w-auto justify-center items-center gap-1.5 rounded-[8px] px-4 h-[44px] sm:h-[48px] text-sm sm:text-base text-white font-medium bg-[#F66F7D]"
          >
            <div className=" hidden md:block">
            <UserIcon />
            </div>
            View Profile
          </button>

          {/* Unfollow */}
          <button
            onClick={onUnfollow}
            type="button"
            className="flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-[8px] px-4 h-[44px] sm:h-[48px] text-sm sm:text-base font-medium border border-[#F66F7D] bg-white/5 text-[#F66F7D]"
          >
            <div className=" hidden md:block">
            <UserMinusIcon  />
            </div>
            Unfollow
          </button>

          {/* More */}
          <button
            onClick={onMore}
            type="button"
            className="sm:ml-auto flex h-[44px] w-full sm:w-9 items-center justify-center rounded-[8px] border border-white/10 bg-[#F2F2F2] dark:bg-[#5E5E5E] text-lg dark:text-white/60"
          >
            ···
          </button>
        </div>
      </div>
    </div>
  );
}

/* Icons */

function UserIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function UserMinusIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="10" cy="8" r="4" />
      <path d="M2 20c0-4 3.6-7 8-7s8 3 8 7" />
      <line x1="17" y1="11" x2="23" y2="11" />
    </svg>
  );
}