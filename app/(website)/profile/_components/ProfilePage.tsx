"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, MoreVertical, Pencil, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

type UserProfile = {
  followingAuthors?: string[];
  followersReaders?: string[];
  _id?: string;
  fullName?: string;
  userName?: string;
  email?: string;
  role?: string;
  pronounce?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  verifiedForget?: boolean;
  stripeAccountId?: string;
  loginAlerts?: boolean;
  otpExpiry?: string;
  gender?: string;
  otp?: string;
  phoneNumber?: string;
  profilePicture?: string;
  profileImage?: string;
  coverPicture?: string;
  coverImage?: string;
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  schoolAddress?: string;
  relationship?: string;
  avatar?: string;
};

type ProfileForm = {
  fullName: string;
  userName: string;
  email: string;
  pronounce: string;
  bio: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
};

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80";
const DEFAULT_AVATAR = "https://randomuser.me/api/portraits/men/32.jpg";

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const emptyProfileForm: ProfileForm = {
  fullName: "",
  userName: "",
  email: "",
  pronounce: "",
  bio: "",
  gender: "",
  phoneNumber: "",
  dateOfBirth: "",
};

const mapProfileToForm = (profile?: UserProfile): ProfileForm => ({
  fullName: profile?.fullName ?? "",
  userName: profile?.userName ?? "",
  email: profile?.email ?? "",
  pronounce: profile?.pronounce ?? "",
  bio: profile?.bio ?? "",
  gender: profile?.gender ?? "",
  phoneNumber: profile?.phoneNumber ?? "",
  dateOfBirth: toDateInputValue(profile?.dateOfBirth),
});

const resolveAvatarImage = (profile?: UserProfile) =>
  profile?.profilePicture ||
  profile?.profileImage ||
  profile?.avatar ||
  DEFAULT_AVATAR;

const resolveCoverImage = (profile?: UserProfile) =>
  profile?.coverPicture || profile?.coverImage || DEFAULT_COVER;

const getInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(" ").filter(Boolean);
  const letters = parts.map((part) => part[0]?.toUpperCase() ?? "");
  return letters.slice(0, 2).join("") || "U";
};

function ProfileSkeleton() {
  return (
    <div className="min-h-screen font-sans">
      <div>
        <h1 className="text-[#121212] dark:text-white text-[28px] lg:text-[36px] font-bold mb-6 mt-3">
          My Profile
        </h1>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-sm">
          <div className="relative h-[280px] w-full bg-gray-800 overflow-hidden">
            <Skeleton className="h-full w-full rounded-none" />
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
          </div>

          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-24 mb-3">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm mt-4 p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-[48px] w-28 rounded-lg" />
          </div>

          <Separator className="mb-5 dark:bg-[#2C2C2C]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-[48px] w-full rounded-lg" />
              </div>
            ))}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[96px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const isSessionLoading = status === "loading";
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch profile");
      }
      return (result?.data ?? result) as UserProfile;
    },
    enabled: !!token,
  });

  const [formData, setFormData] = useState<ProfileForm>(emptyProfileForm);
  const [initialData, setInitialData] = useState<ProfileForm>(emptyProfileForm);
  const [isEditing, setIsEditing] = useState(false);
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER);
  const [avatarImage, setAvatarImage] = useState(DEFAULT_AVATAR);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) return;
    const mapped = mapProfileToForm(profile);
    setFormData(mapped);
    setInitialData(mapped);
  }, [profile, isEditing]);

  useEffect(() => {
    if (isEditing) return;
    if (!coverFile) {
      setCoverImage(resolveCoverImage(profile));
    }
    if (!avatarFile) {
      setAvatarImage(resolveAvatarImage(profile));
    }
  }, [profile, coverFile, avatarFile, isEditing]);

  useEffect(() => {
    return () => {
      if (coverImage.startsWith("blob:")) {
        URL.revokeObjectURL(coverImage);
      }
      if (avatarImage.startsWith("blob:")) {
        URL.revokeObjectURL(avatarImage);
      }
    };
  }, [coverImage, avatarImage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const nextUrl = URL.createObjectURL(file);
    setCoverImage((prev) => {
      if (prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return nextUrl;
    });
    if (!isEditing) {
      if (!token) {
        toast.error("Missing auth token");
        return;
      }
      if (!updateMutation.isPending) {
        const payload = new FormData();
        payload.append("coverPicture", file);
        updateMutation.mutate(payload);
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const nextUrl = URL.createObjectURL(file);
    setAvatarImage((prev) => {
      if (prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return nextUrl;
    });
    if (!isEditing) {
      if (!token) {
        toast.error("Missing auth token");
        return;
      }
      if (!updateMutation.isPending) {
        const payload = new FormData();
        payload.append("profilePicture", file);
        updateMutation.mutate(payload);
      }
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || "Failed to update profile");
      }
      return result;
    },
    onSuccess: (result) => {
      const apiProfile = (result?.data ?? result) as UserProfile | undefined;
      const nextProfile: Partial<UserProfile> = {
        ...(apiProfile ?? {}),
        fullName: formData.fullName,
        userName: formData.userName,
        pronounce: formData.pronounce,
        bio: formData.bio,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
      };

      if (formData.dateOfBirth.trim()) {
        nextProfile.dateOfBirth = `${formData.dateOfBirth}T00:00:00.000Z`;
      }

      if (coverFile) {
        nextProfile.coverPicture = coverImage;
      }

      if (avatarFile) {
        nextProfile.profilePicture = avatarImage;
      }

      queryClient.setQueryData<UserProfile>(["user-profile"], (prev) => ({
        ...(prev ?? {}),
        ...nextProfile,
      }));
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      toast.success(result?.message || "Profile updated successfully");
      setIsEditing(false);
      setInitialData({ ...formData });
      setCoverFile(null);
      setAvatarFile(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  const buildUpdatePayload = () => {
    const payload = new FormData();
    let hasChanges = false;

    const appendIfChanged = (
      key: keyof ProfileForm,
      value: string | boolean,
      initialValue: string | boolean
    ) => {
      if (value !== initialValue) {
        payload.append(
          key,
          typeof value === "boolean" ? String(value) : value ?? ""
        );
        hasChanges = true;
      }
    };

    appendIfChanged("fullName", formData.fullName, initialData.fullName);
    appendIfChanged("userName", formData.userName, initialData.userName);
    appendIfChanged("pronounce", formData.pronounce, initialData.pronounce);
    appendIfChanged("bio", formData.bio, initialData.bio);
    appendIfChanged("gender", formData.gender, initialData.gender);
    appendIfChanged("phoneNumber", formData.phoneNumber, initialData.phoneNumber);
    const nextDob = formData.dateOfBirth.trim();
    const prevDob = initialData.dateOfBirth.trim();
    if (nextDob !== prevDob) {
      if (nextDob) {
        payload.append("dateOfBirth", `${nextDob}T00:00:00.000Z`);
        hasChanges = true;
      }
    }

    if (avatarFile) {
      payload.append("profilePicture", avatarFile);
      hasChanges = true;
    }

    if (coverFile) {
      payload.append("coverPicture", coverFile);
      hasChanges = true;
    }

    return { payload, hasChanges };
  };

  const handleSave = () => {
    if (!token) {
      toast.error("Missing auth token");
      return;
    }
    const { payload, hasChanges } = buildUpdatePayload();
    if (!hasChanges) {
      toast.success("Profile is already up to date");
      setIsEditing(false);
      return;
    }
    updateMutation.mutate(payload);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialData);
    setCoverFile(null);
    setAvatarFile(null);
    setCoverImage(resolveCoverImage(profile));
    setAvatarImage(resolveAvatarImage(profile));
    if (coverInputRef.current) coverInputRef.current.value = "";
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const displayName = useMemo(() => {
    const trimmedName = formData.fullName.trim();
    if (trimmedName) return trimmedName;
    const trimmedUserName = formData.userName.trim();
    if (trimmedUserName) return trimmedUserName;
    return "User";
  }, [formData.fullName, formData.userName]);

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const followingCount = profile?.followingAuthors?.length ?? 0;
  const isBusy = isSessionLoading || isLoading;
  const isSaving = updateMutation.isPending;
  const isReadOnly = !isEditing || isSaving;
  const isMediaDisabled = isSaving;

  const handleCoverClick = () => {
    if (isMediaDisabled) return;
    coverInputRef.current?.click();
  };

  const handleAvatarClick = () => {
    if (isMediaDisabled) return;
    avatarInputRef.current?.click();
  };

  const inputClassName =
    "rounded-lg border-gray-200 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus-visible:ring-[#F66F7D] h-[48px] text-base";
  const textareaClassName =
    "rounded-lg border-gray-200 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 resize-none focus-visible:ring-[#F66F7D] text-base";

  if (isBusy) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen font-sans">
      <div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
          disabled={isMediaDisabled}
        />
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={isMediaDisabled}
        />

        {/* Page Header */}
        <h1 className="text-[#121212] dark:text-white text-[28px] lg:text-[36px] font-bold mb-6 mt-3">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-sm">
          {/* Cover Image */}
          <div className="relative h-[280px] w-full bg-gray-800 overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url('${coverImage}')`,
                filter: "brightness(0.75)",
              }}
            />

            {/* Top-right icons */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={handleCoverClick}
                className={`text-white/80 hover:text-white p-1 transition-colors ${
                  isMediaDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label="Edit cover image"
                disabled={isMediaDisabled}
              >
                <Pencil size={18} />
              </button>
              <button className="text-white/80 hover:text-white p-1 transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Avatar + Name Row */}
          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-24 mb-3">
              {/* Avatar with edit button */}
              <div className="relative flex-shrink-0">
                {isSaving && (
                  <span className="pointer-events-none absolute -inset-[6px] rounded-full border border-[#F66F7D] border-t-transparent animate-spin" />
                )}
                <Avatar className="h-[200px] w-[200px] dark:border-[#1E1E1E] shadow-md">
                  <AvatarImage src={avatarImage} alt={displayName} />
                  <AvatarFallback className="bg-rose-100 text-rose-600 text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className={`absolute bottom-4 right-3 bg-[#F66F7D] hover:bg-[#e85d6b] text-white rounded-full p-1.5 shadow transition-colors ${
                    isMediaDisabled ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  aria-label="Edit avatar"
                  disabled={isMediaDisabled}
                >
                  <Camera size={24} />
                </button>
              </div>

              {/* Name & following */}
              <div className="mb-1">
                <h2 className="lg:text-[32px] md:text-[24px] font-semibold text-gray-900 dark:text-white leading-[120%]">
                  {displayName}
                </h2>
                <p className="lg:text-[20px] md:text-[16px] text-gray-500 dark:text-gray-400">
                  Following: {followingCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm mt-4 p-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="lg:text-[32px] md:text-[24px] font-semibold text-gray-900 dark:text-white leading-[120%]">
                Personal Information
              </h3>
              <p className="lg:text-[16px] md:text-[14px] text-gray-400 mt-0.5">
                Manage your personal information and profile details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    className="bg-[#F66F7D] hover:bg-[#e85d6b] text-white rounded-lg gap-1.5 px-6 h-[48px] shadow transition-colors text-base"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Check size={20} />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg gap-1.5 px-5 h-[48px] text-base"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X size={18} />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-[#F66F7D] hover:bg-[#e85d6b] text-white rounded-lg gap-1.5 px-7 h-[48px] shadow transition-colors text-base"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={24} />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-5 dark:bg-[#2C2C2C]" />

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                className={inputClassName}
                disabled={isReadOnly}
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="userName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="username"
                className={inputClassName}
                disabled={isReadOnly}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClassName}
                disabled
              />
            </div>

            {/* Pronounce */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="pronounce"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Pronounce
              </Label>
              <Input
                id="pronounce"
                name="pronounce"
                value={formData.pronounce}
                onChange={handleChange}
                placeholder="Pronounce"
                className={inputClassName}
                disabled={isReadOnly}
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="gender"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Gender
              </Label>
              <Input
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="male"
                className={inputClassName}
                disabled={isReadOnly}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                className={inputClassName}
                disabled={isReadOnly}
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                className={inputClassName}
                disabled={isReadOnly}
              />
            </div>

            {/* Bio */}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Write something about yourself..."
                className={textareaClassName}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-[#5E5E5E] dark:text-gray-300">
            Failed to load profile details. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
