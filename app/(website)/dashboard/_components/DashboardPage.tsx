'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'
import { EarningsChart } from './EarningsChart'
import { StatCard } from './StatCard'

interface Trend {
  percentage: number
  direction: 'up' | 'down'
}

interface OverviewMetric {
  value: number
  trend: Trend
}

interface DashboardOverviewData {
  overview: {
    totalPosts: OverviewMetric
    premiumPosts: OverviewMetric
    totalUnlocks: OverviewMetric
    totalEarnings: OverviewMetric
  }
  chart: {
    label: string
    summary: {
      total: number
      previous: number
    }
    points: Array<{
      day: string
      amount: number
    }>
  }
}

interface DashboardOverviewResponse {
  statusCode: number
  success: boolean
  message: string
  data: DashboardOverviewData
}

const MONTH_OPTIONS = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
]

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`stat-skeleton-${index}`}
            className="bg-[#FFFFFF] dark:bg-[#FFFFFF0D] rounded-[8px] p-6"
          >
            <div className="space-y-4">
              <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-end justify-between">
                <Skeleton className="h-8 w-20 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-14 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#FFFFFF0D] p-3 md:p-4 lg:p-6 rounded-[8px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-3 w-56 bg-gray-200 dark:bg-gray-700" />
          </div>
          <Skeleton className="h-[44px] md:h-[48px] w-28 bg-gray-200 dark:bg-gray-700" />
        </div>
        <Skeleton className="h-[260px] sm:h-72 md:h-96 lg:h-[420px] w-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)

type TrendDirection = 'up' | 'down'

const buildChange = (
  trend?: Trend
): { direction: TrendDirection; text: string; colorClass: string } => {
  const direction: TrendDirection = trend?.direction === 'down' ? 'down' : 'up'
  const percentage =
    typeof trend?.percentage === 'number' ? Math.abs(trend.percentage) : 0
  return {
    direction,
    text: `${direction === 'down' ? '-' : '+'}${percentage}%`,
    colorClass:
      direction === 'down'
        ? 'text-[#7D7D7D] dark:text-[#B3B3B3]'
        : 'text-rose-500',
  }
}

export default function DashboardPage() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const { data: session, status } = useSession()
  const token = session?.user?.accessToken
  const isSessionLoading = status === 'loading'
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL
  const yearOptions = useMemo(() => {
    const startYear = currentYear - 5
    const endYear = currentYear + 1
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    )
  }, [currentYear])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-overview', selectedYear, selectedMonth, token],
    enabled: status !== 'loading' && Boolean(token),
    queryFn: async (): Promise<DashboardOverviewResponse> => {
      if (!token) throw new Error('Missing auth token')
      if (!baseURL) throw new Error('Missing backend API URL')
      const url = `${baseURL}/dashboard/overview?year=${selectedYear}&month=${selectedMonth}`
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await res.json().catch(() => null)
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to fetch dashboard overview')
      }
      return result as DashboardOverviewResponse
    },
  })

  const overview = data?.data?.overview
  const chart = data?.data?.chart
  const chartData = useMemo(() => {
    const points = chart?.points ?? []
    return points.map((point) => ({
      date: point.day,
      value: Number(point.amount) || 0,
    }))
  }, [chart])

  const stats = useMemo(() => {
    const buildStat = (
      label: string,
      metric: OverviewMetric | undefined,
      isCurrency = false
    ) => {
      const value = typeof metric?.value === 'number' ? metric.value : 0
      const change = buildChange(metric?.trend)
      return {
        label,
        value: isCurrency ? `$${formatNumber(value)}` : formatNumber(value),
        change: change.text,
        changeColor: change.colorClass,
        direction: change.direction,
      }
    }

    return [
      buildStat('Total Posts', overview?.totalPosts),
      buildStat('Premium Posts', overview?.premiumPosts),
      buildStat('Total Unlocks', overview?.totalUnlocks),
      buildStat('Total Earnings', overview?.totalEarnings, true),
    ]
  }, [overview])

  const fallbackLabel = `${MONTH_OPTIONS.find((m) => m.value === selectedMonth)?.label ?? ''} ${selectedYear}`
  const chartLabel = chart?.label || fallbackLabel
  const isBusy = isLoading || isSessionLoading

  return (
    <main className="min-h-screen ">
      <div className="p-0 md:p-8 lg:p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-xs text-[#7D7D7D] dark:text-[#B3B3B3]">
              Overview for
            </p>
            <p className="text-sm sm:text-base font-medium text-[#121212] dark:text-white">
              {chartLabel}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(Number(event.target.value))}
              className="h-[44px] md:h-[48px] w-full sm:w-[140px] rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-sm text-[#2C2C2C] focus:border-[#F66F7D] focus:outline-none dark:border-[#4A4A4A] dark:bg-[#2C2C2C] dark:text-white sm:text-base"
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="h-[44px] md:h-[48px] w-full sm:w-[120px] rounded-[6px] border border-[#D1D1D1] bg-white px-3 text-sm text-[#2C2C2C] focus:border-[#F66F7D] focus:outline-none dark:border-[#4A4A4A] dark:bg-[#2C2C2C] dark:text-white sm:text-base"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isBusy ? (
          <DashboardSkeleton />
        ) : isError ? (
          <div className="w-full bg-[#FFFFFF] dark:bg-[#FFFFFF0D] px-6 py-8 rounded-[8px] text-center text-red-500">
            Error loading dashboard overview: {error?.message || 'Something went wrong'}
          </div>
        ) : !token ? (
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300">
            Please sign in to view your dashboard overview.
          </p>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  changeColor={stat.changeColor}
                  direction={stat.direction}
                />
              ))}
            </div>

            {/* Earnings Chart */}
            <EarningsChart data={chartData} label={chartLabel} summary={chart?.summary} />
          </>
        )}
      </div>
    </main>
  )
}
