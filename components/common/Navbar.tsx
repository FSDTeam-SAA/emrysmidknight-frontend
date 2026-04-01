"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import Rightsideber from "@/components/common/Rightsideber";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { navigationItems } from "@/components/common/Sidebar";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeIcon, setActiveIcon] = useState<"bell" | "user" | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleIconClick = (icon: "bell" | "user") => {
    setActiveIcon(icon);
    if (icon === "bell") {
      router.push("/notification");
    } else {
      router.push("/profile");
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        isScrolled
          ? "border-black/5 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#121212]/95"
          : "border-transparent bg-white dark:bg-[#FFFFFF0D]"
      }`}
    >
      {/* ─── Navbar ─── */}
      <nav className="container mx-auto flex items-center justify-between overflow-hidden px-3 py-3 sm:px-4 md:px-6 md:py-4">
        {/* LEFT */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {/* Mobile Hamburger */}
          <div className="shrink-0 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#c9727a1a]"
                  aria-label="Open menu"
                >
                  <Menu size={19} className="text-[#121212] dark:text-gray-300" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                showCloseButton={false}
                className="flex w-[88vw] max-w-sm flex-col border-r border-[#242424] bg-[#161616] p-0"
              >
                {/* Sheet Header */}
                <div className="flex items-center justify-between border-b border-[#242424] p-5">
                  <span className="text-base font-medium text-white">Menu</span>
                  <SheetClose asChild>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#c9727a1a]"
                      aria-label="Close menu"
                    >
                      <X size={18} className="text-gray-400" />
                    </button>
                  </SheetClose>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Mobile Search */}
                  <div className="border-b border-[#242424] p-4">
                    <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] px-3 py-2.5">
                      <Search size={16} className="shrink-0 text-gray-500" />
                      <input
                        placeholder="Search stories, authors..."
                        className="min-w-0 flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Nav Links */}
                  <nav className="flex flex-col gap-1 p-3">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                            isActive
                              ? "bg-[#c9727a1f] text-[#c9727a]"
                              : "text-gray-400 hover:bg-[#c9727a14] hover:text-[#c9727a]"
                          }`}
                        >
                          <Icon
                            size={17}
                            className={`shrink-0 ${
                              isActive ? "opacity-100" : "opacity-80"
                            }`}
                          />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 border-t border-[#242424] p-4">
                  <button className="flex-1 rounded-lg border border-[#333] px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#222]">
                    Sign in
                  </button>
                  <button className="flex-1 rounded-lg bg-[#c9727a] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#b6616c]">
                    Get started
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Bar */}
          <div
            className={`flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border px-3 transition-all duration-200 max-w-[160px] sm:max-w-[240px] md:max-w-[380px] ${
              searchFocused
                ? "border-[#c9727a66] bg-[#F2F2F2] shadow-sm dark:bg-[#2C2C2C]"
                : "border-transparent bg-[#F2F2F2] dark:border-[#242424] dark:bg-[#2C2C2C]"
            }`}
          >
            <Search
              size={16}
              className={`shrink-0 ${
                searchFocused ? "text-[#c9727a]" : "text-gray-500"
              }`}
            />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#121212] placeholder:text-[#9CA3AF] focus:outline-none dark:text-white dark:placeholder:text-[#8A8A8A]"
            />
          </div>
        </div>

        {/* CENTER: Logo */}
        <div className="absolute left-1/2 hidden h-[50px] w-[74px] -translate-x-1/2 transform md:flex">
          <Image
            src="/logo.png"
            alt="Logo"
            width={1000}
            height={1000}
            className="h-full w-full object-contain"
          />
        </div>

        {/* RIGHT: Icons */}
        <div className="ml-2 flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleIconClick("bell")}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#c9727a14] sm:h-10 sm:w-10 md:h-auto md:w-auto"
            aria-label="Notifications"
          >
            <Bell
              size={40}
              className={`transition-colors duration-150 ${
                activeIcon === "bell"
                  ? "text-[#F66F7D]"
                  : "text-[#121212] hover:text-[#F66F7D] dark:text-white"
              } md:size-[40px] sm:size-[26px] size-[22px]`}
            />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-[#c9727a] dark:border-[#121212] sm:h-2.5 sm:w-2.5 md:right-1 md:top-1" />
          </button>

          <button
            onClick={() => handleIconClick("user")}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#c9727a14] sm:h-10 sm:w-10 md:h-auto md:w-auto"
            aria-label="Profile"
          >
            <User
              size={40}
              className={`transition-colors duration-150 ${
                activeIcon === "user"
                  ? "text-[#F66F7D]"
                  : "text-[#121212] hover:text-[#F66F7D] dark:text-white"
              } md:size-[40px] sm:size-[26px] size-[22px]`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Right Sidebar Menu Under Navbar */}
      <div className="border-t border-black/5 px-3 py-2 dark:border-[#242424] md:hidden">
        <div className="flex items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-[#2C2C2C] transition hover:text-[#F66F7D] dark:text-gray-300"
                aria-label="Open sidebar menu"
              >
                <Menu size={16} className="text-gray-500 dark:text-gray-400" />
                Menu
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              showCloseButton={false}
              className="flex w-[88vw] max-w-sm flex-col border-l border-[#242424] bg-[#161616] p-0"
            >
              <div className="flex items-center justify-between border-b border-[#242424] p-5">
                <span className="font-medium text-white">Sidebar</span>
                <SheetClose asChild>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#c9727a1a]"
                    aria-label="Close sidebar"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                </SheetClose>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Rightsideber variant="sheet" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
