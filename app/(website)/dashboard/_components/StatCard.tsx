
import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  change: string
  changeColor: string
}

export function StatCard({ label, value, change, changeColor }: StatCardProps) {
  return (
    <div className="bg-[#FFFFFF] dark:bg-[#FFFFFF0D]  rounded-[8px]  p-6 hover:bg-neutral-750 transition-colors shadow-md dark:shadow-none">
      <div className="flex flex-col space-y-4">
        <p className="text-[#2C2C2C] dark:text-[#F2F2F2] text-xl md:text-2xl font-medium">{label}</p>
        
        <div className="flex items-end justify-between">
          <h3 className="text-[#121212] dark:text-white text-2xl md:text-4xl font-semibold tracking-tight">
            {value}
          </h3>
          
          <div className={`flex items-center gap-1 ${changeColor} text-sm font-medium`}>
            <span>{change}</span>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
