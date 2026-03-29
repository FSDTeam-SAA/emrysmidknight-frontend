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
      {/* Change Password */}
      <div className="bg-[color:var(--surface)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)] mb-5">
          Changes Password
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <PasswordInput label="Current Password" />
          <PasswordInput label="New  Password" />
        </div>
        <div className="w-1/2 mb-6">
          <PasswordInput label="Confirm New  Password" />
        </div>
        <div className="flex justify-end gap-3">
          <button className="px-5 py-2 text-sm font-medium text-[color:var(--accent)] border border-[color:var(--accent)] rounded-lg bg-transparent cursor-pointer hover:bg-[color:var(--accent-soft)] transition-colors">
            Discard Changes
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-[color:var(--accent)] rounded-lg border-0 cursor-pointer hover:bg-[color:var(--accent-strong)] transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Login Devices */}
      <div className="bg-[color:var(--surface)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)] mb-5">
          Login Devices
        </h2>
        <div className="flex flex-col">
          {devices.map((device, index) => (
            <div
              key={device.id}
              className={`flex justify-between items-center py-3.5 ${
                index < devices.length - 1 ? "border-b border-[color:var(--border)]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Monitor size={18} className="text-[color:var(--text-secondary)]" />
                <div>
                  <p className="text-sm text-[color:var(--text-primary)] mb-0.5">
                    {device.browser} – {device.os} – {device.location}
                  </p>
                  <p className="text-xs text-[color:var(--text-muted)]">
                    Last Active: {device.lastActive}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onLogoutDevice(device.id)}
                className="px-4 py-1.5 text-[13px] font-medium text-[color:var(--accent)] border border-[color:var(--accent)] rounded-lg bg-transparent cursor-pointer hover:bg-[color:var(--accent-soft)] transition-colors"
              >
                Log Out
              </button>
            </div>
          ))}
          {devices.length === 0 && (
            <p className="text-sm text-[color:var(--text-muted)] text-center py-4">
              No active devices.
            </p>
          )}
        </div>
        <div className="mt-5">
          <button
            onClick={onLogoutAll}
            className="px-5 py-2 text-sm font-medium text-white bg-[color:var(--accent)] rounded-lg border-0 cursor-pointer hover:bg-[color:var(--accent-strong)] transition-colors"
          >
            Log Out All Devices
          </button>
        </div>
      </div>

      {/* Login Alerts */}
      <div className="bg-[color:var(--surface)] rounded-xl px-6 py-[18px] flex justify-between items-center">
        <span className="text-sm text-[color:var(--text-primary)]">Login Alerts</span>
        <Toggle checked={loginAlerts} onChange={onToggleLoginAlerts} />
      </div>
    </div>
  );
}
