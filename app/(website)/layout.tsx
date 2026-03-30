"use client";

import Sidebar from "@/components/common/Sidebar";
import "../globals.css";
import Rightsideber from "@/components/common/Rightsideber";
import Navbar from "@/components/common/Navbar";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isSettingsPage = pathname.startsWith("/settings");
  const isFollowingPage = pathname.startsWith("/following");

  
  const isFullWidthPage = isSettingsPage || isFollowingPage;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[color:var(--page-bg)] text-[color:var(--page-text)]">
        <Navbar />

        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-4">
            
            {/* Left Sidebar */}
            <aside className="hidden lg:block lg:col-span-2">
              <Sidebar />
            </aside>

            {/* Main Content */}
            <main
              className={`col-span-1 ${
                isFullWidthPage ? "lg:col-span-10" : "lg:col-span-6"
              }`}
            >
              {children}
            </main>

            {/* Right Sidebar */}
            {!isFullWidthPage && (
              <aside className="hidden lg:block lg:col-span-4">
                <Rightsideber />
              </aside>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}