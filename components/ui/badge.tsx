import { cn } from '@/lib/utils'
import type { DealPriority, DealStage } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-brand-50 text-brand-700 ring-brand-200/60',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200/60',
  danger: 'bg-red-50 text-red-700 ring-red-200/60',
  info: 'bg-sky-50 text-sky-700 ring-sky-200/60',
  neutral: 'bg-surface-100 text-surface-600 ring-surface-200/60',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[11px] rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-md',
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium ring-1 ring-inset',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// Stage badge
const stageConfig: Record<DealStage, { label: string; variant: BadgeProps['variant'] }> = {
  interested: { label: 'Interested', variant: 'info' },
  contacted: { label: 'Contacted', variant: 'default' },
  negotiating: { label: 'Negotiating', variant: 'warning' },
  closed: { label: 'Closed', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
}

export function StageBadge({ stage }: { stage: DealStage }) {
  const config = stageConfig[stage]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Priority badge
const priorityConfig: Record<DealPriority, { label: string; variant: BadgeProps['variant'] }> = {
  low: { label: 'Low', variant: 'neutral' },
  medium: { label: 'Medium', variant: 'warning' },
  high: { label: 'High', variant: 'danger' },
}

export function PriorityBadge({ priority }: { priority: DealPriority }) {
  const config = priorityConfig[priority]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Score badge
export function ScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) return <span className="text-sm text-surface-400">—</span>

  const variant =
    score >= 75 ? 'success' : score >= 50 ? 'warning' : 'danger'

  return (
    <Badge variant={variant} size="md">
      {score}
    </Badge>
  )
}
