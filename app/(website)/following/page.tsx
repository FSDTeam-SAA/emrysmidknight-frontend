
"use client";

import FollowerCard from "./_components/Followercard";

/* ── Dummy dat────────────────────── */
const FOLLOWING = [
  {
    id: 1,
    bannerSrc: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Theresa Webb",
    handle: "@belindaa",
    followers: "37K",
    totalStories: 25,
    bio: "Fantasy storyteller creating epic worlds with dragons, magic, and adventure. Passionate about short-form stories and connecting with readers globally.",
  },
  {
    id: 2,
    bannerSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    avatarSrc: null, // no avatar → shows silhouette
    name: "Darlene Robertson",
    handle: "@valeenyabs_",
    followers: "45K",
    totalStories: 15,
    bio: "Crafting suspenseful mysteries with unexpected twists. Loves keeping readers on edge, solving intricate plots, and revealing secrets chapter by chapter.",
  },
  {
    id: 3,
    bannerSrc: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Ariana Flores",
    handle: "@ariana.writes",
    followers: "22K",
    totalStories: 40,
    bio: "Sci-fi dreamer. Exploring distant galaxies through words — one warp-speed chapter at a time.",
  },
  {
    id: 4,
    bannerSrc: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    avatarSrc: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Marcus Chen",
    handle: "@marcusnarrates",
    followers: "61K",
    totalStories: 8,
    bio: "Literary fiction author diving deep into the human condition. Sparse prose, maximum impact.",
  },
];

/* ── Page ───────── */
export default function FollowingPage() {
  function handleViewProfile(user) {
    console.log("View profile →", user.handle);
    // router.push(`/profile/${user.handle}`)
  }

  function handleUnfollow(id) {
    console.log("Unfollow user id:", id);
    // dispatch(unfollowUser(id))
  }

  function handleMore(id) {
    console.log("More options for:", id);
  }

  return (
    <main className="min-h-screen bg-[#111114] px-4 py-10 sm:px-8 lg:px-16">
      {/* ── Header ── */}
      <h1 className="text-white text-3xl font-bold mb-8 tracking-tight">
        Following
      </h1>

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