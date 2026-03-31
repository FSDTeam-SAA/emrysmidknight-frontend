'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Transaction {
  id: string
  reader: string
  post: string
  amount: string
  date: string
}

const transactions: Transaction[] = [
  {
    id: '1',
    reader: 'Ronald Richards',
    post: 'The Dark Forest – Chapter 1',
    amount: '$6.00',
    date: '21 Sep, 2020',
  },
  {
    id: '2',
    reader: 'Devon Lane',
    post: 'Galactic Wars – Prologue',
    amount: '$8.00',
    date: '8 Sep, 2020',
  },
  {
    id: '3',
    reader: 'Jenny Wilson',
    post: 'Moonlight Diary – Episode 3',
    amount: '$8.00',
    date: '24 May, 2020',
  },
  {
    id: '4',
    reader: 'Kathryn Murphy',
    post: 'Shadows of the Kingdom – Part 2',
    amount: '$3.00',
    date: '21 Sep, 2020',
  },
  {
    id: '5',
    reader: 'Robert Fox',
    post: 'A Summer Tale – Chapter 5',
    amount: '$4.00',
    date: '17 Oct, 2020',
  },
  {
    id: '6',
    reader: 'Darrell Steward',
    post: 'The Lost Expedition – Chapter 4',
    amount: '$8.00',
    date: '22 Oct, 2020',
  },
  {
    id: '7',
    reader: 'Bessie Cooper',
    post: 'AI Uprising – Episode 1',
    amount: '$2.00',
    date: '17 Oct, 2020',
  },
  {
    id: '8',
    reader: 'Brooklyn Simmons',
    post: 'Moonlight Diary – Episode 3',
    amount: '$1.00',
    date: '24 May, 2020',
  },
  {
    id: '9',
    reader: 'Kristin Watson',
    post: 'A Summer Tale – Chapter 5',
    amount: '$2.00',
    date: '24 May, 2020',
  },
  {
    id: '10',
    reader: 'Marvin McKinney',
    post: 'The Lost Expedition – Chapter 4',
    amount: '$3.00',
    date: '1 Feb, 2020',
  },
  {
    id: '11',
    reader: 'Jane Cooper',
    post: 'Shadows of the Kingdom – Part 2',
    amount: '$3.00',
    date: '17 Oct, 2020',
  },
]

export function TransactionsTable() {
  return (
    <div className="w-full  bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-6 py-2 rounded-[8px] overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-transparent">
            <TableHead className="dark:text-[#FFFFFF] font-semibold text-xl">
              Reader
            </TableHead>
            <TableHead className="dark:text-[#FFFFFF] font-semibold text-xl">
              Post
            </TableHead>
            <TableHead className="dark:text-[#FFFFFF] font-semibold text-xl text-right">
              Amount
            </TableHead>
            <TableHead className="dark:text-[#FFFFFF] font-semibold text-xl text-right">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-card/50 transition-colors"
            >
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal py-4">
                {transaction.reader}
              </TableCell>
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal py-4">
                {transaction.post}
              </TableCell>
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal text-right py-4">
                {transaction.amount}
              </TableCell>
              <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal text-right py-4">
                {transaction.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
