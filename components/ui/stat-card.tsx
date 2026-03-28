import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  delta?: string
  deltaPositive?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-brand-600',
  iconBg = 'bg-brand-50',
  delta,
  deltaPositive,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-surface-200 bg-white p-5 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">
            {label}
          </span>
          <span className="text-2xl font-bold text-surface-900 tabular-nums">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                'text-xs font-medium',
                deltaPositive ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {delta}
            </span>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </div>
  )
}
