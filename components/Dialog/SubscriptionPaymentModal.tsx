"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

interface SubscriptionPaymentModalProps {
  open: boolean;
  onClose: () => void;
  planId?: string;
  amount?: number;
  authorId?: string;
}

type PaymentMethod = {
  _id?: string;
  id?: string;
  cardBrand?: string;
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvc?: string;
  cardHolderName?: string;
};

const cardImageMap: Record<string, string> = {
  visa: "/visa.svg",
  mastercard: "/mastercard.svg",
  stripe: "/stripe.svg",
  amex: "/visa.svg",
  discover: "/mastercard.svg",
};

const getMethodId = (method: PaymentMethod) => method._id || method.id || "";
const normalizeDigits = (value: string) =>
  value.replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)));
const hasTextCharacter = (value: string) => /[A-Za-z\u0980-\u09FF]/.test(value);

const maskCardNumber = (cardNumber?: string) => {
  if (!cardNumber) return "**** **** **** ****";
  const normalized = cardNumber.replace(/\s+/g, "");
  const last4 = normalized.slice(-4);
  return `**** **** **** ${last4}`;
};

const formatExpiryText = (month?: number, year?: number) => {
  if (!month || !year) return "";
  const mm = String(month).padStart(2, "0");
  const yy = String(year).slice(-2);
  return `${mm}/${yy}`;
};

const formatCardNumber = (val: string) =>
  normalizeDigits(val).replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (val: string) => {
  const digits = normalizeDigits(val).replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

export function SubscriptionPaymentModal({ open, onClose, planId, amount, authorId }: SubscriptionPaymentModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [selectedMethod, setSelectedMethod] = useState<string>("manual");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const queryClient = useQueryClient();
  const isManual = selectedMethod === "manual";

  const { data: savedMethods = [], isLoading: isMethodsLoading } = useQuery({
    queryKey: ["payment-methods", token],
    queryFn: async () => {
      if (!token) return [] as PaymentMethod[];
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment-method`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch payment methods");
      const result = await res.json();
      return (result?.data ?? []) as PaymentMethod[];
    },
    enabled: open && !!token,
  });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Please login first");
      if (!planId) throw new Error("Plan id not found");

      if (selectedMethod === "manual") {
        if (!cardNumber || !expiry || !cvv || !nameOnCard) {
          throw new Error("Please fill up all card fields for manual payment");
        }
      }

      const payload = selectedMethod === "manual" ? {} : { savedMethodId: selectedMethod };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/subscribe/${planId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Subscription payment request failed");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Subscription request created successfully");
      queryClient.invalidateQueries({ queryKey: ["author-profile"] });
      if (authorId) {
        queryClient.invalidateQueries({ queryKey: ["author-subscriptions", authorId] });
      }
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Subscription payment failed");
    },
  });

  const resolvedAmount = useMemo(() => {
    if (typeof amount === "number" && Number.isFinite(amount) && amount > 0) return amount;
    return 2;
  }, [amount]);

  const handleSelectSavedMethod = (method: PaymentMethod) => {
    const methodId = getMethodId(method);
    if (!methodId) return;

    setSelectedMethod(methodId);
    setCardNumber(formatCardNumber(method.cardNumber || ""));
    setExpiry(formatExpiryText(method.expiryMonth, method.expiryYear));
    setNameOnCard(method.cardHolderName || "");
    setCvv((method.cvc || "").replace(/\D/g, "").slice(0, 3));
  };

  const handleManualMode = () => {
    setSelectedMethod("manual");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setNameOnCard("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="border-0 gap-0 !max-w-[720px] w-[95vw] md:w-full p-0 flex flex-col max-h-[92vh] rounded-lg overflow-hidden [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:w-6 [&>button]:h-6 [&>button]:rounded-full [&>button]:bg-red-500 hover:[&>button]:bg-red-600 [&>button]:transition-colors [&>button_svg]:text-white [&>button_svg]:w-3 [&>button_svg]:h-3">
        <div className="bg-white dark:bg-[#2C2C2C] p-5 md:p-7 pb-6 overflow-y-auto text-[#1a1a1a] dark:text-white">
          <h2 className="text-[26px] font-bold text-[#1a1a1a] dark:text-white !mb-6">Payment</h2>

          <div className="mb-3.5">
            <label className="block text-[13px] font-semibold text-[#1a1a1a] dark:text-white mb-1.5">Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              disabled={!isManual}
              onChange={(e) => {
                if (hasTextCharacter(e.target.value)) {
                  toast.warning("Card number field accepts numbers only.", {
                    id: "subscription-number-only-card",
                  });
                }
                setCardNumber(formatCardNumber(e.target.value));
                setSelectedMethod("manual");
              }}
              className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] dark:text-white border border-gray-300 dark:border-[#D7D7D7] rounded-lg outline-none bg-white dark:bg-[#2C2C2C] placeholder:text-gray-400 dark:placeholder:text-[#D7D7D7] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div>
              <label className="block text-[13px] font-semibold text-[#1a1a1a] dark:text-white mb-1.5">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                disabled={!isManual}
                onChange={(e) => {
                  if (hasTextCharacter(e.target.value)) {
                    toast.warning("Expiry field accepts numbers only.", {
                      id: "subscription-number-only-expiry",
                    });
                  }
                  setExpiry(formatExpiry(e.target.value));
                  setSelectedMethod("manual");
                }}
                className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] dark:text-white border border-gray-300 dark:border-[#D7D7D7] rounded-lg outline-none bg-white dark:bg-[#2C2C2C] placeholder:text-gray-400 dark:placeholder:text-[#D7D7D7] disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1a1a1a] dark:text-white mb-1.5">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                disabled={!isManual}
                onChange={(e) => {
                  if (hasTextCharacter(e.target.value)) {
                    toast.warning("CVV field accepts numbers only.", {
                      id: "subscription-number-only-cvv",
                    });
                  }
                  setCvv(normalizeDigits(e.target.value).replace(/\D/g, "").slice(0, 3));
                  setSelectedMethod("manual");
                }}
                className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] dark:text-white border border-gray-300 dark:border-[#D7D7D7] rounded-lg outline-none bg-white dark:bg-[#2C2C2C] placeholder:text-gray-400 dark:placeholder:text-[#D7D7D7] disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-[#1a1a1a] dark:text-white mb-1.5">Name on Card</label>
            <input
              type="text"
              placeholder="John Doe"
              value={nameOnCard}
              disabled={!isManual}
              onChange={(e) => {
                setNameOnCard(e.target.value);
                setSelectedMethod("manual");
              }}
              className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] dark:text-white border border-gray-300 dark:border-[#D7D7D7] rounded-lg outline-none bg-white dark:bg-[#2C2C2C] placeholder:text-gray-400 dark:placeholder:text-[#D7D7D7] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2.5 mb-5">
            {isMethodsLoading ? (
              <div className="text-sm text-gray-500 dark:text-white">Loading payment methods...</div>
            ) : null}

            {savedMethods.map((method) => {
              const methodId = getMethodId(method);
              if (!methodId) return null;

              const brand = (method.cardBrand || "visa").toLowerCase();
              const imageSrc = cardImageMap[brand] || "/visa.svg";

              return (
                <button
                  key={methodId}
                  type="button"
                  onClick={() => handleSelectSavedMethod(method)}
                  className={`flex items-center justify-between gap-3 p-3.5 border rounded-xl text-left cursor-pointer bg-white dark:bg-[#2C2C2C] ${
                    selectedMethod === methodId
                      ? "border-2 border-[#F66F7D]"
                      : "border-gray-300 dark:border-[#D7D7D7]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image src={imageSrc} alt={brand} width={40} height={26} className="object-contain" />
                    <div>
                      <p className="text-[14px] font-medium text-[#1a1a1a] dark:text-white">
                        {maskCardNumber(method.cardNumber)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-white">
                        Exp {formatExpiryText(method.expiryMonth, method.expiryYear) || "--/--"}
                      </p>
                    </div>
                  </div>
                  {selectedMethod === methodId ? <CheckCircle2 size={18} color="#F66F7D" fill="#F66F7D" /> : null}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleManualMode}
              className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer ${
                selectedMethod === "manual"
                  ? "border-2 border-[#F66F7D] bg-[#fff5f6] dark:bg-[#2C2C2C]"
                  : "border-gray-300 dark:border-[#D7D7D7] bg-white dark:bg-[#2C2C2C]"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={22} color="#F66F7D" />
                <span className="text-[14px] font-medium text-[#1a1a1a] dark:text-white">Manual Payment</span>
              </div>
              {selectedMethod === "manual" ? <CheckCircle2 size={20} color="#F66F7D" fill="#F66F7D" /> : null}
            </button>
          </div>

          <div className="h-[1px] bg-gray-200 dark:bg-[#D7D7D7] mb-4" />

          <div className="flex justify-between items-center mb-4">
            <span className="text-[16px] font-bold text-[#1a1a1a] dark:text-white">Total Amount</span>
            <span className="text-[16px] font-bold text-[#1a1a1a] dark:text-white">${resolvedAmount.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedMethod === "manual" && !cardNumber.trim()) {
                toast.warning("Please enter your card number to continue.");
                return;
              }
              paymentMutation.mutate();
            }}
            disabled={paymentMutation.isPending || !planId}
            className="w-full h-[50px] bg-[#F66F7D] text-white text-[16px] font-bold rounded-xl mb-3.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {paymentMutation.isPending ? "Processing..." : `Pay $${resolvedAmount.toFixed(2)}`}
          </button>

          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} color="#9ca3af" />
            <span className="text-[12px] text-gray-400 dark:text-white">Your payment is encrypted and secure</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
