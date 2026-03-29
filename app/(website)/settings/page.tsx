"use client";

import { useState } from "react";

import AccountSettings from "./_components/AccountSettings";
import NotificationSettings from "./_components/NotificationSettings";
import Preferences from "./_components/Preferences";
import SecuritySettings from "./_components/SecuritySettings";
import { useTheme } from "@/components/providers/ThemeProvider";

const tabs = ["Account Settings", "Notification Settings", "Security Settings", "Preferences"];

/* ─── Main Page ───────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(tabs[0]);

  /* Account */
  const [publicProfile, setPublicProfile] = useState(true);
  const [matureContent, setMatureContent] = useState(false);

  /* Notifications */
  const [notifications, setNotifications] = useState({
    newChapterUpdates: true,
    authorPosts: true,
    premiumContentAlerts: true,
    recommendedStories: true,
    authorYouFollowUpdates: true,
    paymentSuccessfulConfirmation: true,
    paymentFailedAlert: true,
    emailNotifications: false,
  });
  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  /* Security */
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [devices, setDevices] = useState([
    { id: 1, browser: "Chrome", os: "Windows", location: "Mar del Plata", lastActive: "2 hours ago" },
    { id: 2, browser: "Chrome", os: "Windows", location: "Mannheim", lastActive: "2 hours ago" },
  ]);
  const logoutDevice = (id: number) => setDevices((prev) => prev.filter((d) => d.id !== id));

  /* Static data */
  const accountRows = [
    { label: "Email Address", value: "jackson.graham@example.com" },
    { label: "Username", value: "@estherhoward" },
    { label: "Phone Number", value: "(201) 555-0124" },
    { label: "Blocked Author", value: "" },
  ];

  const notificationRows = [
    { key: "newChapterUpdates", label: "New Chapter Updates" },
    { key: "authorPosts", label: "Author Posts" },
    { key: "premiumContentAlerts", label: "Premium Content Alerts" },
    { key: "recommendedStories", label: "Recommended Stories" },
    { key: "authorYouFollowUpdates", label: "Author You Follow Updates" },
    { key: "paymentSuccessfulConfirmation", label: "Payment Successful Confirmation" },
    { key: "paymentFailedAlert", label: "Payment Failed Alert" },
    { key: "emailNotifications", label: "Email Notifications" },
  ] as const;

  return (
    <div className="min-h-screen text-[color:var(--page-text)] font-sans px-6 py-10">
      <div className="container mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold text-[color:var(--page-text)] mb-7">Settings</h1>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border)] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 bg-transparent cursor-pointer transition-colors duration-200 -mb-px ${
                activeTab === tab
                  ? "text-[color:var(--text-primary)]  border-[color:var(--text-primary)]"
                  : "text-[color:var(--text-secondary)] border-transparent hover:text-[color:var(--text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── ACCOUNT SETTINGS ── */}
        {activeTab === "Account Settings" && (
          <AccountSettings
            accountRows={accountRows}
            publicProfile={publicProfile}
            onTogglePublicProfile={() => setPublicProfile((prev) => !prev)}
            matureContent={matureContent}
            onToggleMatureContent={() => setMatureContent((prev) => !prev)}
          />
        )}

        {/* ── NOTIFICATION SETTINGS ── */}
        {activeTab === "Notification Settings" && (
          <NotificationSettings
            notificationRows={notificationRows}
            notifications={notifications}
            onToggle={toggleNotification}
          />
        )}

        {/* ── SECURITY SETTINGS ── */}
        {activeTab === "Security Settings" && (
          <SecuritySettings
            devices={devices}
            onLogoutDevice={logoutDevice}
            onLogoutAll={() => setDevices([])}
            loginAlerts={loginAlerts}
            onToggleLoginAlerts={() => setLoginAlerts((prev) => !prev)}
          />
        )}

        {/* ── PREFERENCES ── */}
        {activeTab === "Preferences" && (
          <Preferences theme={theme} onChangeTheme={setTheme} />
        )}

      </div>
    </div>
  );
}
