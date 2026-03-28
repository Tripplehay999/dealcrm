import { clsx, type ClassValue } from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'
import type { DealPriority, DealStage } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`
  return `$${value.toFixed(0)}`
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function stageLabel(stage: DealStage): string {
  const labels: Record<DealStage, string> = {
    interested: 'Interested',
    contacted: 'Contacted',
    negotiating: 'Negotiating',
    closed: 'Closed',
    rejected: 'Rejected',
  }
  return labels[stage]
}

export function priorityLabel(priority: DealPriority): string {
  const labels: Record<DealPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  }
  return labels[priority]
}

export const DEAL_STAGES: DealStage[] = [
  'interested',
  'contacted',
  'negotiating',
  'closed',
  'rejected',
]

export const DEAL_PRIORITIES: DealPriority[] = ['low', 'medium', 'high']

export const INDUSTRIES = [
  'SaaS / Analytics',
  'SaaS / Productivity',
  'SaaS / No-Code',
  'SaaS / Legal Tech',
  'AI / Content',
  'AI / Developer Tools',
  'PropTech / SaaS',
  'HealthTech / SaaS',
  'FinTech / SaaS',
  'DevOps / SaaS',
  'E-Commerce',
  'Marketplace',
  'Media / Newsletter',
  'Other',
]

export const ACQUISITION_TYPES = [
  'Asset Purchase',
  'Stock Purchase',
  'Merger',
  'Revenue Share',
  'Earnout',
  'Other',
]

export const SOURCES = [
  'Acquire.com',
  'MicroAcquire',
  'Quiet Light',
  'FE International',
  'Empire Flippers',
  'Twitter DM',
  'Inbound / Referral',
  'Cold outreach',
  'Broker',
  'Other',
]
