'use client'
import React from 'react'

import { Home, Compass, Bell, Bookmark, Users, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navigationItems = [
  { name: 'Home', icon: Home, href: '/', color: 'text-red-500' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Subscriptions', icon: Bell, href: '/subscriptions' },
  { name: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
  { name: 'Following', icon: Users, href: '/following' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full   min-h-screen p-6">
      <nav className="space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 group"
            >
              <Icon
                size={24}
                className={item.color || 'text-slate-400 group-hover:text-slate-200'}
              />
              <span className="text-slate-200 font-medium group-hover:text-white">
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
