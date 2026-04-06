'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface PaymentMethod {
  _id?: string;
  id?: string;
  cardBrand: 'visa' | 'mastercard' | 'stripe' | string;
  cardNumber: string;
  expiryMonth?: number;
  expiryYear?: number;
  expiryDate?: string;
  cardHolderName: string;
}

type PaymentMethodResponse =
  | { statusCode?: number; success?: boolean; message?: string; data: PaymentMethod }
  | PaymentMethod;

const PAYMENT_ICONS: Record<string, ReactNode> = {
  visa: (
    <svg className="h-6 w-6" viewBox="0 0 48 32">
      <rect width="48" height="32" rx="6" fill="#1434CB" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VISA</text>
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
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">STRIPE</text>
    </svg>
  ),
};

// Skeleton Loader
function PaymentMethodSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-transparent p-3 sm:p-4 animate-pulse"
        >
          <div className="flex items-center gap-3 md:hidden">
            <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-3 items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex justify-end">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PaymentMethods() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const isSessionLoading = status === 'loading';
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'stripe'>('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const resetAddForm = () => {
    setCardBrand('visa');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardHolderName('');
  };

  const handleAddOpenChange = (open: boolean) => {
    setIsAddOpen(open);
    if (!open) resetAddForm();
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setIsDeleteOpen(open);
    if (!open) setDeleteTargetId(null);
  };

  type DeleteContext = { previous?: PaymentMethod[] };
  type CreateContext = { previous?: PaymentMethod[]; tempId?: string };

  // Fetch payment methods
  const { data, isLoading, error } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      if (!token) throw new Error('Missing auth token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment-method`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch payment methods');
      const result = await res.json();
      return result.data as PaymentMethod[]; 
    },
    enabled: !!token,
  });

  // Delete mutation
  const deleteMutation = useMutation<void, Error, string, DeleteContext>({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Missing auth token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment-method/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete payment method');
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['payment-methods'] });
      const previous = queryClient.getQueryData<PaymentMethod[]>(['payment-methods']);
      if (previous) {
        queryClient.setQueryData<PaymentMethod[]>(
          ['payment-methods'],
          previous.filter((method) => (method._id ?? method.id) !== id)
        );
      }
      return { previous };
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['payment-methods'], context.previous);
      }
      const message = error instanceof Error ? error.message : 'Failed to delete payment method';
      toast.error(message);
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<PaymentMethod[]>(['payment-methods'], (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((method) => (method._id ?? method.id) !== id);
      });
      toast.success('Payment method deleted');
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ['payment-methods'], exact: true });
    },
  });

  const createMutation = useMutation<PaymentMethodResponse, Error, void, CreateContext>({
    mutationFn: async () => {
      if (!token) throw new Error('Missing auth token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardBrand,
          cardNumber,
          expiryDate,
          cvc: cvv,
          cardHolderName,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add payment method');
      }
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['payment-methods'] });
      const previous = queryClient.getQueryData<PaymentMethod[]>(['payment-methods']);
      const tempId = `temp-${Date.now()}`;
      const parsedExpiry = parseExpiryDate(expiryDate);
      const optimistic: PaymentMethod = {
        _id: tempId,
        cardBrand,
        cardNumber,
        expiryDate,
        expiryMonth: parsedExpiry?.month,
        expiryYear: parsedExpiry?.year,
        cardHolderName,
      };
      queryClient.setQueryData<PaymentMethod[]>(['payment-methods'], (old) => {
        const existing = Array.isArray(old) ? old : [];
        return [optimistic, ...existing];
      });
      return { previous, tempId };
    },
    onSuccess: (data, _vars, context) => {
      const responseMessage = 'message' in data ? data.message : undefined;
      toast.success(responseMessage || 'Payment method added');
      const created = 'data' in data ? data.data : data;
      if (created) {
        const normalizedId = created._id ?? created.id;
        const parsedExpiry = parseExpiryDate(created.expiryDate);
        const normalized: PaymentMethod = {
          ...created,
          _id: normalizedId ?? created._id,
          expiryMonth: created.expiryMonth ?? parsedExpiry?.month,
          expiryYear: created.expiryYear ?? parsedExpiry?.year,
        };

        if (normalized._id) {
          queryClient.setQueryData<PaymentMethod[]>(['payment-methods'], (old) => {
            const existing = Array.isArray(old) ? old : [];
            const withoutTemp = context?.tempId
              ? existing.filter((method) => (method._id ?? method.id) !== context.tempId)
              : existing;
            if (withoutTemp.some((method) => (method._id ?? method.id) === normalized._id)) {
              return withoutTemp;
            }
            return [normalized, ...withoutTemp];
          });
        }
      }
      setIsAddOpen(false);
      resetAddForm();
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['payment-methods'], context.previous);
      }
      const message = error instanceof Error ? error.message : 'Failed to add payment method';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ['payment-methods'], exact: true });
    },
  });

  const handleDelete = (id?: string) => {
    if (!id) {
      toast.error('Payment method id not found');
      return;
    }
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId);
  };

  const handleAddMethod = () => {
    setIsAddOpen(true);
  };

  const getMethodId = (method: PaymentMethod) => method._id ?? method.id;

  // Format card number (last 4 digits)
  const formatCardNumber = (cardNumber: string) => {
    const digits = cardNumber.replace(/\D/g, '');
    return digits.slice(-4);
  };

  const formatCardNumberInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const parseExpiryDate = (value?: string) => {
    if (!value) return null;
    const match = value.match(/^(\d{2})\/(\d{2}|\d{4})$/);
    if (!match) return null;
    const month = Number.parseInt(match[1], 10);
    const yearRaw = Number.parseInt(match[2], 10);
    const year = match[2].length === 2 ? 2000 + yearRaw : yearRaw;
    if (Number.isNaN(month) || Number.isNaN(year)) return null;
    return { month, year };
  };

  const formatExpiryInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleCreateSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
      toast.error('Please fill in all fields');
      return;
    }
    if (cardNumber.length < 12) {
      toast.error('Card number looks too short');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast.error('Please enter a valid expiry date');
      return;
    }
    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return;
    }
    createMutation.mutate();
  };

  // Format expiry date
  const formatExpiry = (method: PaymentMethod) => {
    if (typeof method.expiryMonth === 'number' && typeof method.expiryYear === 'number') {
      return `${method.expiryMonth.toString().padStart(2, '0')}/${method.expiryYear.toString().slice(-2)}`;
    }
    if (method.expiryDate) return method.expiryDate;
    return '--/--';
  };

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400">Failed to load payment methods. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#FFFFFF0D] dark:bg-[#FFFFFF0D] sm:p-5">
        
        {/* Header */}
        <div className="mb-6 hidden border-b border-gray-200 pb-4 dark:border-[#FFFFFF0D] md:grid md:grid-cols-3 gap-4">
          <div className="text-sm font-semibold text-[#2C2C2C] dark:text-white">Method</div>
          <div className="text-sm font-semibold text-[#2C2C2C] dark:text-white">Expires</div>
          <div />
        </div>

        {/* List */}
        <div className="space-y-2">
          {isLoading ? (
            <PaymentMethodSkeleton />
          ) : isSessionLoading ? (
            <PaymentMethodSkeleton />
          ) : data && data.length > 0 ? (
            data.map((method) => {
              const methodId = getMethodId(method);
              return (
              <div
                key={methodId ?? `${method.cardBrand}-${method.cardNumber}`}
                className="rounded-lg border border-transparent p-3 transition-all hover:border-gray-200 hover:bg-gray-50 dark:hover:border-[#FFFFFF0D] dark:hover:bg-[#FFFFFF14] sm:p-4"
              >
                {/* Mobile View */}
                <div className="flex items-start justify-between gap-3 md:hidden">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center shrink-0">
                      {PAYMENT_ICONS[method.cardBrand] || PAYMENT_ICONS.visa}
                    </div>

                    <div className="min-w-0">
                      <div className="break-words text-sm font-medium text-[#2C2C2C] dark:text-white">
                        {method.cardBrand.toUpperCase()} •••• {formatCardNumber(method.cardNumber)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        Expires {formatExpiry(method)}
                      </div>
                      {method.cardHolderName && (
                        <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                          {method.cardHolderName}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(methodId)}
                    disabled={deleteMutation.isPending}
                    className="rounded-md p-2 transition hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 text-[#F66F7D]" />
                  </button>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-3 items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center">
                      {PAYMENT_ICONS[method.cardBrand] || PAYMENT_ICONS.visa}
                    </div>

                    <div>
                      <div className="text-base font-medium text-[#2C2C2C] dark:text-slate-200">
                        {method.cardBrand.toUpperCase()} •••• {formatCardNumber(method.cardNumber)}
                      </div>
                      {method.cardHolderName && (
                        <div className="text-sm text-gray-500 dark:text-slate-400">
                          {method.cardHolderName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-base text-[#2C2C2C] dark:text-slate-200">
                    {formatExpiry(method)}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(methodId)}
                      disabled={deleteMutation.isPending}
                      className="h-10 rounded-md border-[#F66F7D] px-4 text-[#F66F7D] hover:bg-[#F66F7D]/10 disabled:opacity-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-slate-400">No payment methods found.</p>
            </div>
          )}
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

      <Dialog open={isAddOpen} onOpenChange={handleAddOpenChange}>
        <DialogContent className="sm:max-w-lg bg-[#FFFFFF] dark:bg-[#2C2C2C]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardBrand">Card Brand</Label>
              <select
                id="cardBrand"
                value={cardBrand}
                onChange={(event) => setCardBrand(event.target.value as 'visa' | 'mastercard' | 'stripe')}
                className="h-[40px] w-full rounded-lg border border-input bg-[#F2F2F2] dark:bg-[#2C2C2C] px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={formatCardNumberInput(cardNumber)}
                onChange={(event) => setCardNumber(event.target.value.replace(/\D/g, '').slice(0, 16))}
                className="h-[40px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                inputMode="numeric"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(event) => setExpiryDate(formatExpiryInput(event.target.value))}
                className="h-[40px]"
              />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                inputMode="numeric"
                placeholder="123"
                value={cvv}
                onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
                className="h-[40px]"
              />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolderName">Card Holder Name</Label>
              <Input
                id="cardHolderName"
                placeholder="John Doe"
                value={cardHolderName}
                onChange={(event) => setCardHolderName(event.target.value)}
                className="h-[40px]"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddOpenChange(false)}
                disabled={createMutation.isPending}
                className='h-[40px]'
              >
                Cancel
              </Button>
              <Button type="submit" className='bg-[#F66F7D] h-[40px] text-white' disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Save Payment Method'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogContent className="sm:max-w-md bg-[#FFFFFF] dark:bg-[#2C2C2C]">
          <DialogHeader>
            <DialogTitle>Delete Payment Method</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Are you sure you want to delete this payment method? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDeleteOpenChange(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className='bg-red-600'
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
