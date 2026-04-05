'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartPoint {
  date: string
  value: number
}

interface EarningsChartProps {
  data: ChartPoint[]
  label?: string
  summary?: {
    total?: number
    previous?: number
  }
}

export function EarningsChart({ data, label, summary }: EarningsChartProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
  const safeData = Array.isArray(data) ? data : []
  const maxValue = safeData.reduce(
    (max, point) => Math.max(max, Number(point.value) || 0),
    0
  )
  const roundedMax = Math.max(10, Math.ceil(maxValue / 10) * 10)
  const tickStep = Math.max(2, Math.round(roundedMax / 5))
  const ticks = Array.from({ length: 6 }, (_, index) => index * tickStep)
  const summaryParts: string[] = []

  if (summary?.total !== undefined)
    summaryParts.push(`Total ${formatNumber(summary.total)}`)
  if (summary?.previous !== undefined)
    summaryParts.push(`Previous ${formatNumber(summary.previous)}`)

  const summaryText = summaryParts.join(' · ')

  // eslint-disable-next-line
  const CustomTooltip = (props: any) => {
    const { active, payload } = props

    if (active && payload && payload.length) {
      const dateLabel = label
        ? `${payload[0].payload.date} ${label}`
        : payload[0].payload.date
      return (
        <div className="bg-neutral-700 border border-neutral-600 rounded px-3 py-2 shadow-lg">
          <p className="text-neutral-200 text-xs font-medium">{dateLabel}</p>
          <p className="text-rose-400 text-sm font-bold">${payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#FFFFFF0D] p-3 md:p-4 lg:p-6 rounded-[8px] [--chart-axis-text:#121212] dark:[--chart-axis-text:#FFFFFF] [--chart-grid:#D7D7D7] dark:[--chart-grid:#3f3f3f]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-[#121212] dark:text-[#FFFFFF] text-lg sm:text-xl md:text-2xl font-medium">
            Total Earnings
          </h2>
          {summaryText ? (
            <p className="mt-1 text-xs text-[#7D7D7D] dark:text-[#B3B3B3]">
              {summaryText}
            </p>
          ) : null}
        </div>

        {label ? (
          <div className="bg-[#F66F7D]/10 text-[#F66F7D] px-4 h-[44px] md:h-[48px] rounded text-sm sm:text-base font-medium whitespace-nowrap flex items-center justify-center w-full sm:w-auto">
            {label}
          </div>
        ) : null}
      </div>

      <div className="w-full h-64 sm:h-72 md:h-96 lg:h-[420px]">
        {safeData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#7D7D7D] dark:text-[#B3B3B3]">
            No earnings data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={safeData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#991b1b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7f1d1d" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="0"
                stroke="var(--chart-grid)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#F66F7D"
                tick={{ fill: 'var(--chart-axis-text)', fontSize: 12 }}
                axisLine={{ stroke: '#404040' }}
                tickLine={false}
                minTickGap={18}
                interval="preserveStartEnd"
              />

              <YAxis
                stroke="#F66F7D"
                tick={{ fill: 'var(--chart-axis-text)', fontSize: 12 }}
                axisLine={{ stroke: '#404040' }}
                tickLine={false}
                domain={[0, roundedMax]}
                ticks={ticks}
                width={40}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#F66F7D"
                strokeWidth={2.5}
                dot={false}
                fill="url(#colorValue)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
