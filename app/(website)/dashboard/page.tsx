"use client";
import { useState } from "react";
import DashboardPage from "./_components/DashboardPage";
import SubscriptionTable from "./_components/SubscriptionTable";
import { TransactionsTable } from "./_components/TransactionsTable";
import { PlansTable } from "./_components/PlansTable";

const tabs = ["Overview", "Subscribers", "Primium Unlocks","Subscriptions Plan"];

/* ─── Main Page ────────────────── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <div className="min-h-screen text-[color:var(--page-text)] font-sans px-6 lg:px-0 py-10">
      <div className="container mx-auto">

        {/* Title */}
        <h1 className="text-3xl lg:text-[40px] font-semibold text-[color:var(--page-text)] mb-7">Dashboard</h1>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border)] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-base font-medium whitespace-nowrap border-b-2 bg-transparent cursor-pointer transition-colors duration-200 -mb-px ${
                activeTab === tab
                  ? "text-[color:var(--text-primary)]  border-[#F66F7D]"
                  : "text-[color:var(--text-secondary)] border-transparent hover:text-[color:var(--text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
           <DashboardPage />
        )}

        {/* ── SUBSCRIBERS ── */}
        {activeTab === "Subscribers" && (
       <SubscriptionTable/>
        )}

        {/* ── SECURITY SETTINGS ── */}
        {activeTab === "Primium Unlocks" && (
       <TransactionsTable/>
        )}

        {/* ── SECURITY SETTINGS ── */}
        {activeTab === "Subscriptions Plan" && (
       <PlansTable/>
        )}
        

      </div>
    </div>
  );
}
