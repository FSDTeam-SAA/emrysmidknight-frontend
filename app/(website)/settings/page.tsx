"use client";

import { useState } from "react";

import AccountSettings from "./_components/AccountSettings";
import NotificationSettings from "./_components/NotificationSettings";
import Preferences from "./_components/Preferences";
import SecuritySettings from "./_components/SecuritySettings";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PaymentMethods } from "./_components/PaymentMethods";

const tabs = [
  "Account Settings",
  "Notification Settings",
  "Security Settings",
  "Payment Methods",
  "Preferences",
];

/* ─── Main Page ───────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  /* Account */
  const [publicProfile, setPublicProfile] = useState(true);
  const [matureContent, setMatureContent] = useState(false);

  const notificationRows = [
    { key: "newChapterUpdates", label: "New Chapter Updates" },
    { key: "authorPosts", label: "Author Posts" },
    { key: "premiumContentAlerts", label: "Premium Content Alerts" },
    { key: "recommendedStories", label: "Recommended Stories" },
    { key: "authorYouFollowUpdates", label: "Author You Follow Updates" },
    { key: "paymentSuccessConfirmation", label: "Payment Success Confirmation" },
    { key: "paymentFailedAlert", label: "Payment Failed Alert" },
    { key: "emailNotifications", label: "Email Notifications" },
  ] as const;

  return (
    <div className="min-h-screen font-sans text-[color:var(--page-text)] px-0 sm:px-6 py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto">
        {/* Title */}
        <h1 className="mb-5 text-2xl font-semibold text-[color:var(--page-text)] sm:text-3xl lg:mb-7 lg:text-[40px]">
          Settings
        </h1>

        {/* Tabs */}
        <div className="relative mb-6 border-b border-[color:var(--border)]">
          <div className="no-scrollbar -mx-2 overflow-x-auto px-2">
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-5 py-3 text-sm sm:text-base font-medium whitespace-nowrap border-b-2 bg-transparent cursor-pointer transition-colors duration-200 -mb-px ${
                    activeTab === tab
                      ? "text-[color:var(--text-primary)] border-[#F66F7D]"
                      : "text-[color:var(--text-secondary)] border-transparent hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Right fade indicator for mobile */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[var(--background)] to-transparent sm:hidden" />
        </div>

        {/* ── ACCOUNT SETTINGS ── */}
        {activeTab === "Account Settings" && (
          <AccountSettings
            publicProfile={publicProfile}
            onTogglePublicProfile={() => setPublicProfile((prev) => !prev)}
            matureContent={matureContent}
            onToggleMatureContent={() => setMatureContent((prev) => !prev)}
          />
        )}

        {/* ── NOTIFICATION SETTINGS ── */}
        {activeTab === "Notification Settings" && (
          <NotificationSettings notificationRows={notificationRows} />
        )}

        {/* ── SECURITY SETTINGS ── */}
        {activeTab === "Security Settings" && (
          <SecuritySettings />
        )}

        {/* ── PAYMENT METHODS ── */}
        {activeTab === "Payment Methods" && <PaymentMethods />}

        {/* ── PREFERENCES ── */}
        {activeTab === "Preferences" && (
          <Preferences theme={theme} onChangeTheme={setTheme} />
        )}
      </div>
    </div>
  );
}
