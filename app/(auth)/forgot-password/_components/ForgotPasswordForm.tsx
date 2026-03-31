"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

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
          Forgot Password
        </h1>
        <p className="text-[#7D7D7D] text-base text-center mb-7">
          Enter your email to recover your password.
        </p>

        {/* Email */}
        <div className="mb-5">
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

        {/* Button */}
        <button className="w-full h-[46px] bg-[#F66F7D] text-white text-[15px] font-semibold rounded-[6px] cursor-pointer">
          Send OTP
        </button>

        {/* Back to Login */}
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
