'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'stripe';
  number: string;
  expires: string;
}

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  visa: (
    <svg className="h-6 w-6" viewBox="0 0 48 32">
      <rect width="48" height="32" rx="6" fill="#1434CB" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        VISA
      </text>
    </svg>
  ),
  mastercard: (
    <svg className="h-6 w-6" viewBox="0 0 48 32">
      <rect width="48" height="32" rx="6" fill="#1A1F71" />
      <circle cx="16" cy="16" r="6" fill="#EB001B" />
      <circle cx="32" cy="16" r="6" fill="#F79E1B" />
    </svg>
  ),
  stripe: (
    <svg className="h-6 w-6" viewBox="0 0 48 32">
      <rect width="48" height="32" rx="6" fill="#6366F1" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
        STRIPE
      </text>
    </svg>
  ),
};

export function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'visa', number: '651*...*64379', expires: '06/30' },
    { id: '2', type: 'mastercard', number: '454*...*48476', expires: '06/30' },
    { id: '3', type: 'stripe', number: 'Pay with Stripe', expires: 'N/A' },
  ]);

  const handleDelete = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddMethod = () => {
    console.log('Add new payment method');
  };

  return (
    <div className="w-full">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#FFFFFF0D] dark:bg-[#FFFFFF0D] sm:p-5">
        
        {/* Header (LG same) */}
        <div className="mb-6 hidden border-b border-gray-200 pb-4 dark:border-[#FFFFFF0D] md:grid md:grid-cols-3 gap-4">
          <div className="text-sm font-semibold text-[#2C2C2C] dark:text-white">
            Method
          </div>
          <div className="text-sm font-semibold text-[#2C2C2C] dark:text-white">
            Expires
          </div>
          <div />
        </div>

        {/* List */}
        <div className="space-y-2">
          {methods.map((method) => (
            <div
              key={method.id}
              className="rounded-lg border border-transparent p-3 transition-all hover:border-gray-200 hover:bg-gray-50 dark:hover:border-[#FFFFFF0D] dark:hover:bg-[#FFFFFF14] sm:p-4"
            >
              {/* Mobile */}
              <div className="flex items-start justify-between gap-3 md:hidden">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center shrink-0">
                    {PAYMENT_ICONS[method.type]}
                  </div>

                  <div className="min-w-0">
                    <div className="break-words text-sm font-medium text-[#2C2C2C] dark:text-white">
                      {method.type === 'stripe'
                        ? method.number
                        : `${method.type.toUpperCase()} •••• ${
                            method.number.split('*')[1]
                          }`}
                    </div>

                    <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      Expires {method.expires}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(method.id)}
                  className="rounded-md p-2 transition hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="h-4 w-4 text-[#F66F7D]" />
                </button>
              </div>

              {/* Desktop (UNCHANGED) */}
              <div className="hidden md:grid md:grid-cols-3 items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center">
                    {PAYMENT_ICONS[method.type]}
                  </div>

                  <span className="text-sm font-medium text-[#2C2C2C] dark:text-slate-200">
                    {method.type === 'stripe'
                      ? method.number
                      : `${method.type.toUpperCase()} ${method.number}`}
                  </span>
                </div>

                <div className="text-sm text-[#2C2C2C] dark:text-slate-200">
                  {method.expires}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="h-10 rounded-md border-[#F66F7D] px-4 text-[#F66F7D] hover:bg-[#F66F7D]/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <div className="mt-5">
        <Button
          onClick={handleAddMethod}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#F66F7D] px-5 h-11 text-sm text-white shadow-sm hover:bg-[#F66F7D]/90 sm:w-auto sm:h-12 sm:text-base"
        >
          <Plus className="h-4 w-4" />
          Add New Payment Method
        </Button>
      </div>
    </div>
  );
}