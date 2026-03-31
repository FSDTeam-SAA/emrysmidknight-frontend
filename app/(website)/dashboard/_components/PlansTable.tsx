'use client';

import { useMemo, useState } from 'react';
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

interface Plan {
  id: string;
  name: string;
  reader: string[];
  amount: number;
}

const initialPlans: Plan[] = [
  {
    id: '1',
    name: 'All Access',
    reader: [
      'Access to all premium posts',
      'Access to all genres and story series',
      'Access to future premium content',
      'Early access to new chapters',
    ],
    amount: 90,
  },
  {
    id: '2',
    name: 'The Secret Library',
    reader: [
      'The Dark Forest – Chapter 1',
      'Galactic Wars – Prologue',
      'Moonlight Diary – Episode 3',
      'Shadows of the Kingdom – Part 2',
      'A Summer Tale – Chapter 5',
    ],
    amount: 30,
  },
  {
    id: '3',
    name: 'Hidden Chapters',
    reader: [
      'The Dark Forest – Chapter 1',
      'Galactic Wars – Prologue',
      'Moonlight Diary – Episode 3',
      'Shadows of the Kingdom – Part 2',
      'A Summer Tale – Chapter 5',
    ],
    amount: 50,
  },
];

export function PlansTable() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [plans, setPlans] = useState(initialPlans);
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
      id: String(plans.length + 1),
      name: data.planName,
      reader: data.contentAccess,
      amount: Number(data.price),
    };
    setPlans([...plans, newPlan]);
    console.log('New plan created:', newPlan);
  };

  const handleUpdatePlan = (data: SubscriptionData) => {
    if (!editingPlan) return;
    const updatedPlan: Plan = {
      ...editingPlan,
      name: data.planName,
      reader: data.contentAccess,
      amount: Number(data.price),
    };
    setPlans((prev) => prev.map((plan) => (plan.id === editingPlan.id ? updatedPlan : plan)));
    setIsEditModalOpen(false);
    setEditingPlanId(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingPlan) return;
    setPlans((prev) => prev.filter((plan) => plan.id !== deletingPlan.id));
    setIsDeleteModalOpen(false);
    setDeletingPlanId(null);
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
              {plans.map((plan) => (
                <TableRow
                  key={plan.id}
                  className="border-b border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-card/50 transition-colors"
                >
                  <TableCell className="dark:text-[#FFFFFF] text-[#2c2c2c] font-medium text-sm sm:text-base py-6">
                    {plan.name}
                  </TableCell>
                  <TableCell className="dark:text-[#FFFFFF] text-[#2c2c2c] text-xs sm:text-sm py-6">
                    <div className="space-y-1">
                      {plan.reader.map((item, idx) => (
                        <div key={idx}>{item}</div>
                      ))}
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
              ))}
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
                className="h-10 rounded-[8px] bg-[#E25757] text-white hover:bg-[#D94C4C]"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
