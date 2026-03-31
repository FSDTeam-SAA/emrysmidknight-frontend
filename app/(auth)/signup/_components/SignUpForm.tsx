"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Role = "Author" | "Reader" | null;
type Step = 1 | 2 | 3;

const inputClass =
  "w-full h-[50px] px-4 text-base bg-transparent text-[#2C2C2C] border border-[#7D7D7D] rounded-[4px] outline-none placeholder:text-[#ADADAD] focus:border-[#F66F7D] focus:ring-1 focus:ring-[#F66F7D] transition-colors";

// ✅ moved outside (IMPORTANT FIX)
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#FEF1F2]">
    <div className="w-full max-w-2xl px-8 py-10">{children}</div>
  </div>
);

const Logo = () => (
  <div className="flex flex-col items-center mb-8">
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
);

const SignInLink = () => (
  <p className="text-center text-black text-sm mt-5">
    Already have an account?{" "}
    <a href="/signin" className="text-[#F66F7D] hover:underline font-medium">
      Sign In
    </a>
  </p>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm text-[#2C2C2C] font-medium mb-1.5">
    {children}
  </label>
);

export default function SignUpForm() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");

  // STEP 1
  if (step === 1) {
    return (
      <Wrapper>
        <p className="text-[#F66F7D] text-base mb-5">I am a...</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {(["Author", "Reader"] as Role[]).map((r) => (
            <button
              key={r!}
              onClick={() => setRole(r)}
              className={`h-[50px] rounded-md text-sm font-medium border transition-all duration-200 ${
                role === r
                  ? "bg-[#FCD2D7] text-[#F66F7D] border-[#F66F7D]"
                  : "text-[#F66F7D] border-[#F66F7D]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (role) setStep(2);
          }}
          disabled={!role}
          className="w-full bg-[#F66F7D] hover:bg-[#d45570] text-white rounded-md h-[50px] text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>

        <SignInLink />
      </Wrapper>
    );
  }

  // STEP 2
  if (step === 2) {
    return (
      <Wrapper>
        <Logo />

        <h1 className="text-[40px] leading-[120%] font-semibold text-gray-800 text-center mb-1.5">
          Create Your Account
        </h1>
        <p className="text-[#7D7D7D] text-base text-center mb-10">
          A place where writers create, publish, and inspire others.
        </p>

        <div className="space-y-4">
          <div>
            <FieldLabel>Email Address</FieldLabel>
            <input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>Password</FieldLabel>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ADADAD] hover:text-[#7D7D7D]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <FieldLabel>Confirm Password</FieldLabel>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ADADAD] hover:text-[#7D7D7D]"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (email && password && confirmPassword) setStep(3);
          }}
          disabled={!email || !password || !confirmPassword}
          className="w-full mt-6 bg-[#F66F7D] hover:bg-[#d45570] text-white rounded-md h-[50px] text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>

        <SignInLink />
      </Wrapper>
    );
  }

  // STEP 3
  return (
    <Wrapper>
      <Logo />

      <h1 className="text-[40px] leading-[120%] font-semibold text-gray-800 text-center mb-1.5">
        Personal Information
      </h1>
      <p className="text-[#7D7D7D] text-base text-center mb-8">
        Personal information and profile details.
      </p>

      <div className="space-y-3">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <input
            placeholder="enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <FieldLabel>User Name</FieldLabel>
          <input
            placeholder="eg. name 123"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <FieldLabel>Pronouns</FieldLabel>
          <input
            placeholder="eg. he/him"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <FieldLabel>Bio</FieldLabel>
          <textarea
            placeholder="enter your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 text-base text-[#2C2C2C] bg-transparent border border-[#7D7D7D] rounded-[4px] outline-none placeholder:text-[#ADADAD] focus:border-[#F66F7D] focus:ring-1 focus:ring-[#F66F7D] transition-colors resize-none"
          />
        </div>
      </div>

      <button
        onClick={() => alert("Account created successfully!")}
        className="w-full mt-6 bg-[#F66F7D] hover:bg-[#d45570] text-white rounded-md h-[50px] text-base font-medium transition-colors"
      >
        Create Account
      </button>

      <SignInLink />
    </Wrapper>
  );
}
