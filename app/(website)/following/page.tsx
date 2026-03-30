"use client";

import FollowerCard from "./_components/Followercard";



/* ── Dummy data ─────────────────── */
type Follower = {
  id: number;
  bannerSrc: string;
  avatarSrc: string | null;
  name: string;
  handle: string;
  followers: string;
  totalStories: number;
  bio: string;
};

const FOLLOWING: Follower[] = [
  {
    id: 1,
    bannerSrc:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Theresa Webb",
    handle: "@belindaa",
    followers: "37K",
    totalStories: 25,
    bio: "Fantasy storyteller creating epic worlds with dragons, magic, and adventure. Passionate about short-form stories and connecting with readers globally.",
  },
  {
    id: 2,
    bannerSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    avatarSrc: null,
    name: "Darlene Robertson",
    handle: "@valeenyabs_",
    followers: "45K",
    totalStories: 15,
    bio: "Crafting suspenseful mysteries with unexpected twists.",
  },
  {
    id: 3,
    bannerSrc:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Ariana Flores",
    handle: "@ariana.writes",
    followers: "22K",
    totalStories: 40,
    bio: "Sci-fi dreamer exploring distant galaxies.",
  },
  {
    id: 4,
    bannerSrc:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    avatarSrc: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Marcus Chen",
    handle: "@marcusnarrates",
    followers: "61K",
    totalStories: 8,
    bio: "Literary fiction author diving deep into the human condition.",
  },
];

/* ── Page ───────── */
export default function FollowingPage() {
  function handleViewProfile(user: Follower) {
    console.log("View profile →", user.handle);
  }

  function handleUnfollow(id: number) {
    console.log("Unfollow user id:", id);
  }

  function handleMore(id: number) {
    console.log("More options for:", id);
  }

  return (
    <main
      className={` px-4 py-10 sm:px-8 lg:px-4 overflow-visible`}
    >
      {/* ── Header ── */}
      <div className="mb-10">
        <h1
          className={` text-3xl sm:text-4xl lg:text-[40px] leading-tight font-semibold`}
        >
          Following
        </h1>
      </div>

      {/* ── Grid ── */}
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
        "
      >
        {FOLLOWING.map((user) => (
          <FollowerCard
            key={user.id}
            bannerSrc={user.bannerSrc}
            avatarSrc={user.avatarSrc}
            name={user.name}
            handle={user.handle}
            followers={user.followers}
            totalStories={user.totalStories}
            bio={user.bio}
            onViewProfile={() => handleViewProfile(user)}
            onUnfollow={() => handleUnfollow(user.id)}
            onMore={() => handleMore(user.id)}
          />
        ))}
      </div>
    </main>
  );
}