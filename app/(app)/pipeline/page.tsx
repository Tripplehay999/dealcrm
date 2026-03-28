import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { PipelineColumn } from '@/components/pipeline/pipeline-column'
import { DEAL_STAGES } from '@/lib/utils'
import type { Deal, DealStage } from '@/types'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pipeline' }

const columnStyles: Record<DealStage, { color: string; headerColor: string; dotColor: string }> = {
  interested: {
    color: 'border-sky-200 bg-sky-50/30',
    headerColor: 'border-sky-100 bg-sky-50',
    dotColor: 'bg-sky-400',
  },
  contacted: {
    color: 'border-brand-200 bg-brand-50/30',
    headerColor: 'border-brand-100 bg-brand-50',
    dotColor: 'bg-brand-400',
  },
  negotiating: {
    color: 'border-amber-200 bg-amber-50/30',
    headerColor: 'border-amber-100 bg-amber-50',
    dotColor: 'bg-amber-400',
  },
  closed: {
    color: 'border-emerald-200 bg-emerald-50/30',
    headerColor: 'border-emerald-100 bg-emerald-50',
    dotColor: 'bg-emerald-400',
  },
  rejected: {
    color: 'border-surface-200 bg-surface-50/30',
    headerColor: 'border-surface-100 bg-surface-50',
    dotColor: 'bg-surface-300',
  },
}

export default async function PipelinePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const deals: Deal[] = data ?? []

  // Group by stage
  const byStage = DEAL_STAGES.reduce(
    (acc, stage) => ({
      ...acc,
      [stage]: deals.filter((d) => d.stage === stage),
    }),
    {} as Record<DealStage, Deal[]>
  )

  const totalValue = deals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)

  return (
    <div className="max-w-full">
      <PageHeader
        title="Pipeline"
        description={`${deals.length} active deal${deals.length !== 1 ? 's' : ''} across all stages`}
        action={
          <Link
            href="/deals/new"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            <Building2 size={14} />
            Add deal
          </Link>
        }
      />

      {/* Pipeline grid — horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-5 gap-3 min-w-[900px]">
          {DEAL_STAGES.map((stage) => (
            <PipelineColumn
              key={stage}
              stage={stage}
              deals={byStage[stage]}
              {...columnStyles[stage]}
            />
          ))}
        </div>
      </div>

      {/* Footer summary */}
      {deals.length > 0 && (
        <div className="mt-4 flex items-center gap-6 text-xs text-surface-500">
          <span>
            <strong className="text-surface-700">{deals.length}</strong> active deals
          </span>
          <span>
            <strong className="text-surface-700">
              ${(totalValue / 1_000_000).toFixed(1)}M
            </strong>{' '}
            est. total value
          </span>
        </div>
      )}
    </div>
  )
}
