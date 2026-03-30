

import Image from "next/image";

/**
 * FollowerCard
 * @param {Object}  props
 * @param {string}  props.bannerSrc      – URL for the banner / cover image
 * @param {string}  props.avatarSrc      – URL for the profile avatar
 * @param {string}  props.name           – Display name
 * @param {string}  props.handle         – @username
 * @param {string}  props.followers      – e.g. "37K"
 * @param {number}  props.totalStories   – integer
 * @param {string}  props.bio            – Short bio text
 * @param {()=>void} props.onViewProfile – callback for "View Profile" button
 * @param {()=>void} props.onUnfollow    – callback for "Unfollow" button
 * @param {()=>void} props.onMore        – callback for "…" button
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
}) {
  return (
    <div
      className="
        relative flex flex-col rounded-2xl overflow-hidden
        bg-[#1a1a1f] border border-white/5
        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        transition-transform duration-300 hover:-translate-y-1
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]
        w-full
      "
    >
      {/* ── Banner ── */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={bannerSrc}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* gradient fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1f]" />
      </div>

      {/* ── Avatar row ── */}
      <div className="px-5 -mt-10 flex items-end gap-3 z-10">
        <div className="relative shrink-0 w-[72px] h-[72px] rounded-full overflow-hidden ring-4 ring-[#1a1a1f] bg-[#2e2e38]">
          {avatarSrc ? (
            <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
          ) : (
            /* default silhouette */
            <svg viewBox="0 0 72 72" className="w-full h-full text-[#555]" fill="currentColor">
              <circle cx="36" cy="28" r="14" />
              <ellipse cx="36" cy="62" rx="22" ry="14" />
            </svg>
          )}
        </div>
        <div className="mb-1">
          <p className="text-white font-semibold text-[1.05rem] leading-tight">{name}</p>
          <p className="text-[#8b8b9a] text-sm">{handle}</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 pt-3 pb-5 flex flex-col gap-3 flex-1">
        {/* stats */}
        <p className="text-[#c2c2d0] text-sm font-medium">
          Followers:{" "}
          <span className="text-white font-semibold">{followers}</span>
          <span className="text-[#555] mx-2">|</span>
          Total Stories:{" "}
          <span className="text-white font-semibold">{totalStories}</span>
        </p>

        {/* bio */}
        <p className="text-[#8b8b9a] text-sm leading-relaxed line-clamp-3">{bio}</p>

        {/* actions */}
        <div className="flex items-center gap-2 mt-1">
          {/* View Profile */}
          <button
            onClick={onViewProfile}
            className="
              flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
              bg-[#e8365d] text-white
              hover:bg-[#ff4a6e] active:scale-95
              transition-all duration-150
            "
          >
            <UserIcon />
            View Profile
          </button>

          {/* Unfollow */}
          <button
            onClick={onUnfollow}
            className="
              flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
              border border-[#e8365d] text-[#e8365d]
              hover:bg-[#e8365d]/10 active:scale-95
              transition-all duration-150
            "
          >
            <UserMinusIcon />
            Unfollow
          </button>

          {/* More (…) */}
          <button
            onClick={onMore}
            className="
              ml-auto flex items-center justify-center w-9 h-9 rounded-lg
              bg-white/5 text-[#8b8b9a]
              hover:bg-white/10 hover:text-white active:scale-95
              transition-all duration-150 text-lg leading-none
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