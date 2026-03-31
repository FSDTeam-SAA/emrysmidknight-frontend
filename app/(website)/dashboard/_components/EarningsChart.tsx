'use client'

import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const chartData = [
  { date: '01', value: 32 },
  { date: '02', value: 35 },
  { date: '03', value: 38 },
  { date: '04', value: 40 },
  { date: '05', value: 42 },
  { date: '06', value: 41 },
  { date: '07', value: 43 },
  { date: '08', value: 45 },
  { date: '09', value: 47 },
  { date: '10', value: 50 },
  { date: '11', value: 52 },
  { date: '12', value: 55 },
  { date: '13', value: 58 },
  { date: '14', value: 61 },
  { date: '15', value: 64 },
  { date: '16', value: 67 },
  { date: '17', value: 70 },
  { date: '18', value: 73 },
  { date: '19', value: 76 },
  { date: '20', value: 78 },
  { date: '21', value: 80 },
  { date: '22', value: 81, highlight: true },
  { date: '23', value: 80 },
  { date: '24', value: 79 },
  { date: '25', value: 77 },
  { date: '26', value: 75 },
  { date: '27', value: 73 },
  { date: '28', value: 71 },
  { date: '29', value: 70 },
  { date: '30', value: 68 },
]

// eslint-disable-next-line
const CustomTooltip = (props: any) => {
  const { active, payload } = props

  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-700 border border-neutral-600 rounded px-3 py-2 shadow-lg">
        <p className="text-neutral-200 text-xs font-medium">
          {payload[0].payload.date} March
        </p>
        <p className="text-rose-400 text-sm font-bold">${payload[0].value}</p>
      </div>
    )
  }
  return null
}

export function EarningsChart() {
  return (
    <div className="bg-[#FFFFFF] dark:bg-[#FFFFFF0D] p-3 md:p-4 lg:p-6 rounded-[8px] [--chart-axis-text:#121212] dark:[--chart-axis-text:#FFFFFF]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
        <h2 className="text-[#121212] dark:text-[#FFFFFF] text-lg sm:text-xl md:text-2xl font-medium">
          Total Earnings
        </h2>

        <Button className="bg-[#F66F7D] hover:bg-rose-600 text-white px-4 h-[44px] md:h-[48px] rounded text-sm sm:text-base font-medium whitespace-nowrap w-full sm:w-auto">
          This Month
        </Button>
      </div>

      <div className="w-full h-64 sm:h-72 md:h-96 lg:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
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
              stroke="#3f3f3f"
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
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
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
      </div>
    </div>
  )
}