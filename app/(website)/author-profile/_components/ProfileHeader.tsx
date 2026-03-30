"use client";
import { useState } from "react";

const UnfollowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MoreIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const TunnelBannerSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 860 220"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="cg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1e3c78" stopOpacity="0.65" />
        <stop offset="70%" stopColor="#050514" stopOpacity="0.98" />
      </radialGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="55%" stopColor="transparent" />
        <stop offset="100%" stopColor="#16181f" />
      </linearGradient>
    </defs>
    <rect width="860" height="220" fill="#080c18" />
    <rect width="860" height="220" fill="url(#cg)" />
    {/* Top vanishing lines */}
    <line x1="0"   y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.6" opacity="0.55" />
    <line x1="107" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.45" />
    <line x1="215" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.38" />
    <line x1="322" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3"  />
    <line x1="430" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.4" opacity="0.25" />
    <line x1="538" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3"  />
    <line x1="645" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.38" />
    <line x1="753" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.45" />
    <line x1="860" y1="0"   x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.6" opacity="0.55" />
    {/* Bottom vanishing lines */}
    <line x1="0"   y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.6" opacity="0.55" />
    <line x1="107" y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.45" />
    <line x1="215" y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.38" />
    <line x1="322" y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3"  />
    <line x1="538" y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.4" opacity="0.3"  />
    <line x1="645" y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.38" />
    <line x1="753" y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.5" opacity="0.45" />
    <line x1="860" y1="220" x2="430" y2="110" stroke="#38bdf8" strokeWidth="0.6" opacity="0.55" />
    {/* Depth rectangle rings (pink) */}
    <rect x="64.5"  y="16.5"  width="731" height="187" fill="none" stroke="#f472b6" strokeWidth="0.5" opacity="0.12" />
    <rect x="150"   y="38"    width="560" height="144" fill="none" stroke="#f472b6" strokeWidth="0.5" opacity="0.1"  />
    <rect x="236"   y="60"    width="388" height="100" fill="none" stroke="#f472b6" strokeWidth="0.5" opacity="0.08" />
    <rect x="322"   y="82"    width="216" height="56"  fill="none" stroke="#f472b6" strokeWidth="0.5" opacity="0.06" />
    {/* Left neon bars */}
    <rect x="0" y="55"  width="130" height="1.5" fill="#38bdf8" opacity="0.75" rx="1" />
    <rect x="0" y="95"  width="85"  height="1"   fill="#38bdf8" opacity="0.5"  rx="1" />
    <rect x="0" y="135" width="105" height="1"   fill="#38bdf8" opacity="0.45" rx="1" />
    <rect x="0" y="172" width="70"  height="1.5" fill="#38bdf8" opacity="0.75" rx="1" />
    {/* Right neon bars */}
    <rect x="730" y="55"  width="130" height="1.5" fill="#38bdf8" opacity="0.75" rx="1" />
    <rect x="775" y="95"  width="85"  height="1"   fill="#38bdf8" opacity="0.5"  rx="1" />
    <rect x="755" y="135" width="105" height="1"   fill="#38bdf8" opacity="0.45" rx="1" />
    <rect x="790" y="172" width="70"  height="1.5" fill="#38bdf8" opacity="0.75" rx="1" />
    {/* Center warm glow */}
    <ellipse cx="430" cy="110" rx="90" ry="55" fill="rgba(251,146,60,0.1)"    />
    <ellipse cx="430" cy="110" rx="35" ry="22" fill="rgba(251,191,36,0.18)"   />
    <ellipse cx="430" cy="110" rx="10" ry="6"  fill="rgba(255,220,100,0.45)"  />
    {/* Bottom fade */}
    <rect width="860" height="220" fill="url(#fade)" />
  </svg>
);

const AvatarSVG = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="80" height="80" fill="#2a1f14" />
    <ellipse cx="40" cy="88" rx="28" ry="20" fill="#2d3a2a" />
    <rect x="34" y="49" width="12" height="13" fill="#c8a882" rx="4" />
    <ellipse cx="40" cy="41" rx="17" ry="18" fill="#c8a882" />
    <ellipse cx="40" cy="28" rx="18" ry="13" fill="#150e06" />
    <path d="M22 33 Q15 50 20 67 Q28 55 35 51 Q25 47 24 40Z" fill="#150e06" />
    <path d="M58 33 Q65 48 60 63 Q52 52 46 52 Q54 46 56 39Z" fill="#150e06" />
    <ellipse cx="33" cy="41" rx="3" ry="2.8" fill="#1a1008" />
    <ellipse cx="47" cy="41" rx="3" ry="2.8" fill="#1a1008" />
    <path d="M35 51 Q40 56 45 51" stroke="#c05060" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

export default function ProfileHeader() {
  const [following, setFollowing] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-start justify-center p-8">
      <div className="w-full max-w-3xl bg-[#16181f] rounded-2xl overflow-visible border border-white/5 shadow-2xl">

        {/* Banner */}
        <div className="relative w-full h-[200px] rounded-t-2xl overflow-hidden">
          <TunnelBannerSVG />
        </div>

        {/* Info Row */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-6 pb-5">

          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-[3px] border-[#16181f] -mt-10 overflow-hidden shrink-0 z-10 shadow-xl">
              <AvatarSVG />
            </div>
            <div className="pt-2">
              <h1 className="text-[#f0f2f7] font-bold text-[17px] tracking-tight leading-tight m-0">
                Arlene McCoy
              </h1>
              <p className="text-[#6b7280] text-[13px] mt-0.5 m-0">@noah_komen</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap pt-2">

            {/* Unfollow / Follow */}
            <button
              onClick={() => setFollowing(!following)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#f47280]/50 bg-[#f47280]/[0.08] text-[#f47280] font-semibold text-[13px] cursor-pointer hover:bg-[#f47280]/[0.18] hover:border-[#f47280] transition-all duration-150"
            >
              <UnfollowIcon />
              {following ? "Unfollow" : "Follow"}
            </button>

            {/* Subscribe */}
            <button
              onClick={() => setSubscribed(!subscribed)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] border-0 font-semibold text-[13px] cursor-pointer transition-all duration-150 ${
                subscribed
                  ? "bg-[#f47280]/20 text-[#f47280]"
                  : "bg-gradient-to-br from-[#f47280] to-[#e85d6e] text-white shadow-[0_4px_14px_rgba(244,114,128,0.35)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(244,114,128,0.45)]"
              }`}
            >
              <BellIcon />
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>

            {/* More */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border border-white/10 bg-white/5 text-[#9ca3af] cursor-pointer hover:bg-white/10 hover:text-[#e5e7eb] transition-all duration-150"
              >
                <MoreIcon />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] bg-[#1e2029] border border-white/10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] min-w-[160px] z-50 p-1.5"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {["Share Profile", "Report", "Block User"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setMenuOpen(false)}
                      className={`block w-full text-left px-3.5 py-2 border-0 bg-transparent text-[13px] font-medium cursor-pointer rounded-lg hover:bg-white/[0.07] transition-colors duration-150 ${
                        item === "Block User" ? "text-[#f47280]" : "text-[#d1d5db]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}