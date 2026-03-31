'use client'

import { EarningsChart } from "./EarningsChart"
import { StatCard } from "./StatCard"

export default function DashboardPage() {
  const stats = [
    {
      label: 'Total Posts',
      value: '36',
      change: '+36%',
      changeColor: 'text-rose-500'
    },
    {
      label: 'Premium Posts',
      value: '21',
      change: '+57%',
      changeColor: 'text-rose-500'
    },
    {
      label: 'Total Unlocks',
      value: '230',
      change: '+83%',
      changeColor: 'text-rose-500'
    },
    {
      label: 'Total Earnings',
      value: '$520',
      change: '+36%',
      changeColor: 'text-rose-500'
    }
  ]

  return (
    <main className="min-h-screen ">
      <div className="p-6 md:p-8 lg:p-0">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              changeColor={stat.changeColor}
            />
          ))}
        </div>

        {/* Earnings Chart */}
        <EarningsChart />
      </div>
    </main>
  )
}
