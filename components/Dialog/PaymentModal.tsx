"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

const savedCards = [
  { id: 1, type: "visa", number: "651***********643791" },
  { id: 2, type: "mastercard", number: "454***********148476" },
];

export function PaymentModal({ open, onClose }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<number | "stripe" | "new">("new");

  const formatCardNumber = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="p-0 overflow-hidden rounded-2xl border-0 gap-0 !max-w-2xl w-full">
        <div className="bg-white p-7 pb-6">

          {/* Title */}
          <h2 className="text-[26px] font-bold text-[#1a1a1a] !mb-8">Payment</h2>

          {/* Card Number */}
          <div className="mb-3.5">
            <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] border border-gray-300 rounded-lg outline-none"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div>
              <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Name on Card */}
          <div className="mb-3">
            <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">Name on Card</label>
            <input
              type="text"
              placeholder="John Doe"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              className="w-full h-[50px] px-3.5 text-[14px] text-[#1a1a1a] border border-gray-300 rounded-lg outline-none"
            />
          </div>

          {/* Save card checkbox */}
          <label className="flex items-center gap-2 text-[13px] text-gray-500 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#F66F7D]"
            />
            Save payment details for future purchases
          </label>

          {/* Saved Cards */}
          <div className="flex flex-col gap-2.5 mb-4">

            {savedCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedMethod(card.id)}
                className={`flex items-center gap-3 p-3.5 border rounded-xl text-left cursor-pointer bg-white ${
                  selectedMethod === card.id ? "border-2 border-[#F66F7D]" : "border-gray-300"
                }`}
              >
                <Image
                  src={`/${card.type}.png`}
                  alt={card.type}
                  width={38}
                  height={24}
                  className="object-contain"
                />
                <span className="text-[14px] font-medium text-[#1a1a1a]">{card.number}</span>
              </button>
            ))}

            {/* Stripe */}
            <button
              onClick={() => setSelectedMethod("stripe")}
              className={`flex items-center gap-3 p-3.5 border rounded-xl text-left cursor-pointer bg-white ${
                selectedMethod === "stripe" ? "border-2 border-[#F66F7D]" : "border-gray-300"
              }`}
            >
              <Image src="/stripe.png" alt="Stripe" width={38} height={24} className="object-contain" />
              <span className="text-[14px] font-medium text-[#1a1a1a]">Pay with Stripe</span>
            </button>

            {/* Add New Card */}
            <button
              onClick={() => setSelectedMethod("new")}
              className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer ${
                selectedMethod === "new" ? "border-2 border-[#F66F7D] bg-[#fff5f6]" : "border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={22} color="#F66F7D" />
                <span className="text-[14px] font-medium text-[#1a1a1a]">Add New Card</span>
              </div>
              {selectedMethod === "new" && <CheckCircle2 size={20} color="#F66F7D" fill="#F66F7D" />}
            </button>

          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gray-200 mb-4" />

          {/* Total */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[16px] font-bold text-[#1a1a1a]">Total Amount</span>
            <span className="text-[16px] font-bold text-[#1a1a1a]">$2.00</span>
          </div>

          {/* Pay Button */}
          <button className="w-full h-[50px] bg-[#F66F7D] text-white text-[16px] font-bold rounded-xl mb-3.5 cursor-pointer">
            Pay $2.00
          </button>

          {/* Secure note */}
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} color="#9ca3af" />
            <span className="text-[12px] text-gray-400">Your payment is encrypted and secure</span>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}