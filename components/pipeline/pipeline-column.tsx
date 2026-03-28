'use client'

import { createClient } from '@/lib/supabase/client'
import { formatCurrency, stageLabel } from '@/lib/utils'
import { PriorityBadge, ScoreBadge } from '@/components/ui/badge'
import { Building2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Deal, DealStage } from '@/types'

interface Props {
  stage: DealStage
  deals: Deal[]
  color: string
  headerColor: string
  dotColor: string
}

export function PipelineColumn({ stage, deals, color, headerColor, dotColor }: Props) {
  const supabase = createClient()
  const router = useRouter()

  const moveToStage = async (dealId: string, newStage: DealStage) => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('deals').update({ stage: newStage }).eq('id', dealId)
    if (user) {
      await supabase.from('activities').insert({
        user_id: user.id,
        deal_id: dealId,
        type: 'stage_changed',
        description: `Moved deal to ${stageLabel(newStage)}`,
      })
    }
    router.refresh()
  }

  return (
    <div className={`flex flex-col rounded-xl border ${color} min-h-[300px]`}>
      {/* Column header */}
      <div className={`flex items-center gap-2 px-3 py-3 border-b ${headerColor}`}>
        <div className={`h-2 w-2 rounded-full ${dotColor}`} />
        <h3 className="text-xs font-semibold text-surface-700 flex-1">
          {stageLabel(stage)}
        </h3>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-surface-200/60 px-1.5 text-[11px] font-semibold text-surface-600">
          {deals.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-2 flex-1">
        {deals.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-xs text-surface-400 text-center">No deals</p>
          </div>
        )}

        {deals.map((deal) => (
          <div
            key={deal.id}
            className="group rounded-lg border border-surface-200 bg-white p-3 shadow-sm hover:shadow-md hover:border-surface-300 transition-all"
          >
            <Link href={`/deals/${deal.id}`} className="block mb-2.5">
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-50">
                  <Building2 size={13} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-surface-900 truncate group-hover:text-brand-600 transition-colors">
                    {deal.name}
                  </p>
                  {deal.industry && (
                    <p className="text-[10px] text-surface-400 truncate">
                      {deal.industry}
                    </p>
                  )}
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <PriorityBadge priority={deal.priority} />
                <ScoreBadge score={deal.final_score} />
              </div>
              <span className="text-[11px] font-medium text-surface-500">
                {formatCurrency(deal.estimated_value)}
              </span>
            </div>

            {/* Stage move controls */}
            <div className="mt-2.5 pt-2 border-t border-surface-50">
              <select
                defaultValue={stage}
                onChange={(e) => moveToStage(deal.id, e.target.value as DealStage)}
                className="w-full h-6 rounded-md border border-surface-200 bg-surface-50 px-1.5 text-[11px] text-surface-600 focus:outline-none focus:border-brand-500"
                onClick={(e) => e.stopPropagation()}
              >
                {(['interested', 'contacted', 'negotiating', 'closed', 'rejected'] as DealStage[]).map(
                  (s) => (
                    <option key={s} value={s}>
                      → {stageLabel(s)}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
