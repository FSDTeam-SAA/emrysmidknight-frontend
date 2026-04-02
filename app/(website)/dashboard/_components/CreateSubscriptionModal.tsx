/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export interface SubscriptionData {
  planName: string;
  price: string;
  contentAccess: string[];
  duration: string;
  features: string[];
  blogIds: string[];
}

interface BaseSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionData) => void;
  title: string;
  submitLabel: string;
  initialData?: SubscriptionData;
  mode: 'create' | 'edit';
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

interface BlogItem {
  _id: string;
  title?: string;
}

function SubscriptionModalBase({
  open,
  onOpenChange,
  onSubmit,
  title,
  submitLabel,
  initialData,
  mode,
}: BaseSubscriptionModalProps) {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('monthly');
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [selectedBlogIds, setSelectedBlogIds] = useState<string[]>([]);
  const [selectedBlogTitles, setSelectedBlogTitles] = useState<string[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isBlogsLoading, setIsBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentKey = (initialData?.contentAccess ?? []).join('|');
  const featureKey = (initialData?.features ?? []).join('|');
  const blogIdKey = (initialData?.blogIds ?? []).join('|');

  useEffect(() => {
    if (!open) return;
    setPlanName(initialData?.planName ?? '');
    setPrice(initialData?.price ?? '');
    setDuration(initialData?.duration ?? 'monthly');
    setFeatureInput('');
    setFeatures(initialData?.features ?? []);
    setSelectedBlogIds(initialData?.blogIds ?? []);
    setSelectedBlogTitles(initialData?.contentAccess ?? []);
  }, [
    open,
    initialData?.planName,
    initialData?.price,
    initialData?.duration,
    contentKey,
    featureKey,
    blogIdKey,
  ]);

  useEffect(() => {
    if (!open) return;
    if (!token) {
      setBlogs([]);
      setBlogsError('Missing auth token');
      return;
    }

    const controller = new AbortController();
    setIsBlogsLoading(true);
    setBlogsError(null);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/blog/my-blogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to load blogs');
        }
        const items = Array.isArray(data?.data) ? data.data : [];
        setBlogs(items);
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return;
        setBlogs([]);
        setBlogsError(
          error instanceof Error ? error.message : 'Failed to load blogs'
        );
      })
      .finally(() => {
        setIsBlogsLoading(false);
      });

    return () => controller.abort();
  }, [open, token]);

  const handleToggleContent = (id: string, title: string) => {
    const isSelected =
      selectedBlogIds.includes(id) || selectedBlogTitles.includes(title);

    if (isSelected) {
      setSelectedBlogIds((prev) => prev.filter((item) => item !== id));
      setSelectedBlogTitles((prev) => prev.filter((item) => item !== title));
      return;
    }

    setSelectedBlogIds((prev) => [...prev, id]);
    setSelectedBlogTitles((prev) =>
      prev.includes(title) ? prev : [...prev, title]
    );
  };

  const selectedTitles = useMemo(() => selectedBlogTitles, [selectedBlogTitles]);

  const addFeature = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    setFeatures((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
    setFeatureInput('');
  };

  const removeFeature = (value: string) => {
    setFeatures((prev) => prev.filter((item) => item !== value));
  };

  const handleSubmit = () => {
    if (!token) {
      toast.error('Missing auth token');
      return;
    }

    if (!planName.trim() || !price.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceValue = Number(price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!duration.trim()) {
      toast.error('Please select a duration');
      return;
    }

    const cleanFeatures = features.map((item) => item.trim()).filter(Boolean);

    const submissionData: SubscriptionData = {
      planName: planName.trim(),
      price: String(priceValue),
      contentAccess: selectedTitles,
      duration: duration.trim(),
      features: cleanFeatures,
      blogIds: selectedBlogIds,
    };

    if (mode === 'edit') {
      onSubmit(submissionData);
      return;
    }

    const payload = {
      name: submissionData.planName,
      price: priceValue,
      duration: submissionData.duration,
      features: submissionData.features,
      blogs: submissionData.blogIds,
    };

    setIsSubmitting(true);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to create subscription');
        }
        toast.success(data?.message || 'Subscription created successfully');

        onSubmit(submissionData);

        // Reset form
        setPlanName('');
        setPrice('');
        setDuration('monthly');
        setFeatureInput('');
        setFeatures([]);
        setSelectedBlogIds([]);
        setSelectedBlogTitles([]);
        onOpenChange(false);
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : 'Failed to create subscription'
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C2C2C] dark:text-white">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-10 w-full rounded-[6px] border border-[#D1D1D1] bg-white px-3 py-2 text-sm text-[#2C2C2C] focus:border-[#F66F7D] focus:outline-none dark:border-[#4A4A4A] dark:bg-[#2C2C2C] dark:text-white sm:h-11 sm:text-base"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C2C2C] dark:text-white">
              Features
            </label>
            <div className="flex flex-wrap items-center gap-2 rounded-[6px] border border-[#D1D1D1] bg-white px-2 py-2 text-sm text-[#2C2C2C] focus-within:border-[#F66F7D] dark:border-[#4A4A4A] dark:bg-[#2C2C2C] dark:text-white">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F66F7D]/10 px-3 py-1 text-xs text-[#F66F7D]"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="text-[10px] text-[#F66F7D] hover:text-[#F66F7D]/70"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault();
                    addFeature(featureInput);
                  }
                }}
                placeholder="Type a feature and press Enter"
                className="flex-1 bg-transparent px-2 py-1 text-sm text-[#2C2C2C] outline-none placeholder:text-[#9A9A9A] dark:text-white dark:placeholder:text-[#8B8B8B]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#9A9A9A] dark:text-[#8B8B8B]">
              <span>Press Enter or comma to add.</span>
              {featureInput.trim() ? (
                <button
                  type="button"
                  onClick={() => addFeature(featureInput)}
                  className="text-[#F66F7D]"
                >
                  Add
                </button>
              ) : null}
            </div>
          </div>

          {/* Content Access */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#2C2C2C] dark:text-white">
              Content Access
            </label>
            <div className="space-y-2">
              {isBlogsLoading || status === 'loading' ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex items-center gap-3 rounded-[6px] p-2"
                  >
                    <div className="h-4 w-4 rounded bg-[#E6E6E6] dark:bg-[#3A3A3A] animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-[#E6E6E6] dark:bg-[#3A3A3A] animate-pulse" />
                  </div>
                ))
              ) : blogsError ? (
                <p className="text-sm text-[#9A9A9A] dark:text-[#B3B3B3]">
                  {blogsError}
                </p>
              ) : blogs.length === 0 ? (
                <p className="text-sm text-[#9A9A9A] dark:text-[#B3B3B3]">
                  No blogs found.
                </p>
              ) : (
                blogs.map((blog) => {
                  const titleText = blog.title?.trim() || 'Untitled';
                  const isSelected =
                    selectedBlogIds.includes(blog._id) ||
                    selectedBlogTitles.includes(titleText);
                  return (
                    <div
                      key={blog._id}
                      className="flex items-center gap-3 rounded-[6px] p-2 transition-colors hover:bg-[#F5F5F5] dark:hover:bg-[#3A3A3A]"
                    >
                      <Checkbox
                        id={blog._id}
                        checked={isSelected}
                        onCheckedChange={() =>
                          handleToggleContent(blog._id, titleText)
                        }
                        className="border-[#D1D1D1] bg-white dark:border-[#4A4A4A] dark:bg-transparent"
                      />
                      <label
                        htmlFor={blog._id}
                        className="flex-1 cursor-pointer text-sm text-[#2C2C2C] dark:text-white"
                      >
                        {titleText}
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#F66F7D] hover:bg-[#F66F7D]/80 text-white font-semibold h-10 sm:h-12 rounded-[8px] text-sm sm:text-base transition-colors mt-4 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
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
      mode="create"
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
      mode="edit"
    />
  );
}
