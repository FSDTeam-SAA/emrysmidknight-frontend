"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, X } from "lucide-react";
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

        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-1.5rem)] max-w-lg max-h-[90vh] overflow-hidden rounded-2xl p-0 gap-0 border-0 bg-white dark:bg-[#121212]"
        >
          <div className="relative h-[180px] sm:h-[240px] w-full overflow-hidden">
            <Image
              src={image || "/unlockImage.png"}
              alt="Book Cover"
              fill
              className="object-cover blur-[6px] scale-[105%]"
            />
            <div className="absolute inset-0 bg-black/40" />

            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close dialog"
                className="absolute right-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              >
                <X size={16} />
              </button>
            </DialogClose>
          </div>

          <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-5 sm:pb-6 overflow-y-auto">
            <div className="mb-3.5 space-y-1.5">
              <p className="text-[15px] text-[#1a1a1a] dark:text-white">
                <span className="font-bold">Title:</span> {title}
              </p>
              <p className="text-[15px] text-[#1a1a1a] dark:text-white">
                <span className="font-bold">Author:</span> {author}
              </p>
              <p className="text-[15px] text-[#1a1a1a] dark:text-white">
                <span className="font-bold">Status:</span> Premium
              </p>
            </div>

            <div className="relative mb-5 overflow-hidden">
              <p className="text-[13px] text-[#555] dark:text-[#cfcfcf] leading-[1.6] select-none blur-sm line-clamp-3">
                {content}
              </p>
            </div>

            <div>
              <button
                onClick={handleUnlockClick}
                className="w-full h-[46px] bg-[#F66F7D] text-white text-[16px] font-semibold rounded-lg cursor-pointer hover:bg-[#e85d6b] transition-colors"
              >
                Unlock {price ? `$${price.toFixed(2)}` : ""}
              </button>
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
