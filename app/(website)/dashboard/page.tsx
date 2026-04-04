"use client";
import { useEffect, useMemo, useState } from "react";
import DashboardPage from "./_components/DashboardPage";
import SubscriptionTable from "./_components/SubscriptionTable";
import { TransactionsTable } from "./_components/TransactionsTable";
import { PlansTable } from "./_components/PlansTable";
import MyBlogs from "./_components/MyBloge";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = ["Overview", "Subscribers", "Primium Unlocks", "Subscriptions Plan","My blogs"] ;

export default function Page() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = useMemo(() => searchParams.get("tab"), [searchParams]);

  useEffect(() => {
    if (!tabParam) return;
    const normalizedTab = tabs.find((tab) => tab === tabParam);
    if (normalizedTab) {
      setActiveTab(normalizedTab);
    }
  }, [tabParam]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === tabs[0]) {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const queryString = params.toString();
    router.replace(`/dashboard${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="min-h-screen font-sans text-[color:var(--page-text)] px-0 py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto">

        {/* Title */}
        <h1 className="mb-5 text-2xl font-semibold text-[color:var(--page-text)] sm:text-3xl lg:mb-7 lg:text-[40px]">
          Dashboard
        </h1>

        {/* Tabs (Scrollable on mobile) */}
        <div className="relative mb-6 border-b border-[color:var(--border)]">
          
          {/* Scroll wrapper */}
          <div className="no-scrollbar -mx-2 overflow-x-auto px-2">
            <div className="flex min-w-max gap-1 sm:gap-2">

              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`whitespace-nowrap border-b-2 bg-transparent px-4 py-3 text-xs font-medium transition-colors duration-200 sm:px-5 sm:text-base ${
                    activeTab === tab
                      ? "border-[#F66F7D] text-[color:var(--text-primary)]"
                      : "border-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {tab}
                </button>
              ))}

            </div>
          </div>

          {/* Scroll indicator (RIGHT SIDE SHADOW) */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent" />
        </div>

        {/* CONTENT */}
        <div className="w-full overflow-hidden">
          {activeTab === "Overview" && <DashboardPage />}
          {activeTab === "Subscribers" && <SubscriptionTable />}
          {activeTab === "Primium Unlocks" && <TransactionsTable />}
          {activeTab === "Subscriptions Plan" && <PlansTable />}
          {activeTab === "My blogs" && <MyBlogs />}
        </div>
      </div>
    </div>
  );
}
