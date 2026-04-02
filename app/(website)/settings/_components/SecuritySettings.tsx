
"use client";

import { Monitor } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner"; // Make sure you have sonner installed and Toaster in root
import { PasswordInput, Toggle } from "./Controls";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeviceApi = {
  _id: string;
  deviceInfo?: string;
  ipAddress?: string;
  lastActive?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type DeviceRow = {
  id: string;
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  isActive: boolean;
};

type SecuritySettingsProps = {
  loginAlerts: boolean;
  onToggleLoginAlerts: () => void;
};

const splitDeviceInfo = (value?: string) => {
  if (!value) return [];
  const byDash = value
    .split("–")
    .map((part) => part.trim())
    .filter(Boolean);
  if (byDash.length > 1) return byDash;
  const byHyphen = value
    .split(" - ")
    .map((part) => part.trim())
    .filter(Boolean);
  return byHyphen.length ? byHyphen : byDash;
};

const formatLastActive = (value?: string) => {
  if (!value) return "Unknown";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const buildDeviceRow = (device: DeviceApi): DeviceRow => {
  const parts = splitDeviceInfo(device.deviceInfo);
  const browser = parts[0] ?? "Unknown Browser";
  const os = parts[1] ?? "Unknown OS";
  const location = parts[2] ?? device.ipAddress ?? "Unknown Location";
  return {
    id: device._id,
    browser,
    os,
    location,
    lastActive: formatLastActive(device.lastActive),
    isActive: Boolean(device.isActive),
  };
};

function LoginDevicesSkeleton() {
  return (
    <div className="flex flex-col">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between animate-pulse ${
            i < 3 ? "border-b border-gray-200 dark:border-white/10" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="min-w-0 space-y-2">
              <div className="h-4 w-52 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-36 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          <div className="h-9 w-full rounded bg-gray-200 dark:bg-gray-700 sm:w-24" />
        </div>
      ))}
    </div>
  );
}

export default function SecuritySettings({
  loginAlerts,
  onToggleLoginAlerts,
}: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const isSessionLoading = status === "loading";
  const queryClient = useQueryClient();

  const { data: devicesData, isLoading: isDevicesLoading, error } = useQuery({
    queryKey: ["login-devices"],
    queryFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/devices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch login devices");
      }
      return Array.isArray(result?.data) ? (result.data as DeviceApi[]) : [];
    },
    enabled: !!token,
  });

  const devices = useMemo(
    () => (Array.isArray(devicesData) ? devicesData.map(buildDeviceRow) : []),
    [devicesData]
  );
  const [hiddenDeviceIds, setHiddenDeviceIds] = useState<string[]>([]);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutTarget, setLogoutTarget] = useState<DeviceRow | null>(null);

  const visibleDevices = useMemo(
    () => devices.filter((device) => !hiddenDeviceIds.includes(device.id)),
    [devices, hiddenDeviceIds]
  );

  const handleLogoutOpenChange = (open: boolean) => {
    setIsLogoutOpen(open);
    if (!open) setLogoutTarget(null);
  };

  const handleLogoutDevice = (device: DeviceRow) => {
    setLogoutTarget(device);
    setIsLogoutOpen(true);
  };

  const logoutMutation = useMutation<unknown, Error, string>({
    mutationFn: async (sessionId: string) => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/devices/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to log out device");
      }
      return result;
    },
    onSuccess: (_data, sessionId) => {
      setHiddenDeviceIds((prev) =>
        prev.includes(sessionId) ? prev : [...prev, sessionId]
      );
      toast.success("Device logged out");
      setIsLogoutOpen(false);
      setLogoutTarget(null);
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to log out device";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["login-devices"] });
    },
  });

  const logoutAllMutation = useMutation<unknown, Error, void>({
    mutationFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/devices/all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to log out all devices");
      }
      return result;
    },
    onSuccess: () => {
      setHiddenDeviceIds(devices.map((device) => device.id));
      toast.success("Logged out from all devices");
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to log out all devices";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["login-devices"] });
    },
  });

  const handleLogoutAll = () => {
    logoutAllMutation.mutate();
  };

  const showLogoutAllButton =
    !isSessionLoading && !isDevicesLoading && visibleDevices.length > 0;


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password changed successfully!");
        
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
  } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Change Password ─── */}
      <div className="rounded-xl bg-white p-4 dark:bg-white/5 sm:p-6">
        <h2 className="mb-5 text-2xl font-medium text-[#121212] dark:text-white lg:text-[32px]">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword}>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6 w-full md:w-1/2">
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="h-[48px] rounded-md border border-[#F66F7D] bg-transparent px-5 text-sm font-medium text-[#F66F7D] transition-colors hover:bg-[#F66F7D] hover:text-white sm:text-base"
              disabled={isChangingPassword}
            >
              Discard Changes
            </button>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="h-[48px] rounded-md bg-[#F66F7D] px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70 sm:text-base flex items-center justify-center"
            >
              {isChangingPassword ? "Changing Password..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Login Devices Section (unchanged) */}
      <div className="rounded-xl bg-white p-4 dark:bg-white/5 sm:p-6">
        <h2 className="mb-5 text-2xl font-medium text-[#121212] dark:text-white lg:text-[32px]">
          Login Devices
        </h2>

        <div className="flex flex-col">
          {isSessionLoading || isDevicesLoading ? (
            <LoginDevicesSkeleton />
          ) : (
            <>
              {visibleDevices.map((device, index) => (
                <div
                  key={device.id}
                  className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
                    index < visibleDevices.length - 1
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
                    onClick={() => handleLogoutDevice(device)}
                    disabled={logoutMutation.isPending && logoutTarget?.id === device.id}
                    className="w-full rounded-md border border-[#F66F7D] bg-transparent px-4 py-2 text-[14px] font-medium text-[#F66F7D] transition-colors hover:bg-[#F66F7D] hover:text-white disabled:opacity-70 sm:w-auto"
                  >
                    {logoutMutation.isPending && logoutTarget?.id === device.id
                      ? "Logging Out..."
                      : "Log Out"}
                  </button>
                </div>
              ))}

              {visibleDevices.length === 0 && !error && (
                <p className="py-4 text-center text-[14px] text-[#5E5E5E] dark:text-gray-400">
                  No active devices.
                </p>
              )}
            </>
          )}

          {error && (
            <p className="py-4 text-center text-[14px] text-[#5E5E5E] dark:text-gray-400">
              Failed to load devices. Please try again.
            </p>
          )}
        </div>

        {showLogoutAllButton && (
          <div className="mt-5">
            <button
              onClick={handleLogoutAll}
              disabled={logoutAllMutation.isPending}
              className="w-full rounded-md bg-[#F66F7D] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70 sm:w-auto sm:py-2 sm:text-base"
            >
              {logoutAllMutation.isPending
                ? "Logging Out..."
                : "Log Out All Devices"}
            </button>
          </div>
        )}
      </div>

      {/* Login Alerts Section (unchanged) */}
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

      <Dialog open={isLogoutOpen} onOpenChange={handleLogoutOpenChange}>
        <DialogContent className="sm:max-w-md bg-[#FFFFFF] dark:bg-[#2C2C2C]">
          <DialogHeader>
            <DialogTitle>Log Out Device</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Are you sure you want to log out this device?
            {logoutTarget ? (
              <div className="mt-2 text-xs text-[#5E5E5E] dark:text-gray-300">
                {logoutTarget.browser} – {logoutTarget.os} – {logoutTarget.location}
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleLogoutOpenChange(false)}
              disabled={logoutMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#F66F7D] text-white"
              onClick={() => {
                if (logoutTarget?.id) {
                  logoutMutation.mutate(logoutTarget.id);
                }
              }}
              disabled={logoutMutation.isPending || !logoutTarget?.id}
            >
              {logoutMutation.isPending ? "Logging Out..." : "Log Out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
