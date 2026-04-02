"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailForm() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [warning, setWarning] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min countdown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || ""; // URL থেকে email নেওয়া
  console.log("email", email);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // OTP mutation
  const otpMutation = useMutation({
    mutationFn: async (bodyData: { email: string; otp: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "OTP verification failed");
      return data;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      toast.success(data?.message || "OTP verified successfully");
      if (data?.resetToken) localStorage.setItem("refreshToken", data.resetToken);
      router.push(`/change-password?email=${encodeURIComponent(email)}`);
    },
    onError: (err) => toast.error(err.message || "Invalid OTP, try again"),
    onSettled: () => setIsLoading(false),
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) {
      setWarning("Only numbers are allowed");
      return;
    }
    setWarning("");
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const prevOtp = [...otp];
        prevOtp[index - 1] = "";
        setOtp(prevOtp);
      }
    }
    if (key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    paste.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    otpMutation.mutate({ email, otp: otpString });
  };

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF1F2]">
      <div className="w-full max-w-2xl px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={246}
              height={165}
              className="w-[246px] h-[165px]"
            />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-[32px] font-bold text-[#1a1a1a] text-center mb-[6px]">
          Verify Email
        </h1>
        <p className="text-[#7D7D7D] text-[13px] text-center mb-8">
          Enter the OTP to verify your email address.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-[16px] mb-[4px]">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="tel"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-[88px] h-[88px] text-center text-[20px] font-bold text-[#1a1a1a] rounded-[6px] outline-none transition-all
                bg-transparent
                ${digit ? "border-[1.5px] border-[#F66F7D]" : "border border-[#d1d5db]"}
                focus:border-[#F66F7D] focus:ring-1 focus:ring-[#F66F7D]`}
            />
          ))}
        </div>

        {/* Warning */}
        {warning && (
          <p className="text-[#F66F7D] text-[13px] text-center mb-2">
            {warning}
          </p>
        )}

        {/* Resend */}
        <div className="flex justify-between items-center my-6 text-[13px]">
          <span className="text-[#7D7D7D]">{minutes}:{seconds}</span>
          <a
            href="#"
            className={`text-[#F66F7D] font-medium ${
              secondsLeft > 0 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Didn&apos;t get a code? Resend
          </a>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full h-[46px] bg-[#F66F7D] text-white text-[15px] font-semibold rounded-[6px] cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>

        {/* Back */}
        <p className="text-center text-black text-[13px] mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#F66F7D] font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}