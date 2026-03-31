"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface Plan {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "all-access",
    title: "All Access",
    description:
      "Subscribers in this tier get full access to all premium stories and posts from the author.",
    price: 90,
    features: [
      "Access to all premium posts",
      "Access to all genres and story series",
      "Access to future premium content",
      "Early access to new chapters",
    ],
  },
  {
    id: "secret-library",
    title: "The Secret Library",
    description: "Explore curated premium stories and hidden chapters.",
    price: 50,
    features: [
      "The Dark Forest – Chapter 1",
      "Galactic Wars – Prologue",
      "Moonlight Diary – Episode 3",
      "Shadows of the Kingdom – Part 2",
      "A Summer Tale – Chapter 5",
      "The Lost Expedition – Chapter 4",
    ],
  },
  {
    id: "hidden-chapters",
    title: "Hidden Chapters",
    description: "Explore curated premium stories and hidden chapters.",
    price: 30,
    features: [
      "The Dark Forest – Chapter 1",
      "Galactic Wars – Prologue",
      "Moonlight Diary – Episode 3",
      "Shadows of the Kingdom – Part 2",
      "A Summer Tale – Chapter 5",
      "The Lost Expedition – Chapter 4",
    ],
  },
];

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ open, onClose }: SubscriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-6 border-none !max-w-[90%] w-[95vw] !max-h-[90vh] overflow-auto rounded-2xl">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col bg-white rounded-xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
            >
              {/* Title */}
              <h3 className="text-[20px] font-bold text-gray-900 mb-2">
                {plan.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-5">
                <span className="text-[42px] font-extrabold text-gray-900 leading-none">
                  ${plan.price}
                </span>
                <span className="text-sm text-gray-500 font-medium ml-1">
                  /month
                </span>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F66F7D] mt-[2px] shrink-0" />
                    <span className="text-[13px] text-gray-700 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={onClose}
                className="mt-auto w-full h-12 bg-[#F66F7D] text-white text-sm font-semibold rounded-lg hover:bg-[#e85d6b] transition-colors duration-200 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          ))}
        </div>

      </DialogContent>
    </Dialog>
  );
}