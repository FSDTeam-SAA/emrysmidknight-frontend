'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SubscriptionData {
  id: string
  reader: string
  plan: string
  amount: string
  date: string
}

const subscriptionData: SubscriptionData[] = [
  {
    id: '1',
    reader: 'Jenny Wilson',
    plan: 'All Access',
    amount: '€90',
    date: '24 May, 2020',
  },
  {
    id: '2',
    reader: 'Ronald Richards',
    plan: 'Limited Post Access',
    amount: '€30',
    date: '21 Sep, 2020',
  },
  {
    id: '3',
    reader: 'Devon Lane',
    plan: 'Selected Post Access',
    amount: '€50',
    date: '8 Sep, 2020',
  },
  {
    id: '4',
    reader: 'Kathryn Murphy',
    plan: 'Limited Post Access',
    amount: '€30',
    date: '21 Sep, 2020',
  },
  {
    id: '5',
    reader: 'Darrell Steward',
    plan: 'All Access',
    amount: '€90',
    date: '22 Oct, 2020',
  },
  {
    id: '6',
    reader: 'Robert Fox',
    plan: 'Selected Post Access',
    amount: '€50',
    date: '17 Oct, 2020',
  },
  {
    id: '7',
    reader: 'Kristin Watson',
    plan: 'All Access',
    amount: '€90',
    date: '24 May, 2020',
  },
  {
    id: '8',
    reader: 'Brooklyn Simmons',
    plan: 'Selected Post Access',
    amount: '€50',
    date: '24 May, 2020',
  },
  {
    id: '9',
    reader: 'Marvin McKinney',
    plan: 'Limited Post Access',
    amount: '€30',
    date: '1 Feb, 2020',
  },
  {
    id: '10',
    reader: 'Jane Cooper',
    plan: 'All Access',
    amount: '€90',
    date: '17 Oct, 2020',
  },
]

export default function SubscriptionTable() {
  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-4 sm:px-6 py-2 rounded-[8px] overflow-x-auto">
      <Table className="w-full min-w-[700px]">
        <TableHeader>
          <TableRow className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-transparent">
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl">
              Reader
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl">
              Plan
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl text-right">
              Amount
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl text-right">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {subscriptionData.map((item) => (
            <TableRow
              key={item.id}
              className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-card/50 transition-colors"
            >
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal py-4">
                {item.reader}
              </TableCell>
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal py-4">
                {item.plan}
              </TableCell>
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal text-right py-4">
                {item.amount}
              </TableCell>
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal text-right py-4">
                {item.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}