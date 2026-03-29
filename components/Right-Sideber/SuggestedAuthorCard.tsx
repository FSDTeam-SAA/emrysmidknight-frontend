'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '../ui/button'

interface SuggestedAuthor {
  id: string
  name: string
  specialty: string
  followers: string
  avatar: string
}

interface SuggestedAuthorCardProps {
  author: SuggestedAuthor
}

export function SuggestedAuthorCard({ author }: SuggestedAuthorCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-base sm:text-xl text-[#121212] dark:text-[#FFFFFF]">{author.name}</h3>
          <p className="text-xs sm:text-sm text-[#7D7D7D] mt-1">{author.followers}</p>
        </div>
      </div>
      <Button
        onClick={() => setIsFollowing(!isFollowing)}
        className="ml-3 sm:ml-4 text-xs sm:text-sm bg-transparent font-normal text-[#F66F7D] border-[#F66F7D] h-8 sm:h-[37px] px-[15px] whitespace-nowrap"
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  )
}

export function SuggestedAuthorSection() {
  const suggestedAuthors: SuggestedAuthor[] = [
    {
      id: '1',
      name: 'Kristin Watson',
      specialty: 'Fantasy, YA',
      followers: 'Followers: 12.3K',
      avatar: '/profile.png',
    },
    {
      id: '2',
      name: 'Marvin McKinney',
      specialty: 'Sci-Fi, Mystery',
      followers: 'Followers: 8.2K',
      avatar: '/profile.png',
    },
    {
      id: '3',
      name: 'Savannah Nguyen',
      specialty: 'Romance, Drama',
      followers: 'Followers: 15.4K',
      avatar: '/profile.png',
    },
    {
      id: '4',
      name: 'Jacob Jones',
      specialty: 'Thriller, Action',
      followers: 'Followers: 12.3K',
     avatar: '/profile.png',
    },
    {
      id: '5',
      name: 'Roselia Cooper',
      specialty: 'Fiction, Mystery',
      followers: 'Followers: 9.8K',
     avatar: '/profile.png',
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="dark:text-white text-[#121212] text-xl sm:text-2xl lg:text-[28px] font-medium mb-6 sm:mb-8 lg:mb-10">
        Suggested Authors
      </h2>
      <div className="space-y-2 sm:space-y-3 bg-[#FFFFFF] border border-[#D7D7D7] dark:border-[#2C2C2C] dark:bg-[#FFFFFF0D] rounded-[8px]">
        {suggestedAuthors.map((author) => (
          <SuggestedAuthorCard key={author.id} author={author} />
        ))}
      </div>
    </div>
  )
}
