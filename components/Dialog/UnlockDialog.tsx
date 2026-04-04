"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import Image from "next/image";
import { PaymentModal } from "./PaymentModal";

interface UnlockDialogProps {
  blogId?: string;
  title: string;
  author: string;
  content: string;
  image?: string;
  price?: number; 
}

export function UnlockDialog({ blogId, title, author, content, image, price }: UnlockDialogProps) {
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleUnlockClick = () => {
    setUnlockOpen(false);
    setTimeout(() => {
      setPaymentOpen(true);
    }, 150);
  };

  return (
    <>
      <Dialog open={unlockOpen} onOpenChange={setUnlockOpen}>
        <DialogTrigger asChild>
          <div className="absolute bottom-2 left-4 z-10">
            <button className="flex items-center gap-2 rounded-lg bg-[#f26d7d] px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:bg-[#e85d6b] active:scale-95">
              <Lock size={15} />
              Unlock
            </button>
          </div>
        </DialogTrigger>

        <DialogContent className="p-0 overflow-hidden rounded-2xl !max-w-lg w-full gap-0 border-0 bg-transparent">
          <div className="absolute inset-0 bg-black z-0" />

          <div className="w-full h-[300px] relative overflow-hidden z-10">
            <Image
              src={image || "/unlockImage.png"}
              alt="Book Cover"
              fill
              className="object-cover blur-[6px] scale-[105%]"
            />
          </div>

          <div className="bg-white px-5 pt-5 pb-6 relative z-20 rounded-b-2xl">
            <div className="mb-3.5 space-y-1.5">
              <p className="text-[15px] text-[#1a1a1a]">
                <span className="font-bold">Title:</span> {title}
              </p>
              <p className="text-[15px] text-[#1a1a1a]">
                <span className="font-bold">Author:</span> {author}
              </p>
              <p className="text-[15px] text-[#1a1a1a]">
                <span className="font-bold">Status:</span> Premium
              </p>
            </div>

            <div className="relative mb-6 overflow-hidden max-h-[60px]">
              <p className="text-[13px] text-[#555] leading-[1.6] select-none blur-sm">
                {content}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-b from-transparent to-white" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUnlockClick}
                className="flex-1 h-[46px] bg-[#F66F7D] text-white text-[16px] font-semibold rounded-lg cursor-pointer hover:bg-[#e85d6b] transition-colors"
              >
                Unlock {price ? `$${price.toFixed(2)}` : ""}
              </button>

              <DialogClose asChild>
                <button className="flex-1 h-[46px] bg-white text-[#F66F7D] text-[16px] font-semibold border-2 border-[#F66F7D] rounded-lg cursor-pointer hover:bg-[#fff0f1] transition-colors">
                  Cancel
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        blogId={blogId}
        amount={price}
      />
    </>
  );
}
