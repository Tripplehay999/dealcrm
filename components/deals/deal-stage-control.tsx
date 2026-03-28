'use client'

import { createClient } from '@/lib/supabase/client'
import { DEAL_STAGES, stageLabel } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Deal, DealStage } from '@/types'
import { StageBadge } from '@/components/ui/badge'

interface Props {
  deal: Deal
}

export function DealStageControl({ deal }: Props) {
  const [moving, setMoving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const currentIndex = DEAL_STAGES.indexOf(deal.stage)

  const moveToStage = async (stage: DealStage) => {
    if (stage === deal.stage) return
    setMoving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('deals').update({ stage }).eq('id', deal.id)
    if (user) {
      await supabase.from('activities').insert({
        user_id: user.id,
        deal_id: deal.id,
        type: 'stage_changed',
        description: `Moved "${deal.name}" to ${stageLabel(stage)}`,
      })
    }
    router.refresh()
    setMoving(false)
  }

  return (
    <div className="flex items-center gap-1">
      <select
        value={deal.stage}
        onChange={(e) => moveToStage(e.target.value as DealStage)}
        disabled={moving}
        className="h-7 rounded-md border border-surface-200 bg-surface-50 px-2 text-xs text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50"
      >
        {DEAL_STAGES.map((s) => (
          <option key={s} value={s}>
            {stageLabel(s)}
          </option>
        ))}
      </select>
    </div>
  )
}
