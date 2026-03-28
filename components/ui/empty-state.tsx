import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 mb-4">
        <Icon size={24} className="text-surface-400" />
      </div>
      <h3 className="text-sm font-semibold text-surface-900 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
