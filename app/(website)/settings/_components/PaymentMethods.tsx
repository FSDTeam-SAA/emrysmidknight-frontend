
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
    <svg className="w-6 h-6" viewBox="0 0 48 32">
      <rect width="48" height="32" rx="6" fill="#1434CB" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        VISA
      </text>
    </svg>
  ),
  mastercard: (
    <svg className="w-6 h-6" viewBox="0 0 48 32">
      <rect width="48" height="32" rx="6" fill="#1A1F71" />
      <circle cx="16" cy="16" r="6" fill="#EB001B" />
      <circle cx="32" cy="16" r="6" fill="#F79E1B" />
    </svg>
  ),
  stripe: (
    <svg className="w-6 h-6" viewBox="0 0 48 32">
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
      <div className="w-full bg-white dark:bg-[#FFFFFF0D] p-5 rounded-xl border border-gray-200 dark:border-[#FFFFFF0D] shadow-sm">
        
        {/* Header */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-[#FFFFFF0D]">
          <div className="text-sm font-semibold text-[#2C2C2C] dark:text-white">Method</div>
          <div className="text-sm font-semibold text-[#2C2C2C] dark:text-white">Expires</div>
          <div />
        </div>

        {/* List */}
        <div className="space-y-2">
          {methods.map((method) => (
            <div
              key={method.id}
              className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-[#FFFFFF14] transition-all border border-transparent hover:border-gray-200 dark:hover:border-[#FFFFFF0D]"
            >
              {/* Mobile */}
              <div className="md:hidden flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {PAYMENT_ICONS[method.type]}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-[#2C2C2C] dark:text-white">
                      {method.type === 'stripe'
                        ? method.number
                        : `${method.type.toUpperCase()} •••• ${
                            method.number.split('*')[1]
                          }`}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Expires {method.expires}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(method.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition"
                >
                  <Trash2 className="w-4 h-4 text-[#F66F7D]" />
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden md:grid md:grid-cols-3 items-center">
                
                {/* Method */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {PAYMENT_ICONS[method.type]}
                  </div>

                  <span className="text-sm text-[#2C2C2C] dark:text-slate-200 font-medium">
                    {method.type === 'stripe'
                      ? method.number
                      : `${method.type.toUpperCase()} ${method.number}`}
                  </span>
                </div>

                {/* Expiry */}
                <div className="text-sm text-[#2C2C2C] dark:text-slate-200">
                  {method.expires}
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="border-[#F66F7D] text-[#F66F7D] hover:bg-[#F66F7D]/10 rounded-md px-4 h-10"
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
          className="bg-[#F66F7D] hover:bg-[#F66F7D]/90 text-white h-12 px-5 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Payment Method
        </Button>
      </div>
    </div>
  );
}

