"use client";

import { Monitor } from "lucide-react";
import { PasswordInput, Toggle } from "./Controls";

type Device = {
  id: number;
  browser: string;
  os: string;
  location: string;
  lastActive: string;
};

type SecuritySettingsProps = {
  devices: Device[];
  onLogoutDevice: (id: number) => void;
  onLogoutAll: () => void;
  loginAlerts: boolean;
  onToggleLoginAlerts: () => void;
};

export default function SecuritySettings({
  devices,
  onLogoutDevice,
  onLogoutAll,
  loginAlerts,
  onToggleLoginAlerts,
}: SecuritySettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* ─── Change Password ─── */}
      <div className="rounded-xl bg-white p-4 dark:bg-white/5 sm:p-6">
        <h2 className="mb-5 text-2xl font-medium text-[#121212] dark:text-white lg:text-[32px]">
          Change Password
        </h2>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <PasswordInput label="Current Password" />
          <PasswordInput label="New Password" />
        </div>

        <div className="mb-6 w-full md:w-1/2">
          <PasswordInput label="Confirm New Password" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button className="h-[48px] rounded-md border border-[#F66F7D] bg-transparent px-5 text-sm font-medium text-[#F66F7D] transition-colors hover:bg-[#F66F7D] hover:text-white sm:text-base">
            Discard Changes
          </button>

          <button className="h-[48px] rounded-md bg-[#F66F7D] px-5 text-sm font-medium text-white transition hover:opacity-90 sm:text-base">
            Save Changes
          </button>
        </div>
      </div>

      {/* ─── Login Devices ─── */}
      <div className="rounded-xl bg-white p-4 dark:bg-white/5 sm:p-6">
        <h2 className="mb-5 text-2xl font-medium text-[#121212] dark:text-white lg:text-[32px]">
          Login Devices
        </h2>

        <div className="flex flex-col">
          {devices.map((device, index) => (
            <div
              key={device.id}
              className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
                index < devices.length - 1
                  ? "border-b border-gray-200 dark:border-white/10"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Monitor
                  size={20}
                  className="mt-1 shrink-0 text-gray-500 dark:text-gray-300"
                />

                <div className="min-w-0">
                  <p className="break-words text-[15px] text-[#2C2C2C] dark:text-white sm:text-[16px]">
                    {device.browser} – {device.os} – {device.location}
                  </p>
                  <p className="text-[13px] text-[#5E5E5E] dark:text-gray-400 sm:text-[14px]">
                    Last Active: {device.lastActive}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onLogoutDevice(device.id)}
                className="w-full rounded-md border border-[#F66F7D] bg-transparent px-4 py-2 text-[14px] font-medium text-[#F66F7D] transition-colors hover:bg-[#F66F7D] hover:text-white sm:w-auto"
              >
                Log Out
              </button>
            </div>
          ))}

          {devices.length === 0 && (
            <p className="py-4 text-center text-[14px] text-[#5E5E5E] dark:text-gray-400">
              No active devices.
            </p>
          )}
        </div>

        <div className="mt-5">
          <button
            onClick={onLogoutAll}
            className="w-full rounded-md bg-[#F66F7D] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto sm:py-2 sm:text-base"
          >
            Log Out All Devices
          </button>
        </div>
      </div>

      {/* ─── Login Alerts ─── */}
      <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-4 dark:bg-white/5 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="text-lg font-medium text-[#2C2C2C] dark:text-white lg:text-xl">
            Login Alerts
          </p>
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
            Get notified when a new device logs into your account.
          </p>
        </div>

        <div className="shrink-0">
          <Toggle checked={loginAlerts} onChange={onToggleLoginAlerts} />
        </div>
      </div>
    </div>
  );
}