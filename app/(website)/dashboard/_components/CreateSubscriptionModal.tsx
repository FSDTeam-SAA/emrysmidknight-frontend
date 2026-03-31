'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface SubscriptionData {
  planName: string;
  price: string;
  contentAccess: string[];
}

interface BaseSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionData) => void;
  title: string;
  submitLabel: string;
  initialData?: SubscriptionData;
}

interface CreateSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionData) => void;
}

interface EditSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionData) => void;
  initialData?: SubscriptionData;
}

const contentItems = [
  'The Dark Forest – Chapter 1',
  'Galactic Wars – Prologue',
  'Moonlight Diary – Episode 3',
  'Shadows of the Kingdom – Part 2',
  'A Summer Tale – Chapter 5',
  'The Lost Expedition – Chapter 4',
  'AI Uprising – Episode 1',
  'The Last Dragon\'s Secret',
  'Time Loop Protocol',
  'The Last Signal',
  'The Beginning of the End',
];

function SubscriptionModalBase({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitLabel,
  initialData,
}: BaseSubscriptionModalProps) {
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const contentKey = (initialData?.contentAccess ?? []).join('|');

  useEffect(() => {
    if (!open) return;
    setPlanName(initialData?.planName ?? '');
    setPrice(initialData?.price ?? '');
    setSelectedContent(initialData?.contentAccess ?? []);
  }, [open, initialData?.planName, initialData?.price, contentKey]);

  const handleToggleContent = (item: string) => {
    setSelectedContent((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = () => {
    if (!planName.trim() || !price.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      planName,
      price,
      contentAccess: selectedContent,
    });

    // Reset form
    setPlanName('');
    setPrice('');
    setSelectedContent([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:max-w-lg rounded-lg bg-[#FFFFFF] p-4 text-[#121212] shadow-lg ring-0 dark:bg-[#2A2A2A] dark:text-white sm:p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl font-semibold text-[#121212] dark:text-white sm:text-2xl">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div
          data-scroll-lock-scrollable
          data-lenis-prevent
          className="no-scrollbar max-h-[60vh] space-y-5 overflow-y-auto overscroll-contain pr-2"
        >
          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C2C2C] dark:text-white">
              Plan Name
            </label>
            <Input
              placeholder="The Secret Library"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="h-10 rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-sm text-[#2C2C2C] placeholder:text-[#9A9A9A] focus:border-[#F66F7D] focus:outline-none dark:border-[#4A4A4A] dark:bg-[#2C2C2C] dark:text-white dark:placeholder:text-[#8B8B8B] sm:h-11 sm:text-base"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C2C2C] dark:text-white">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9A9A9A] dark:text-[#8B8B8B]">
                $
              </span>
              <Input
                placeholder="50"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-10 rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 pl-8 text-sm text-[#2C2C2C] placeholder:text-[#9A9A9A] focus:border-[#F66F7D] focus:outline-none dark:border-[#4A4A4A] dark:bg-[#2C2C2C] dark:text-white dark:placeholder:text-[#8B8B8B] sm:h-11 sm:text-base"
              />
            </div>
          </div>

          {/* Content Access */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#2C2C2C] dark:text-white">
              Content Access
            </label>
            <div className="space-y-2">
              {contentItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[6px] p-2 transition-colors hover:bg-[#F5F5F5] dark:hover:bg-[#3A3A3A]"
                >
                  <Checkbox
                    id={item}
                    checked={selectedContent.includes(item)}
                    onCheckedChange={() => handleToggleContent(item)}
                    className="border-[#D1D1D1] bg-white dark:border-[#4A4A4A] dark:bg-transparent"
                  />
                  <label
                    htmlFor={item}
                    className="flex-1 cursor-pointer text-sm text-[#2C2C2C] dark:text-white"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-[#F66F7D] hover:bg-[#F66F7D]/80 text-white font-semibold h-10 sm:h-12 rounded-[8px] text-sm sm:text-base transition-colors mt-4"
        >
          {submitLabel}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function CreateSubscriptionModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateSubscriptionModalProps) {
  return (
    <SubscriptionModalBase
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      title="Create Subscriptions"
      submitLabel="Create"
    />
  );
}

export function EditSubscriptionModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: EditSubscriptionModalProps) {
  return (
    <SubscriptionModalBase
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      title="Edit Subscription"
      submitLabel="Update"
      initialData={initialData}
    />
  );
}
