"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import Image from "next/image";

export function UnlockDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 left-4 z-10">
          <button className="flex items-center gap-2 rounded-lg bg-[#f26d7d] px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:bg-[#e85d6b] active:scale-95">
            <Lock size={15} />
            Unlock
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden rounded-2xl !max-w-lg w-full gap-0 border-0 bg-transparent">
        {/* Full black backdrop */}
        <div className="absolute inset-0 bg-black z-0" />

        {/* ── Cover Image — blurred ── */}
        <div className="w-full h-[300px] relative overflow-hidden z-10">
          <Image
            src="/unlockImage.png"
            alt="Book Cover"
            fill
            className="object-cover filter blur-[6px] scale-[1.05]"
          />
        </div>

        {/* ── Content ── */}
        <div className="bg-white px-5 pt-5 pb-6 relative z-20 rounded-b-2xl">
          {/* Meta info */}
          <div className="mb-3.5 space-y-1.5">
            <p className="text-[15px] text-[#1a1a1a]">
              <span className="font-bold">Title:</span> Galactic Wars – Prologue
            </p>
            <p className="text-[15px] text-[#1a1a1a]">
              <span className="font-bold">Author:</span> Eleanor Pena
            </p>
            <p className="text-[15px] text-[#1a1a1a]">
              <span className="font-bold">Status:</span> Premium
            </p>
          </div>

          {/* Description — text blurred + fade overlay */}
          <div className="relative mb-6 overflow-hidden max-h-[60px]">
            <p className="text-[13px] text-[#555] leading-[1.6] blur-sm select-none">
              Captain Raya stared at the horizon. The battle for Nova Prime had
              begun, and nothing would ever be the same again. The stars burned
              bright against the endless void as her fleet prepared for the
              inevitable clash that would decide the fate of the galaxy.
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-b from-transparent to-white" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 h-[46px] bg-[#F66F7D] text-white text-[15px] font-semibold rounded-lg cursor-pointer hover:bg-[#e85d6b] transition-colors">
              Unlock $2
            </button>

            <DialogClose asChild>
              <button className="flex-1 h-[46px] bg-white text-[#F66F7D] text-[15px] font-semibold border-2 border-[#F66F7D] rounded-lg cursor-pointer hover:bg-[#fff0f1] transition-colors">
                Cancel
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
