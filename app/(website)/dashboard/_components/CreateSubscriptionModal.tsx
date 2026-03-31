'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionData) => void;
}

export interface SubscriptionData {
  planName: string;
  price: string;
  contentAccess: string[];
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

export function CreateSubscriptionModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateSubscriptionModalProps) {
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

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
      <DialogContent className="w-full max-w-md sm:max-w-lg !bg-[#2A2A2A] border-none rounded-lg p-4 sm:p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-white">
            Create Subscriptions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Plan Name</label>
            <Input
              placeholder="The Secret Library"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="bg-transparent border border-[#4A4A4A] text-white placeholder:text-[#8B8B8B] focus:border-[#F66F7D] focus:outline-none rounded-[6px] px-3 py-2 text-sm sm:text-base h-10 sm:h-11"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8B] text-sm">
                $
              </span>
              <Input
                placeholder="50"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-transparent border border-[#4A4A4A] text-white placeholder:text-[#8B8B8B] focus:border-[#F66F7D] focus:outline-none rounded-[6px] px-3 py-2 pl-8 text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
          </div>

          {/* Content Access */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Content Access</label>
            <div className="space-y-2">
              {contentItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-2 rounded-[6px] hover:bg-[#3A3A3A] transition-colors"
                >
                  <Checkbox
                    id={item}
                    checked={selectedContent.includes(item)}
                    onCheckedChange={() => handleToggleContent(item)}
                    className="border-[#4A4A4A] bg-transparent"
                  />
                  <label
                    htmlFor={item}
                    className="text-sm text-white cursor-pointer flex-1"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-[#F66F7D] hover:bg-[#F66F7D]/80 text-white font-semibold h-10 sm:h-12 rounded-[8px] text-sm sm:text-base transition-colors mt-4"
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
