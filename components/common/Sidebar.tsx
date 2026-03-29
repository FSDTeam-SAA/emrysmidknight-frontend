'use client'
import React from 'react'
import { Home, Compass, Bell, Bookmark, Users, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navigationItems = [
  { name: 'Home', icon: Home, href: '/', color: 'text-[#121212]' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Subscriptions', icon: Bell, href: '/subscriptions' },
  { name: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
  { name: 'Following', icon: Users, href: '/following' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full min-h-screen p-6 ">
      <nav className="space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                isActive ? "bg-[#FEF1F2]" : "hover:bg-gray-100"
              }`}
            >
              <Icon
                size={24}
                className={
                  isActive
                    ? "text-[#F66F7D]"
                    : item.color || "text-[#121212] dark:text-white group-hover:text-[#F66F7D]"
                }
              />
              <span
                className={`font-medium ${
                  isActive ? "text-[#F66F7D]" : "text-[#121212] dark:text-white group-hover:text-[#F66F7D]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}