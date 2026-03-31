"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoryPost } from "@/components/home/StoryPost";

// Dummy data for stories
const allStories = [
  {
    id: 1,
    author: "Arlene McCoy",
    handle: "arlene_writer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arlene",
    timestamp: "2 hours ago",
    title: "The Dark Forest – Chapter 1",
    content:
      "The night was silent, and the wind whispered through the trees...",
    likes: 27,
    comments: 657,
    image:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=500&h=380&fit=crop",
    locked: false,
  },
  {
    id: 2,
    author: "Arlene McCoy",
    handle: "arlene_writer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arlene",
    timestamp: "4 hours ago",
    title: "Galactic Wars – Prologue",
    content:
      "In the vast expanse of space, two civilizations clashed in a battle for supremacy...",
    likes: 27,
    comments: 657,
    image:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=500&h=380&fit=crop",
    locked: true,
  },
  // add more stories...
];

// Sidebar collections
const collections = [
  { name: "The Secret Library", icon: "📚" },
  { name: "Hidden Chapters", icon: "🔐" },
  { name: "Story Vault", icon: "🏺" },
  { name: "The Reading Realm", icon: "📖" },
  { name: "Ink Society", icon: "✒️" },
];

export default function StoriesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "free" | "locked">("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter stories by tab
  const filteredStories = () => {
    if (activeTab === "free") return allStories.filter((s) => !s.locked);
    if (activeTab === "locked") return allStories.filter((s) => s.locked);
    return allStories;
  };

  const stories = filteredStories();

  return (
    <div className="min-h-screen bg-[color:var(--page-bg)] text-[color:var(--page-text)]">
      <div className="w-full px-1">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 mb-6">
          <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">
            Stories
          </h1>
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="ghost"
            className="h-9 w-9 p-0 text-[color:var(--text-primary)] hover:bg-[color:var(--surface-alt)]"
          >
            ☰
          </Button>
        </div>

        {/* Backdrop for mobile drawer */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0  lg:hidden "
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-[370px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside>
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="rounded-[8px] p-6 bg-[#FFFFFF]">
                <h2 className="text-[32px] font-semibold text-[color:var(--text-primary)] mb-3">
                  Personal details
                </h2>
                <p className="text-[color:var(--text-secondary)] text-base leading-6 mb-6">
                  Sci-Fi writer exploring futuristic technology and alternate
                  realities. Loves crafting suspenseful short stories that
                  engage readers and spark imagination.
                </p>

                <div className="space-y-3 text-xl">
                  <div>
                    <span className="text-[#121212]">Followers: </span>
                    <span className="text-[#121212]">35K</span>
                  </div>
                  <div>
                    <span className="text-[#121212]">Total Stories: </span>
                    <span className="text-[#121212]">19</span>
                  </div>
                  <div>
                    <span className="text-[#121212]">Email: </span>
                    <span className="text-[#121212]">graham@example.com</span>
                  </div>
                </div>
              </div>

              {/* Collections */}
              <div className="">
                {/* <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)] mb-4">
                  Collections
                </h3> */}
                <div className="space-y-2">
                  {collections.map((collection, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between bg-[#FFFFFF] !rounded-[4px] dark:bg-[#FFFFFF0D] px-4 py-3 text-left text-base text-[#F66F7D] transition "
                    >
                      <span>{collection.name}</span>
                      <Lock className="h-4 w-4 text-[#F66F7D]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0">
            <div className="mx-auto max-w-2xl">
              {/* Sticky Tabs */}
              <div className="sticky top-0 z-10">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    if (
                      value === "all" ||
                      value === "free" ||
                      value === "locked"
                    ) {
                      setActiveTab(value);
                    }
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 rounded-[8px] bg-[#FFFFFF] dark:bg-[#FFFFFF0D]">
                    <TabsTrigger
                      value="all"
                      className="rounded-[8px] text-xs font-medium leading-[120%] text-[#121212] data-[state=active]:bg-[#FCD2D7] data-[state=active]:text-black md:text-sm"
                    >
                      All Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="free"
                      className="rounded-[8px] h-[48px] text-xs font-medium text-[#121212] data-[state=active]:bg-[#FCD2D7] data-[state=active]:text-black md:text-sm"
                    >
                      Free Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="locked"
                      className="rounded-[8px] text-xs font-medium text-[#121212] data-[state=active]:bg-[#FCD2D7] data-[state=active]:text-black md:text-sm"
                    >
                      Locked Content
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Tab Content */}
              <div className="pt-6 space-y-6">
                {stories.length > 0 ? (
                  stories.map((story) => (
                    <StoryPost
                      key={story.id}
                      author={story.author}
                      handle={story.handle}
                      avatar={story.avatar}
                      timestamp={story.timestamp}
                      title={story.title}
                      content={story.content}
                      likes={story.likes}
                      comments={story.comments}
                      image={story.image}
                      locked={story.locked}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[color:var(--text-secondary)]">
                      {activeTab === "all"
                        ? "No stories in this category"
                        : activeTab === "free"
                          ? "No free stories available"
                          : "No locked stories available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
