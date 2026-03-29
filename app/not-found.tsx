"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <section className="flex min-h-screen items-center justify-center  px-4 overflow-hidden">
      
      <div
        className={`max-w-[620px] text-center rounded-2xl backdrop-blur-lg bg-[#FFFFFF0D] border border-white/20 p-8 transition-all duration-700 ease-out ${
          show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-[18px] font-semibold uppercase tracking-[0.18em] text-red-600">
          404 Error
        </p>

        <h1 className="mt-3 text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[44px] md:text-[52px] lg:text-[64px]">
          Not Found
        </h1>

        <p className="mt-5 text-[14px] leading-[1.8] text-white/80 sm:text-[16px] lg:text-[18px]">
          The page you are looking for may have been moved, deleted, or the
          link may be incorrect. Let&apos;s get you back to a page that helps
          you book or learn more about our inspection service.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white text-[#F66F7D] px-6 text-[15px] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl sm:h-[52px] sm:px-8"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        h1 {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}