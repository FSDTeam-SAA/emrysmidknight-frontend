"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF1F2]">
      <div className="w-full max-w-2xl px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <Link href="/" className="">
            <div className="flex justify-center mb-7">
              <Image
                src="/logo.png"
                alt="Logo"
                width={246}
                height={165}
                className="w-[246px] h-[165px]"
              />
            </div>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-[40px] leading-[120%] font-semibold text-gray-800 text-center mb-[6px]">
          Change Password
        </h1>
        <p className="text-[#7D7D7D] text-base text-center mb-7">
          Enter your email to recover your password.
        </p>

        {/* New Password */}
        <div className="mb-[14px]">
          <label className="block text-sm text-[#2C2C2C] font- medium mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-[50px] px-4 text-base bg-transparent text-[#2C2C2C] border border-[#7D7D7D] rounded-[4px] outline-none placeholder:text-[#ADADAD] focus:border-[#F66F7D] focus:ring-1 focus:ring-[#F66F7D] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#ADADAD] flex items-center"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm text-[#2C2C2C] font- medium mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[50px] px-4 text-base bg-transparent text-[#2C2C2C] border border-[#7D7D7D] rounded-[4px] outline-none placeholder:text-[#ADADAD] focus:border-[#F66F7D] focus:ring-1 focus:ring-[#F66F7D] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#ADADAD] flex items-center"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button className="w-full h-[46px] bg-[#F66F7D] text-white text-[15px] font-semibold rounded-[6px] cursor-pointer">
          Change Password
        </button>

        {/* Back */}
        <p className="text-center text-black text-[13px] mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-[#F66F7D] font-semibold">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
