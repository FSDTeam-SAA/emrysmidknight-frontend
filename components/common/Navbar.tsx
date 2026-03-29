'use client'

import { useEffect, useState } from "react";
import { 
  Search, Bell, User, Menu, X, BookOpen, TrendingUp, Star, Feather, Home, Compass, Tag, Users 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import Image from "next/image";
import Rightsideber from "@/components/common/Rightsideber";



const navLinks = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: TrendingUp, label: "Trending" },
  { icon: BookOpen, label: "Reading List" },
  { icon: Star, label: "Featured" },
  { icon: Tag, label: "Tags" },
  { icon: Users, label: "Authors" },
  { icon: Feather, label: "Write" },
];

export default function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        isScrolled ? "bg-white dark:dark:bg-[#121212]" : "bg-white dark:bg-[#FFFFFF0D]"
      }`}
    >
      {/* ─── Navbar ─── */}
      <nav className=" container mx-auto  flex items-center justify-between py-4 px-4 md:px-6 ">
        
        {/* LEFT: Hamburger + Search */}
        <div className="flex items-center flex-1 gap-2">
          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#c9727a1f]" aria-label="Open menu">
                  <Menu size={20} className="text-gray-400" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                showCloseButton={false}
                className="w-[88vw] max-w-sm p-0 bg-[#161616] border-r border-[#242424] flex flex-col"
              >
                {/* Sheet Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#242424]">
                  <span className="text-white font-medium">Menu</span>
                  <SheetClose asChild>
                    <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#c9727a1f]" aria-label="Close menu">
                      <X size={18} className="text-gray-400" />
                    </button>
                  </SheetClose>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Mobile Search */}
                  <div className="p-3 border-b border-[#1e1e1e]">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded-md">
                      <Search size={15} className="text-gray-500" />
                      <input
                        placeholder="Search stories, authors…"
                        className="flex-1 bg-transparent text-gray-300 text-sm placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Nav Links */}
                  <nav className="flex flex-col p-2 gap-1">
                    {navLinks.map(({ icon: Icon, label }) => (
                      <a
                        key={label}
                        href="#"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg text-sm hover:bg-[#c9727a1a] hover:text-[#c9727a] transition"
                      >
                        <Icon size={17} className="opacity-70" />
                        {label}
                      </a>
                    ))}
                  </nav>

                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 p-4 border-t border-[#242424]">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-400 border border-[#333] rounded-lg hover:bg-[#222]">Sign in</button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#c9727a] rounded-lg hover:bg-[#b6616c]">Get started</button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Bar */}
          <div className={`flex items-center gap-2 px-4 py-1 rounded-full border transition-all duration-200 flex-1 max-w-[380px] 
            ${searchFocused ? 'border-[#c9727a66] bg-[#F2F2F2] dark:bg-[#2C2C2C]' : 'dark:border-[#242424] bg-[#F2F2F2] dark:bg-[#2C2C2C]'}`}>
            <Search size={20} className={searchFocused ? "text-[#c9727a]" : "text-gray-500"} />
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search stories, authors…"
              className="flex-1 bg-[#F2F2F2] dark:bg-[#2C2C2C] h-[40px] text-gray-300 text-sm focus:outline-none min-w-0 placeholder:text-[#D7D7D7]"
            />
          </div>
        </div>

        {/* CENTER: Logo */}
        <div className="absolute w-[74px] h-[50px] left-1/2 transform -translate-x-1/2 hidden md:flex">
          <Image src="/logo.png" alt="Logo" width={1000} height={1000} className="w-full h-full object-cover" />
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#c9727a1f]" aria-label="Notifications">
            <Bell size={40} className="text-[#121212] dark:text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c9727a] border-2 border-[#161616]" />
          </button>
          <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#c9727a1f]" aria-label="Profile">
            <User size={40} className="text-[#121212] dark:text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Right Sidebar Menu Under Navbar */}
      <div className="md:hidden border-t border-[#242424] px-4 py-2">
        <div className="flex items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 bg-[#1e1e1e] border border-[#2a2a2a] rounded-md hover:bg-[#232323]" aria-label="Open sidebar menu">
                <Menu size={16} className="text-gray-400" />
                Menu
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-[88vw] max-w-sm p-0 bg-[#161616] border-l border-[#242424] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#242424]">
                <span className="text-white font-medium">Sidebar</span>
                <SheetClose asChild>
                  <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#c9727a1f]" aria-label="Close sidebar">
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
