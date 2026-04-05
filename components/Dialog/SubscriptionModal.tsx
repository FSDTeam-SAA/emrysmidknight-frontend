"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { SubscriptionPaymentModal } from "./SubscriptionPaymentModal";

type SubscriptionBlog = {
  _id?: string;
  title?: string;
};

type SubscriptionItem = {
  _id?: string;
  name?: string;
  price?: number;
  duration?: string;
  features?: string[];
  blogs?: SubscriptionBlog[];
};

type RenderPlan = {
  id: string;
  title: string;
  description: string;
  price: number;
  durationLabel: string;
  features: string[];
};

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  authorId?: string;
}

const formatDurationLabel = (value?: string) => {
  const raw = value?.trim().toLowerCase();
  if (!raw) return "month";
  if (raw === "monthly") return "month";
  if (raw === "yearly" || raw === "annual") return "year";
  if (raw.endsWith("ly")) return raw.replace(/ly$/, "");
  return raw;
};

const formatPrice = (value?: number) => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "0";
  return amount % 1 === 0 ? String(Math.trunc(amount)) : amount.toFixed(2);
};

export function SubscriptionModal({ open, onClose, authorId }: SubscriptionModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<RenderPlan | null>(null);

  const {
    data: subscriptions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["author-subscriptions", authorId, token],
    enabled: open && Boolean(authorId && token),
    queryFn: async () => {
      if (!authorId || !token) return [] as SubscriptionItem[];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber/author-subscriptions/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to load subscriptions");
      }
      return (payload?.data ?? []) as SubscriptionItem[];
    },
  });

  const plans = useMemo<RenderPlan[]>(() => {
    return subscriptions
      .filter((item) => Boolean(item?._id))
      .map((item) => {
        const features = (item.features ?? [])
          .map((feature) => feature?.trim())
          .filter((feature): feature is string => Boolean(feature));
        const blogTitles = (item.blogs ?? [])
          .map((blog) => blog.title?.trim())
          .filter((title): title is string => Boolean(title));
        const displayFeatures =
          features.length > 0
            ? features
            : blogTitles.length > 0
              ? blogTitles
              : ["No features listed yet."];
        const description =
          blogTitles.length > 0
            ? `Includes access to ${blogTitles.length} premium ${
                blogTitles.length === 1 ? "post" : "posts"
              }.`
            : features.length > 0
              ? `Includes ${features.length} plan ${
                  features.length === 1 ? "feature" : "features"
                }.`
              : "Subscribe to unlock premium content from this author.";

        return {
          id: item._id || "",
          title: item.name?.trim() || "Untitled Plan",
          description,
          price: Number(item.price ?? 0),
          durationLabel: formatDurationLabel(item.duration),
          features: displayFeatures,
        };
      })
      .filter((plan) => plan.id.length > 0);
  }, [subscriptions]);

  const showLoginNotice = open && !token;
  const showAuthorNotice = open && token && !authorId;

  const handleSubscribeClick = (plan: RenderPlan) => {
    setSelectedPlan(plan);
    onClose();
    setTimeout(() => {
      setPaymentOpen(true);
    }, 150);
  };

  const handlePaymentClose = () => {
    setPaymentOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="p-6 border-none !max-w-[70%] w-[95vw] !max-h-[90vh] overflow-auto rounded-2xl dark:bg-transparent">

          {showLoginNotice ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Please login to view this author's subscription plans.
            </div>
          ) : null}

          {showAuthorNotice ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Author not found. Please refresh and try again.
            </div>
          ) : null}

          {isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {(error as Error)?.message || "Failed to load subscriptions."}
            </div>
          ) : null}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`plan-skeleton-${index}`}
                    className="flex flex-col bg-white dark:bg-[#2C2C2C] rounded-xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.6)]"
                  >
                    <Skeleton className="h-6 w-2/3 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-6" />
                    <Skeleton className="h-10 w-2/3 mb-6" />
                    <div className="space-y-2.5 mb-6 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))
              : plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex flex-col bg-white dark:bg-[#2C2C2C] rounded-xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.10)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.6)]"
                  >
                    {/* Title */}
                    <h3 className="text-[20px] font-bold text-gray-900 dark:text-white mb-2">
                      {plan.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] text-gray-500 dark:text-[#D7D7D7] leading-relaxed mb-4">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-5">
                      <span className="text-[42px] font-extrabold text-gray-900 dark:text-white leading-none">
                        ${formatPrice(plan.price)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-[#D7D7D7] font-medium ml-1">
                        /{plan.durationLabel}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-2.5 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#F66F7D] mt-[2px] shrink-0" />
                          <span className="text-[13px] text-gray-700 dark:text-[#D7D7D7] leading-snug">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => handleSubscribeClick(plan)}
                      className="mt-auto w-full h-12 bg-[#F66F7D] text-white text-sm font-semibold rounded-lg hover:bg-[#e85d6b] transition-colors duration-200 active:scale-95"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
          </div>

          {!isLoading && plans.length === 0 && !isError && !showLoginNotice && !showAuthorNotice ? (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              No subscription plans available for this author yet.
            </div>
          ) : null}

        </DialogContent>
      </Dialog>

      <SubscriptionPaymentModal
        open={paymentOpen}
        onClose={handlePaymentClose}
        planId={selectedPlan?.id}
        amount={selectedPlan?.price}
        authorId={authorId}
      />
    </>
  );
}
