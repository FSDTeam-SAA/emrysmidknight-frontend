'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'

interface Sale {
  paymentId: string
  buyer: {
    fullName: string
    userName: string
  }
  blog: {
    title: string
  }
  authorAmount: number
  purchasedAt: string
}

interface SalesMeta {
  page: number
  limit: number
  total: number
}

interface SalesResponse {
  data: Sale[]
  meta?: SalesMeta
}

const PAGE_SIZE = 10

const buildPaginationItems = (currentPage: number, totalPages: number) => {
  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)
  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page)
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b)
  const items: Array<number | 'ellipsis'> = []
  let previousPage = 0

  for (const page of sortedPages) {
    if (page - previousPage > 1) {
      items.push('ellipsis')
    }
    items.push(page)
    previousPage = page
  }

  return items
}

export function TransactionsTable() {
  const [page, setPage] = useState(1)
  const session = useSession()
  const token = session.data?.user?.accessToken
  const isSessionLoading = session.status === 'loading'
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['author-sales', 'blog', page],
    enabled: session.status === 'authenticated' && Boolean(token),
    queryFn: async (): Promise<SalesResponse> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/author-sales?sortBy=purchasedAt&limit=${PAGE_SIZE}&page=${page}&paymentType=blog`,
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Return the data array from your API response
      return {
        data: result.data || [],
        meta: result.meta,
      }
    },
  })

  // Skeleton rows (10 rows to match limit)
  const isTableLoading = isLoading || isSessionLoading
  const skeletonRows = Array.from({ length: PAGE_SIZE })
  const totalItems = data?.meta?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const paginationItems = buildPaginationItems(page, totalPages)
  const rows = data?.data?.slice(0, PAGE_SIZE)

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) return
    if (nextPage < 1 || nextPage > totalPages) return
    if (isTableLoading) return
    setPage(nextPage)
  }

  if (isError) {
    return (
      <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-6 py-8 rounded-[8px] text-center text-red-500">
        Error loading transactions: {error?.message || 'Something went wrong'}
      </div>
    )
  }

  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-6 py-2 rounded-[8px] overflow-x-auto">
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
          {isTableLoading
            ? skeletonRows.map((_, index) => (
                <TableRow
                  key={index}
                  className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-transparent"
                >
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-64" />
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Skeleton className="h-5 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            : rows?.map((sale) => {
                const readerName =
                  sale.buyer.fullName?.trim() || sale.buyer.userName || 'Anonymous Reader'

                const formattedDate = sale.purchasedAt
                  ? format(new Date(sale.purchasedAt), 'dd MMM, yyyy')
                  : '—'

                return (
                  <TableRow
                    key={sale.paymentId}
                    className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-card/50 transition-colors"
                  >
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal py-4">
                      {readerName}
                    </TableCell>
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal py-4">
                      {sale.blog.title}
                    </TableCell>
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal text-right py-4">
                      ${sale.authorAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-base font-normal text-right py-4">
                      {formattedDate}
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>

      {!isTableLoading && (!rows || rows.length === 0) && (
        <div className="py-12 text-center text-[#2c2c2c] dark:text-[#FFFFFF]/70">
          No transactions found yet.
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-[#1E1E1E] dark:border-[#5E5E5E] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs sm:text-sm text-[#2c2c2c] dark:text-[#FFFFFF]/70">
          Page {page} of {totalPages}
        </p>
        <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="text-[#2c2c2c] dark:text-[#FFFFFF]"
                disabled={isTableLoading || page === 1}
                onClick={() => handlePageChange(page - 1)}
              />
            </PaginationItem>
            {paginationItems.map((item, index) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis className="text-[#2c2c2c] dark:text-[#FFFFFF]/70" />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    className="border-transparent bg-[#F66F7D] text-white hover:bg-[#F66F7D]/90"
                    isActive={item === page}
                    onClick={() => handlePageChange(item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                className="text-[#2c2c2c] dark:text-[#FFFFFF]"
                disabled={isTableLoading || page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
