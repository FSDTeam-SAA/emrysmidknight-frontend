
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

/**
 * FollowerCard
 * @param {Object}  props
 * @param {string}  props.bannerSrc      
 * @param {string|null} props.avatarSrc  
 * @param {string}  props.name          
 * @param {string}  props.handle        
 * @param {string}  props.followers      
 * @param {number}  props.totalStories   
 * @param {string}  props.bio           
 * @param {()=>void} props.onViewProfile 
 * @param {()=>void} props.onUnfollow   
 * @param {()=>void} props.onMore        
 */
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
    <div
      className="
        group relative flex h-full flex-col overflow-hidden rounded-3xl
        border border-white/10 bg-[#FFFFFF] dark:bg-white/5
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300
          group-hover:opacity-100
          bg-[radial-gradient(circle_at_top,#ff4d6d2a,transparent_55%)]
        "
      />

      {/* ── Banner ── */}
      <div className="relative h-[210px] w-full overflow-hidden">
        <Image
          src={bannerSrc}
          alt={`${name} cover`}
          width={1000}
          height={210}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      
      </div>

      {/* ── Avatar row ── */}
      <div className="relative z-10 -mt-[54px] flex items-end gap-3 px-5">
        <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full bg-[#2e2e38] ring-4 ring-[#121019]">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={name}
              width={120}
              height={120}
              className="h-full w-full object-cover"
            />
          ) : (
            /* default silhouette */
            <svg viewBox="0 0 72 72" className="h-full w-full text-[#555]" fill="currentColor">
              <circle cx="36" cy="28" r="14" />
              <ellipse cx="36" cy="62" rx="22" ry="14" />
            </svg>
          )}
        </div>
        <div className="mb-1">
          <p
            className={`text-[24px] font-semibold leading-tight text-[#121212] dark:text-white`}
          >
            {name}
          </p>
          <p className="text-  dark:text-[#D7D7D7]">{handle}</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <p className="text-[20px]   text-[#FFFFFF]">
              Followers |  {followers}
            </p>
            
            
          </div>
          <div className="flex items-center">
            <p className="text-[20px]  text-white">
              Stories :  {totalStories}
            </p>
         
          </div>
        </div>

        {/* bio */}
        <p className="text-base leading-relaxed text-[#D7D7D7] line-clamp-3">{bio}</p>

        {/* actions */}
        <div className="mt-1 flex items-center gap-2">
          {/* View Profile */}
          <button
            onClick={onViewProfile}
            type="button"
            className="
              flex items-center gap-1.5 rounded-[8px] px-4 h-[48px] text-base text-white font-midium bg-[#F66F7D]
            
            "
          >
            <UserIcon />
            View Profile
          </button>

          {/* Unfollow */}
          <button
            onClick={onUnfollow}
            type="button"
            className="
              flex items-center gap-1.5 rounded-[8px] px-4 h-[48px] text-base font-medium border border-[#F66F7D] bg-white/5 text-[#F66F7D]
            "
          >
            <UserMinusIcon />
            Unfollow
          </button>

          {/* More (…) */}
          <button
            onClick={onMore}
            type="button"
            className="
              ml-auto flex h-9 w-9 items-center justify-center rounded-[8px]
              border border-white/10 bg-[#5E5E5E] text-lg leading-none text-white/60
            "
            aria-label="More options"
          >
            ···
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Tiny inline SVG icons ── */
function UserIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function UserMinusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="8" r="4" />
      <path d="M2 20c0-4 3.6-7 8-7s8 3 8 7" />
      <line x1="17" y1="11" x2="23" y2="11" />
    </svg>
  );
}
