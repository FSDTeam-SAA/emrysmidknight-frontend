'use client'

import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton" // ✅ added

interface Story {
  id: string
  title: string
  readCount: string
}

interface TrendingStoriesListProps {
  stories?: Story[]
}

export function TrendingStoryItem({ story }: { story: Story }) {
  return (
    <div className="!p-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border dark:!border-[#2C2C2C] rounded-[8px] cursor-pointer">
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#121212] dark:text-white text-[14px] sm:text-base lg:text-[22px]">
            {story.title}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-[11px] sm:text-xs lg:text-sm text-[#7D7D7D] dark:text-[#D7D7D7]">
            <span>{story.readCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TrendingStoriesList({ stories }: TrendingStoriesListProps) {
  type TrendingStoryApi = {
    _id: string
    title?: string
    author?: {
      fullName?: string
      userName?: string
    }
    likes?: string[]
  }

  type TrendingStoryResponse = {
    data?: TrendingStoryApi[]
  }

  const { data: apiStories = [], isLoading, isError } = useQuery({
    queryKey: ['trendingStories'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blog/trending-story`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) throw new Error("Failed to fetch trending stories")
      const result: TrendingStoryResponse = await res.json()
      return result?.data ?? []
    },
  })

  const mappedStories: Story[] = apiStories.map((item) => {
    const authorName =
      item.author?.fullName && item.author.fullName.trim().length > 0
        ? item.author.fullName
        : item.author?.userName || "Unknown Author"

    return {
      id: item._id,
      title: `${item.title || "Untitled Story"} - by ${authorName}`,
      readCount: `${item.likes?.length || 0} Likes`,
    }
  })

  const displayStories = stories || mappedStories

  return (
    <div className="space-y-4">
      <h2 className="text-[#121212] dark:text-white text-xl sm:text-2xl lg:text-[28px] font-medium mb-6 sm:mb-8 lg:mb-5">
        Trending Stories
      </h2>

      <div className="space-y-2 sm:space-y-3">
        
        {/* ✅ Skeleton */}
        {isLoading &&
          [1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="!p-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border dark:!border-[#2C2C2C] rounded-[8px]"
            >
              <div className="space-y-3">
                <Skeleton className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="w-32 h-4 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}

        {isError ? (
          <div className="!p-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border dark:!border-[#2C2C2C] rounded-[8px]">
            <p className="text-sm text-red-500">Failed to load trending stories.</p>
          </div>
        ) : null}

        {!isLoading && !isError && displayStories.length === 0 ? (
          <div className="!p-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border dark:!border-[#2C2C2C] rounded-[8px]">
            <p className="text-sm text-[#7D7D7D] dark:text-[#D7D7D7]">No trending stories found.</p>
          </div>
        ) : null}

        {!isLoading && !isError && displayStories.map((story) => (
          <TrendingStoryItem key={story.id} story={story} />
        ))}
      </div>
    </div>
  )
}
