'use client'

interface Story {
  id: string
  title: string
  author: string
  readCount: string
  rank: number
}

interface TrendingStoriesListProps {
  stories?: Story[]
}

export function TrendingStoryItem({ story }: { story: Story }) {
  return (
    <div className="!p-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border dark:!border-[#2C2C2C] rounded-[8px] cursor-pointer">
      <div className="flex gap-4 items-start">
       
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#121212] dark:text-white text-base sm:text-lg lg:text-[24px]">
            {story.title}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm text-[#7D7D7D] dark:text-[#D7D7D7]">
            <span>{story.readCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TrendingStoriesList({ stories }: TrendingStoriesListProps) {
  const defaultStories: Story[] = [
    {
      id: '1',
      title: 'The Dark Forest - by John Writer',
      author: 'John Writer',
      readCount: '3.2K Reads',
      rank: 1,
    },
    {
      id: '2',
      title: 'Moonlight Diary - by Anna Writes',
      author: 'Anna Writes',
      readCount: '2.5K Reads',
      rank: 2,
    },
    {
      id: '3',
      title: 'Moonlight Diary - by Amia Writes',
      author: 'Amia Writes',
      readCount: '2.8K Reads',
      rank: 3,
    },
    {
      id: '4',
      title: 'Curse of the Blood Moon - by Jackson Lee',
      author: 'Jackson Lee',
      readCount: '2.1K Reads',
      rank: 4,
    },
    {
      id: '5',
      title: 'Hidden Letters - by Anna Writes',
      author: 'Anna Writes',
      readCount: '1.9K Reads',
      rank: 5,
    },
  ]

  const displayStories = stories || defaultStories

  return (
    <div className="space-y-4">
      <h2 className="text-[#121212] dark:text-white text-xl sm:text-2xl lg:text-[28px] font-medium mb-6 sm:mb-8 lg:mb-5">
        Trending Stories
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {displayStories.map((story) => (
          <TrendingStoryItem key={story.id} story={story} />
        ))}
      </div>
    </div>
  )
}
