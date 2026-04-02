'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import {
  CreateSubscriptionModal,
  EditSubscriptionModal,
  SubscriptionData,
} from './CreateSubscriptionModal';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  reader: string[];
  amount: number;
  duration?: string;
  features?: string[];
  blogIds?: string[];
}

interface SubscriptionBlog {
  _id: string;
  title?: string;
}

interface SubscriptionItem {
  _id: string;
  name?: string;
  price?: number;
  duration?: string;
  features?: string[];
  blogs?: SubscriptionBlog[];
}

export function PlansTable() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const authorId = session?.user?.id;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const editingPlan = useMemo(
    () => plans.find((plan) => plan.id === editingPlanId) ?? null,
    [plans, editingPlanId]
  );

  const deletingPlan = useMemo(
    () => plans.find((plan) => plan.id === deletingPlanId) ?? null,
    [plans, deletingPlanId]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['author-subscriptions', authorId],
    enabled: Boolean(token && authorId),
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber/author-subscriptions/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to load subscriptions');
      }
      return payload?.data as SubscriptionItem[] | undefined;
    },
  });

  useEffect(() => {
    if (!data) return;
    const mappedPlans: Plan[] = data.map((item) => ({
      id: item._id,
      name: item.name ?? 'Untitled',
      reader: (item.blogs ?? []).map((blog) => blog.title?.trim() || 'Untitled'),
      amount: Number(item.price ?? 0),
      duration: item.duration ?? 'monthly',
      features: item.features ?? [],
      blogIds: (item.blogs ?? []).map((blog) => blog._id),
    }));
    setPlans(mappedPlans);
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error('Missing auth token');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to delete subscription');
      }
      return payload;
    },
    onMutate: async (id) => {
      const previousPlans = plans;
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
      setIsDeleteModalOpen(false);
      setDeletingPlanId(null);
      return { previousPlans };
    },
    onSuccess: (payload) => {
      toast.success(payload?.message || 'Subscription deleted');
      queryClient.invalidateQueries({ queryKey: ['author-subscriptions', authorId] });
    },
    onError: (error, _id, context) => {
      if (context?.previousPlans) {
        setPlans(context.previousPlans);
      }
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete subscription'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SubscriptionData }) => {
      if (!token) {
        throw new Error('Missing auth token');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.planName,
            price: Number(data.price),
            duration: data.duration,
            features: data.features,
            blogs: data.blogIds,
          }),
        }
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to update subscription');
      }
      return payload;
    },
    onSuccess: (payload, variables) => {
      toast.success(payload?.message || 'Subscription updated');
      const updatedPlan: Plan = {
        id: variables.id,
        name: variables.data.planName,
        reader: variables.data.contentAccess,
        amount: Number(variables.data.price),
        duration: variables.data.duration,
        features: variables.data.features,
        blogIds: variables.data.blogIds,
      };
      setPlans((prev) =>
        prev.map((plan) => (plan.id === variables.id ? updatedPlan : plan))
      );
      queryClient.invalidateQueries({ queryKey: ['author-subscriptions', authorId] });
      setIsEditModalOpen(false);
      setEditingPlanId(null);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update subscription'
      );
    },
  });

  const handleEdit = (id: string) => {
    setEditingPlanId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingPlanId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCreatePlan = (data: SubscriptionData) => {
    const newPlan: Plan = {
      id: `temp-${Date.now()}`,
      name: data.planName,
      reader: data.contentAccess,
      amount: Number(data.price),
      duration: data.duration,
      features: data.features,
      blogIds: data.blogIds,
    };
    setPlans((prev) => [newPlan, ...prev]);
    queryClient.invalidateQueries({ queryKey: ['author-subscriptions', authorId] });
  };

  const handleUpdatePlan = (data: SubscriptionData) => {
    if (!editingPlan) return;
    if (updateMutation.isPending) return;
    updateMutation.mutate({ id: editingPlan.id, data });
  };

  const handleConfirmDelete = () => {
    if (!deletingPlan) return;
    if (deletingPlan.id.startsWith('temp-')) {
      setPlans((prev) => prev.filter((plan) => plan.id !== deletingPlan.id));
      setIsDeleteModalOpen(false);
      setDeletingPlanId(null);
      return;
    }
    deleteMutation.mutate(deletingPlan.id);
  };

  return (
    <div className="w-full ">
      <div className="w-full ">
        <div className="overflow-x-auto px-4 py-2 rounded-lg  bg-[#FFFFFF] dark:bg-[#FFFFFF0D] ">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-transparent">
                <TableHead className="text-[#2c2c2c] dark:text-[#FFFFFF] font-semibold text-sm sm:text-base">
                  Plan
                </TableHead>
                <TableHead className="text-[#2c2c2c] dark:text-[#FFFFFF] font-semibold text-sm sm:text-base">
                  Reader
                </TableHead>
                <TableHead className="text-[#2c2c2c] dark:text-[#FFFFFF] font-semibold text-sm sm:text-base text-right">
                  Amount
                </TableHead>
                <TableHead className="text-[#2c2c2c] dark:text-[#FFFFFF] font-semibold text-sm sm:text-base text-center w-20">
                    Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow
                    key={`skeleton-${index}`}
                    className="border-b border-[#1E1E1E] dark:border-[#5E5E5E]"
                  >
                    <TableCell className="py-6">
                      <div className="h-4 w-32 rounded bg-[#E6E6E6] dark:bg-[#3A3A3A] animate-pulse" />
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-2">
                        <div className="h-3 w-48 rounded bg-[#E6E6E6] dark:bg-[#3A3A3A] animate-pulse" />
                        <div className="h-3 w-40 rounded bg-[#E6E6E6] dark:bg-[#3A3A3A] animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="ml-auto h-4 w-16 rounded bg-[#E6E6E6] dark:bg-[#3A3A3A] animate-pulse" />
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="mx-auto h-8 w-16 rounded bg-[#E6E6E6] dark:bg-[#3A3A3A] animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-sm text-[#6B6B6B] dark:text-[#B3B3B3]">
                    {error instanceof Error ? error.message : 'Failed to load plans.'}
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-sm text-[#6B6B6B] dark:text-[#B3B3B3]">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow
                    key={plan.id}
                    className="border-b border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-card/50 transition-colors"
                  >
                    <TableCell className="dark:text-[#FFFFFF] text-[#2c2c2c] font-medium text-sm sm:text-base py-6">
                      {plan.name}
                    </TableCell>
                    <TableCell className="dark:text-[#FFFFFF] text-[#2c2c2c] text-xs sm:text-sm py-6">
                      <div className="space-y-1">
                        {plan.reader.length ? (
                          plan.reader.map((item, idx) => <div key={idx}>{item}</div>)
                        ) : (
                          <div className="text-[#9A9A9A] dark:text-[#B3B3B3]">No blogs</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-[#FFFFFF] text-[#2c2c2c]  font-semibold text-sm sm:text-base text-right py-6">
                      ${plan.amount}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex gap-2 sm:gap-3 justify-center">
                        <button
                          onClick={() => handleEdit(plan.id)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                          aria-label="Edit plan"
                        >
                          <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                          aria-label="Delete plan"
                        >
                          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add New Plan Button */}
        <div className="mt-6 sm:mt-8">
          <Button
            className="bg-[#F66F7D] hover:bg-[#F66F7D]/80 text-white font-semibold px-6 h-[48px] sm:px-8 rounded-[8px] transition-colors text-sm sm:text-base"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Plan
          </Button>
        </div>

        {/* Create Subscription Modal */}
        <CreateSubscriptionModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreatePlan}
        />

        {/* Edit Subscription Modal */}
        <EditSubscriptionModal
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open);
            if (!open) setEditingPlanId(null);
          }}
          onSubmit={handleUpdatePlan}
          initialData={
            editingPlan
              ? {
                  planName: editingPlan.name,
                  price: String(editingPlan.amount),
                  contentAccess: editingPlan.reader,
                  duration: editingPlan.duration ?? 'monthly',
                  features: editingPlan.features ?? [],
                  blogIds: editingPlan.blogIds ?? [],
                }
              : undefined
          }
        />

        {/* Delete Confirmation Modal */}
        <Dialog
          open={isDeleteModalOpen}
          onOpenChange={(open) => {
            setIsDeleteModalOpen(open);
            if (!open) setDeletingPlanId(null);
          }}
        >
          <DialogContent className="w-full max-w-sm rounded-lg bg-[#FFFFFF] p-4 text-[#121212] shadow-lg ring-0 dark:bg-[#2A2A2A] dark:text-white sm:p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg font-semibold text-[#121212] dark:text-white">
                Delete Plan
              </DialogTitle>
              <p className="text-sm text-[#6B6B6B] dark:text-[#B3B3B3]">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-[#121212] dark:text-white">
                  {deletingPlan?.name ?? 'this plan'}
                </span>
                ? This action cannot be undone.
              </p>
            </DialogHeader>

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="h-10 rounded-[8px]"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingPlanId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="h-10 rounded-[8px] bg-[#E25757] text-white hover:bg-[#D94C4C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
