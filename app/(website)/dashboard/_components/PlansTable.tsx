'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { CreateSubscriptionModal, SubscriptionData } from './CreateSubscriptionModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState(initialPlans);

  const handleEdit = (id: string) => {
    console.log('Edit plan:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete plan:', id);
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
            onClick={() => setIsModalOpen(true)}
          >
            Add New Plan
          </Button>
        </div>

        {/* Create Subscription Modal */}
        <CreateSubscriptionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleCreatePlan}
        />
      </div>
    </div>
  );
}
