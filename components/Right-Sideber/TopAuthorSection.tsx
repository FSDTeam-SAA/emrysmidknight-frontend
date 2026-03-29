'use client';

import Image from 'next/image'

interface Author {
  id: string
  name: string
  image: string
  followers: number
  stories: number
}

const authors: Author[] = [
  {
    id: '1',
    name: 'Jenny Wilson',
    image: '/Author.png',
    followers: 45000,
    stories: 18,
  },
  {
    id: '2',
    name: 'Arlene McCoy',
    image: '/Author.png',
    followers: 45000,
    stories: 12,
  },
  {
    id: '3',
    name: 'Jane Cooper',
    image: '/Author.png',
    followers: 45000,
    stories: 10,
  },
  {
    id: '4',
    name: 'Ronald Richards',
    image: '/Author.png',
    followers: 45000,
    stories: 14,
  },
]

export function TopAuthorSection() {
  return (
    <div className="w-full rounded-lg">
      <h2 className="text-[#121212] dark:text-white text-xl sm:text-2xl lg:text-[28px] font-medium mb-6 sm:mb-8 lg:mb-10">
        Top Author
      </h2>

      <div className="space-y-4">
        {authors.map((author) => (
          <div
            key={author.id}
            className="flex items-center gap-4 bg-[#FFFFFF] dark:bg-[#FFFFFF0D] border border-[#D7D7D7] dark:border-[#2C2C2C] rounded-[8px]"
          >
            <div className="flex-shrink-0 w-20 h-20 sm:w-[102px] sm:h-[102px] relative  overflow-hidden">
              <Image
                src={author.image}
                alt={author.name}
                width={1000}
                height={1000}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 pt-1">
              <h3 className="text-[#121212] dark:text-white text-base sm:text-lg font-medium">{author.name}</h3>
              <p className="text-[#121212] dark:text-[#D7D7D7] text-xs sm:text-sm mt-1">
                Followers: {(author.followers / 1000).toFixed(0)}K
              </p>
              <p className="text-[#121212] dark:text-[#FFFFFF] font-medium text-sm sm:text-base">
                Total Stories: {author.stories}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}