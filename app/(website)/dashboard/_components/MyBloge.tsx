'use client'

import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface BlogItem {
  _id: string
  image?: string[]
  audio?: string[]
  attachment?: string[]
  category?: string
  title?: string
  content?: string
  audienceType?: 'free' | 'paid'
  price?: number
  createdAt?: string
  updatedAt?: string
  likes?: string[]
  comments?: string[]
}

interface BlogsMeta {
  page: number
  limit: number
  total: number
}

interface BlogsResponse {
  data: BlogItem[]
  meta?: BlogsMeta
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

const getPlainText = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export default function MyBlogs() {
  const [page, setPage] = useState(1)
  const [previewBlog, setPreviewBlog] = useState<BlogItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BlogItem | null>(null)
  const session = useSession()
  const token = session.data?.user?.accessToken
  const isSessionLoading = session.status === 'loading'
  const queryClient = useQueryClient()
  const router = useRouter()
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['my-blogs', page],
    enabled: session.status === 'authenticated' && Boolean(token),
    queryFn: async (): Promise<BlogsResponse> => {
      const response = await fetch(
        `${baseURL}/blog/my-blogs?limit=${PAGE_SIZE}&page=${page}`,
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

      return {
        data: result.data || [],
        meta: result.meta,
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error('Missing auth token')
      }

      const response = await fetch(`${baseURL}/blog/${id}` as string, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to delete blog')
      }

      return payload
    },
    onSuccess: (payload) => {
      toast.success(payload?.message || 'Blog deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog')
    },
  })

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

  const previewText = useMemo(() => {
    if (!previewBlog?.content) return ''
    return getPlainText(previewBlog.content).slice(0, 400)
  }, [previewBlog])

  const handleEdit = (id: string) => {
    router.push(`/edit-bloge/${id}`)
  }

  if (isError) {
    return (
      <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-6 py-8 rounded-[8px] text-center text-red-500">
        Error loading blogs: {error?.message || 'Something went wrong'}
      </div>
    )
  }

  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-4 sm:px-6 py-2 rounded-[8px] overflow-x-auto">
      <Table className="w-full min-w-[900px]">
        <TableHeader>
          <TableRow className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-transparent">
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl">
              Title
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl">
              Category
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl">
              Audience
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl text-right">
              Price
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl text-right">
              Created
            </TableHead>
            <TableHead className="text-[#121212] dark:text-[#FFFFFF] font-semibold text-lg sm:text-xl text-center w-28">
              Actions
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
                    <Skeleton className="h-5 w-64" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Skeleton className="h-5 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-2 justify-center">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : rows?.map((blog) => {
                const titleText = blog.title?.trim() || 'Untitled'
                const categoryText = blog.category?.trim() || 'Uncategorized'
                const audienceText = blog.audienceType === 'paid' ? 'Paid' : 'Free'
                const priceText =
                  blog.audienceType === 'paid'
                    ? `$${Number(blog.price ?? 0).toFixed(2)}`
                    : '—'
                const formattedDate = blog.createdAt
                  ? format(new Date(blog.createdAt), 'dd MMM, yyyy')
                  : '—'

                return (
                  <TableRow
                    key={blog._id}
                    className="border-[#1E1E1E] dark:border-[#5E5E5E] hover:bg-card/50 transition-colors"
                  >
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal py-4 max-w-[360px]">
                      <span className="truncate block">{titleText}</span>
                    </TableCell>
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal py-4">
                      {categoryText}
                    </TableCell>
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal py-4">
                      {audienceText}
                    </TableCell>
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal text-right py-4">
                      {priceText}
                    </TableCell>
                    <TableCell className="text-[#2c2c2c] dark:text-[#FFFFFF] text-sm sm:text-base font-normal text-right py-4">
                      {formattedDate}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-2 sm:gap-3 justify-center">
                        <button
                          onClick={() => setPreviewBlog(blog)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                          aria-label="View blog"
                        >
                          <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={() => handleEdit(blog._id)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                          aria-label="Edit blog"
                        >
                          <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(blog)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                          aria-label="Delete blog"
                        >
                          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>

      {!isTableLoading && (!rows || rows.length === 0) && (
        <div className="py-12 text-center text-[#2c2c2c] dark:text-[#FFFFFF]/70">
          No blogs found yet.
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

      <Dialog open={Boolean(previewBlog)} onOpenChange={(open) => !open && setPreviewBlog(null)}>
        <DialogContent className="w-full !max-w-[600px] rounded-lg bg-[#FFFFFF] p-4 text-[#121212] shadow-lg ring-0 dark:bg-[#2A2A2A] dark:text-white sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-semibold text-[#121212] dark:text-white">
              {previewBlog?.title?.trim() || 'Blog preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-[#6B6B6B] dark:text-[#B3B3B3]">
            <div className="flex flex-wrap gap-3">
              <span>
                Category:{' '}
                <span className="font-semibold text-[#121212] dark:text-white">
                  {previewBlog?.category || 'Uncategorized'}
                </span>
              </span>
              <span>
                Audience:{' '}
                <span className="font-semibold text-[#121212] dark:text-white">
                  {previewBlog?.audienceType === 'paid' ? 'Paid' : 'Free'}
                </span>
              </span>
              <span>
                Price:{' '}
                <span className="font-semibold text-[#121212] dark:text-white">
                  {previewBlog?.audienceType === 'paid'
                    ? `$${Number(previewBlog?.price ?? 0).toFixed(2)}`
                    : 'Free'}
                </span>
              </span>
            </div>
            <div className="text-[#2c2c2c] dark:text-[#FFFFFF]">
              {previewText || 'No content available.'}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="h-10 rounded-[8px]"
              onClick={() => setPreviewBlog(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="w-full max-w-sm rounded-lg bg-[#FFFFFF] p-4 text-[#121212] shadow-lg ring-0 dark:bg-[#2A2A2A] dark:text-white sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-semibold text-[#121212] dark:text-white">
              Delete Blog
            </DialogTitle>
            <p className="text-sm text-[#6B6B6B] dark:text-[#B3B3B3]">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[#121212] dark:text-white">
                {deleteTarget?.title?.trim() || 'this blog'}
              </span>
              ? This action cannot be undone.
            </p>
          </DialogHeader>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="h-10 rounded-[8px]"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
              disabled={deleteMutation.isPending}
              className="h-10 rounded-[8px] bg-[#E25757] text-white hover:bg-[#D94C4C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
