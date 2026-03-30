"use client";

import React, { useRef, useState } from "react";
import { Pencil, MoreVertical, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "Esther Howard",
    username: "@estherhoward",
    email: "jackson.graham@example.com",
    pronounce: "He",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et ante sed sem feugiat tristique at sed mauris. Phasellus urna magna, cursus at mi eu, dapibus porta nisi.",
  });

  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
  );
  const [avatarImage, setAvatarImage] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg",
  );

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen font-sans">
      <div>
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
              {/* Hidden cover input */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                className="text-white/80 hover:text-white p-1 transition-colors"
                aria-label="Edit cover image"
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
                {/* Hidden avatar input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Avatar className="h-[200px] w-[200px] dark:border-[#1E1E1E] shadow-md">
                  <AvatarImage src={avatarImage} alt="Esther Howard" />
                  <AvatarFallback className="bg-rose-100 text-rose-600 text-xl font-semibold">
                    EH
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-4 right-3 bg-[#F66F7D] hover:bg-[#e85d6b] text-white rounded-full p-1.5 shadow transition-colors"
                  aria-label="Edit avatar"
                >
                  <Camera size={24} />
                </button>
              </div>

              {/* Name & following */}
              <div className="mb-1">
                <h2 className="lg:text-[32px] md:text-[24px] font-semibold text-gray-900 dark:text-white leading-[120%]">
                  {formData.name}
                </h2>
                <p className="lg:text-[20px] md:text-[16px] text-gray-500 dark:text-gray-400">
                  Following: 35K
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm mt-4 p-6">
          {/* Section Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="lg:text-[32px] md:text-[24px] font-semibold text-gray-900 dark:text-white leading-[120%]">
                Personal Information
              </h3>
              <p className="lg:text-[16px] md:text-[14px] text-gray-400 mt-0.5">
                Manage your personal information and profile details.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-[#F66F7D] hover:bg-[#e85d6b] text-white rounded-lg gap-1.5 px-7 h-[48px] shadow transition-colors text-base"
            >
              <Pencil size={24} />
              Edit
            </Button>
          </div>

          <Separator className="mb-5 dark:bg-[#2C2C2C]" />

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Esther Howard"
                className="rounded-lg border-gray-200 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus-visible:ring-[#F66F7D] h-[48px] text-base"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="@estherhoward"
                className="rounded-lg border-gray-200 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus-visible:ring-[#F66F7D] h-[48px] text-base"
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
                placeholder="jackson.graham@example.com"
                className="rounded-lg border-gray-200 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus-visible:ring-[#F66F7D] h-[48px] text-base"
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
                placeholder="He"
                className="rounded-lg border-gray-200 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus-visible:ring-[#F66F7D] h-[48px] text-base"
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
                className="rounded-lg border-gray-200 dark:border-[#2C2C2C] dark:bg-[#2C2C2C] text-gray-700 dark:text-gray-200 placeholder:text-gray-400 resize-none focus-visible:ring-[#F66F7D] h-[48px] text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
