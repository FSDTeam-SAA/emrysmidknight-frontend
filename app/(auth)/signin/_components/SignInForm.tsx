"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF1F2]">
      <div className="w-full max-w-2xl px-8 py-10">
        {/* Logo */}
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

        {/* Title */}
        <h1 className="text-[40px] leading-[120%] font-semibold text-gray-800 text-center mb-[6px]">
          Welcome
        </h1>
        <p className="text-[#7D7D7D] text-base text-center mb-7">
          Sign in to your account, settings, and updates.
        </p>

        {/* Email */}
        <div className="mb-[14px]">
          <label className="block text-sm text-[#2C2C2C] font- medium mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[50px] px-4 text-base bg-transparent text-[#2C2C2C] border border-[#7D7D7D] rounded-[4px] outline-none placeholder:text-[#ADADAD] focus:border-[#F66F7D] focus:ring-1 focus:ring-[#F66F7D] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="mb-[10px]">
          <div className="flex justify-between items-center mb-[5px]">
            <label className="text-sm text-[#2C2C2C] font-medium">
              Password
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] px-4 text-base bg-transparent text-[#2C2C2C] border border-[#7D7D7D] rounded-[4px] outline-none placeholder:text-[#ADADAD] focus:border-[#F66F7D] focus:ring-1 focus:ring-[#F66F7D] transition-colors"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#ADADAD] flex items-center"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center my-5">
          <label className="flex items-center gap-[6px] text-[16px] text-[#555] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-[20px] h-[20px] appearance-none border border-[#7D7D7D] rounded bg-transparent checked:bg-[#F66F7D] checked:border-[#F66F7D] flex items-center justify-center"
            />
            Remember me
          </label>

          <a
            href="/forgot-password"
            className="text-base text-[#F66F7D] font-medium"
          >
            Forgot password?
          </a>
        </div>

        {/* Button */}
        <button className="w-full h-[46px] bg-[#F66F7D] text-white text-[15px] font-semibold rounded-[6px] cursor-pointer">
          Log In
        </button>

        {/* Signup */}
        <p className="text-center text-black text-[13px] mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#F66F7D] font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
