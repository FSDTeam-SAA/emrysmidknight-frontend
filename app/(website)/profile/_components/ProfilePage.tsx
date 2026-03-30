"use client";

import React, { useState } from "react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Page Header */}
      <div className="">
        <div className="flex items-center justify-between">
          <h1 className="text-[#121212] dark:text-[#FFFF] lg:text-[40px] md:text-[30px] font-bold mb-10 mt-3">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {/* Cover Image */}
          <div className="relative h-44 w-full bg-gray-800 overflow-hidden">
            {/* Dark atmospheric arch background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80')`,
                filter: "brightness(0.75)",
              }}
            />
            {/* Fallback gradient if image fails */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 opacity-60" />

            {/* Top-right icons */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button className="text-white/80 hover:text-white p-1 transition-colors">
                <Pencil size={18} />
              </button>
              <button className="text-white/80 hover:text-white p-1 transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Avatar + Name Row */}
          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-10 mb-3">
              {/* Avatar with edit button */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Esther Howard"
                  />
                  <AvatarFallback className="bg-rose-100 text-rose-600 text-xl font-semibold">
                    EH
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-rose-400 hover:bg-rose-500 text-white rounded-full p-1 shadow transition-colors">
                  <Camera size={12} />
                </button>
              </div>

              {/* Name & following */}
              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  Esther Howard
                </h2>
                <p className="text-sm text-gray-500">Following: 35K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl shadow-sm mt-4 p-6">
          {/* Section Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Personal Information
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                Manage your personal information and profile details.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-rose-400 hover:bg-rose-500 text-white rounded-lg gap-1.5 px-4"
            >
              <Pencil size={13} />
              Edit
            </Button>
          </div>

          <Separator className="mb-5" />

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Esther Howard"
                className="rounded-lg border-gray-200 text-gray-700 placeholder:text-gray-400 focus-visible:ring-rose-300"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="@estherhoward"
                className="rounded-lg border-gray-200 text-gray-700 placeholder:text-gray-400 focus-visible:ring-rose-300"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
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
                className="rounded-lg border-gray-200 text-gray-700 placeholder:text-gray-400 focus-visible:ring-rose-300"
              />
            </div>

            {/* Pronounce */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="pronounce"
                className="text-sm font-medium text-gray-700"
              >
                Pronounce
              </Label>
              <Input
                id="pronounce"
                name="pronounce"
                value={formData.pronounce}
                onChange={handleChange}
                placeholder="He"
                className="rounded-lg border-gray-200 text-gray-700 placeholder:text-gray-400 focus-visible:ring-rose-300"
              />
            </div>

            {/* Bio - full width */}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-gray-700"
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
                className="rounded-lg border-gray-200 text-gray-700 placeholder:text-gray-400 resize-none focus-visible:ring-rose-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}