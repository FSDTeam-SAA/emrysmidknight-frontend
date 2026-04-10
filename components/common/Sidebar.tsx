'use client'
import React, { useState } from 'react'
import { Home, Compass, Bell, Bookmark, Users, Settings, LayoutDashboard, LogOut, Unlock, Info } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export const navigationItems = [
  { name: 'Home', icon: Home, href: '/', color: '' },
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Explore', icon: Compass, href: '/explore' },
  { name: 'Subscriptions', icon: Bell, href: '/subscriptions' },
  { name: 'Unlocked', icon: Unlock, href: '/my-unlock-blogs' },
  { name: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
  { name: 'Following', icon: Users, href: '/following' },
  { name: 'About', icon: Info , href: '/about' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

type SidebarMenuProps = {
  variant?: 'sidebar' | 'sheet'
  className?: string
}

export function SidebarMenu({ variant = 'sidebar', className = '' }: SidebarMenuProps) {
  const pathname = usePathname()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const { data: session } = useSession()
  const role = session?.user?.role
  const isLoggedIn = Boolean(session?.user)
  const isSheet = variant === 'sheet'

  const handleConfirmLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const navClassName = `${isSheet ? 'flex flex-col gap-1' : 'space-y-4'} ${className}`

  return (
    <>
      <nav className={navClassName}>
        {navigationItems.map((item) => {
          if (item.href === '/dashboard' && role !== 'author') return null
          const Icon = item.icon
          const isActive = pathname === item.href

          if (isSheet) {
            return (
              <Link
                key={item.href}
                href={item.href}
                data-close-sheet="true"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-[#c9727a1f] text-[#c9727a]'
                    : 'text-gray-400 hover:bg-[#c9727a14] hover:text-[#c9727a]'
                }`}
              >
                <Icon size={17} className={`shrink-0 ${isActive ? 'opacity-100' : 'opacity-80'}`} />
                <span>{item.name}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-[4px] transition-colors group ${
                isActive ? 'bg-[#FEF1F2] dark:bg-[#FFFFFF0D]' : 'dark:hover:bg-[#FFFFFF0D] hover:bg-[#FEF1F2]'
              }`}
            >
              <Icon
                size={24}
                className={
                  isActive
                    ? 'text-[#F66F7D] text-[20px] font-medium leading-[120%]'
                    : item.color ||
                      'text-[#121212] dark:text-white group-hover:text-[#F66F7D] text-[20px] font-medium leading-[120%]'
                }
              />
              <span
                className={`font-medium ${
                  isActive ? 'text-[#F66F7D]' : 'text-[#121212] dark:text-white group-hover:text-[#F66F7D]'
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}

        {isLoggedIn && (
          <button
            onClick={() => setLogoutModalOpen(true)}
            data-close-sheet={isSheet ? "true" : undefined}
            className={
              isSheet
                ? 'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition text-gray-400 hover:bg-[#c9727a14] hover:text-[#c9727a]'
                : 'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#FEF1F2] dark:hover:bg-[#FFFFFF0D] group'
            }
          >
            <LogOut
              size={isSheet ? 17 : 24}
              className={
                isSheet
                  ? 'shrink-0 opacity-80'
                  : 'text-[#121212] dark:text-white group-hover:text-[#F66F7D] text-[20px] font-medium leading-[120%]'
              }
            />
            <span
              className={
                isSheet
                  ? 'text-left'
                  : 'font-medium text-[#121212] dark:text-white group-hover:text-[#F66F7D]'
              }
            >
              Logout
            </span>
          </button>
        )}
      </nav>

      {isLoggedIn && (
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
      )}
    </>
  )
}





export default function Sidebar() {
  return (
    <div className="w-full min-h-screen mt-8 sticky top-[90px]">
      <SidebarMenu />
    </div>
  )
}
