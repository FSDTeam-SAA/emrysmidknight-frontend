'use client'
import React from 'react'
import { Home, Compass, Bell, Bookmark, Users, Settings, LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export const navigationItems = [
  { name: 'Home', icon: Home, href: '/', color: '' },
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Subscriptions', icon: Bell, href: '/subscriptions' },
  { name: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
  { name: 'Following', icon: Users, href: '/following' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full min-h-screen mt-8">
      <nav className="space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                isActive ? "bg-[#FEF1F2] dark:bg-[#FFFFFF0D]" : "dark:hover:bg-[#FFFFFF0D] hover:bg-[#FEF1F2]"
              }`}
            >
              <Icon
                size={24}
                className={
                  isActive
                    ? "text-[#F66F7D] text-[20px] font-medium leading-[120%]"
                    : item.color || "text-[#121212] dark:text-white group-hover:text-[#F66F7D] text-[20px] font-medium leading-[120%]"
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
