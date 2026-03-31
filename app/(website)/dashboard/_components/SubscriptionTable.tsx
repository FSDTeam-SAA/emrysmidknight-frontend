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
    <div className="w-full ">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Table Container */}
        <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] overflow-hidden   rounded-[8px] bg-card">
          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-[#5E5E5E]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-4 text-left text-xl font-semibold text-[#121212] dark:text-[#FFFFFF] w-1/4">
                    Reader
                  </TableHead>
                  <TableHead className="px-4 py-4 text-left text-xl font-semibold text-[#121212] dark:text-[#FFFFFF] w-1/3">
                    Plan
                  </TableHead>
                  <TableHead className="px-4 py-4 text-left text-xl font-semibold text-[#121212] dark:text-[#FFFFFF] w-1/6">
                    Amount
                  </TableHead>
                  <TableHead className="px-4 py-4 text-left text-xl font-semibold text-[#121212] dark:text-[#FFFFFF] w-1/4">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-[#1E1E1E] dark:border-[#5E5E5E] last:border- hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-4 py-4 text-base text-[#121212] dark:text-[#FFFFFF] font-medium">
                      {item.reader}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-base text-[#121212] dark:text-[#FFFFFF]">
                      {item.plan}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-base text-[#121212] dark:text-[#FFFFFF] font-medium">
                      {item.amount}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-base text-[#121212] dark:text-[#FFFFFF]">
                      {item.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View - Card Layout */}
          <div className="sm:hidden divide-y divide-border">
            {subscriptionData.map((item) => (
              <div
                key={item.id}
                className="px-4 py-4 space-y-2 hover:bg-muted/20 transition-colors"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Reader
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {item.reader}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Plan
                    </p>
                    <p className="text-sm text-foreground mt-1">
                      {item.plan}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {item.amount}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date
                    </p>
                    <p className="text-sm text-foreground mt-1">
                      {item.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
