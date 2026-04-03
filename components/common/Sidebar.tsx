'use client'
import React, { useState } from 'react'
import { Home, Compass, Bell, Bookmark, Users, Settings, LayoutDashboard, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

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
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const handleConfirmLogout = async () => {
    await signOut({ callbackUrl: '/signin' })
  }

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

        <button
          onClick={() => setLogoutModalOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#FEF1F2] dark:hover:bg-[#FFFFFF0D] group"
        >
          <LogOut
            size={24}
            className="text-[#121212] dark:text-white group-hover:text-[#F66F7D] text-[20px] font-medium leading-[120%]"
          />
          <span className="font-medium text-[#121212] dark:text-white group-hover:text-[#F66F7D]">
            Logout
          </span>
        </button>
      </nav>

      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="w-full max-w-sm rounded-xl bg-white p-5 dark:bg-[#2C2C2C]">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">
            Confirm Logout
          </h3>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
            Are you sure you want to logout?
          </p>
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="rounded-md border border-[color:var(--border)] px-3 py-2 text-sm font-medium text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface)]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              className="rounded-md bg-[#F66F7D] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#e85d6b]"
            >
              Logout
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
