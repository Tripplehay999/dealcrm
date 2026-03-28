import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { StatCard } from '@/components/ui/stat-card'
import { formatCurrency, DEAL_STAGES, stageLabel, DEAL_PRIORITIES, priorityLabel } from '@/lib/utils'
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { Deal, DealPriority, DealStage } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user!.id)

  const deals: Deal[] = data ?? []
  const activeDeals = deals.filter((d) => d.status === 'active')
  const closedDeals = deals.filter((d) => d.stage === 'closed')
  const highPriority = deals.filter((d) => d.priority === 'high')

  const scoredDeals = deals.filter((d) => d.final_score != null)
  const avgScore =
    scoredDeals.length > 0
      ? Math.round(
          scoredDeals.reduce((sum, d) => sum + (d.final_score ?? 0), 0) / scoredDeals.length
        )
      : null

  const totalValue = activeDeals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)
  const closedValue = closedDeals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)

  // Stage breakdown
  const stageData = DEAL_STAGES.map((stage) => ({
    stage,
    label: stageLabel(stage),
    count: activeDeals.filter((d) => d.stage === stage).length,
    value: activeDeals
      .filter((d) => d.stage === stage)
      .reduce((sum, d) => sum + (d.estimated_value ?? 0), 0),
  }))
  const maxStageCount = Math.max(...stageData.map((s) => s.count), 1)

  // Priority breakdown
  const priorityData = DEAL_PRIORITIES.map((priority) => ({
    priority,
    label: priorityLabel(priority),
    count: activeDeals.filter((d) => d.priority === priority).length,
  }))
  const maxPriorityCount = Math.max(...priorityData.map((p) => p.count), 1)

  // Score distribution
  const scoreRanges = [
    { label: '75–100 (Strong)', min: 75, max: 100, color: 'bg-emerald-500' },
    { label: '50–74 (Moderate)', min: 50, max: 74, color: 'bg-amber-500' },
    { label: '25–49 (Weak)', min: 25, max: 49, color: 'bg-orange-500' },
    { label: '0–24 (Poor)', min: 0, max: 24, color: 'bg-red-500' },
  ]
  const scoreDist = scoreRanges.map((range) => ({
    ...range,
    count: scoredDeals.filter(
      (d) => (d.final_score ?? 0) >= range.min && (d.final_score ?? 0) <= range.max
    ).length,
  }))
  const maxScoreCount = Math.max(...scoreDist.map((s) => s.count), 1)

  // Industry breakdown (top 5)
  const industryMap: Record<string, number> = {}
  activeDeals.forEach((d) => {
    if (d.industry) {
      industryMap[d.industry] = (industryMap[d.industry] ?? 0) + 1
    }
  })
  const topIndustries = Object.entries(industryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxIndustryCount = Math.max(...topIndustries.map(([, n]) => n), 1)

  const stats = [
    { label: 'Total Deals', value: deals.length, icon: Building2, iconColor: 'text-brand-600', iconBg: 'bg-brand-50' },
    { label: 'Active', value: activeDeals.length, icon: TrendingUp, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { label: 'Closed', value: closedDeals.length, icon: CheckCircle2, iconColor: 'text-sky-600', iconBg: 'bg-sky-50' },
    { label: 'High Priority', value: highPriority.length, icon: Star, iconColor: 'text-amber-600', iconBg: 'bg-amber-50' },
    { label: 'Avg. Score', value: avgScore ?? '—', icon: BarChart3, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
    { label: 'Pipeline Value', value: formatCurrency(totalValue), icon: Zap, iconColor: 'text-rose-600', iconBg: 'bg-rose-50' },
  ]

  const stageColors: Record<DealStage, string> = {
    interested: 'bg-sky-500',
    contacted: 'bg-brand-500',
    negotiating: 'bg-amber-500',
    closed: 'bg-emerald-500',
    rejected: 'bg-surface-300',
  }

  const priorityColors: Record<DealPriority, string> = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-surface-300',
  }

  if (deals.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <PageHeader title="Analytics" description="Metrics and trends across your deal pipeline." />
        <div className="rounded-xl border border-surface-200 bg-white">
          <EmptyState
            icon={BarChart3}
            title="No data yet"
            description="Add deals to your pipeline to start seeing analytics."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Analytics"
        description="Metrics and trends across your deal pipeline."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Stage breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Deals by stage</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {stageData.map(({ stage, label, count, value }) => (
              <div key={stage}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${stageColors[stage]}`} />
                    <span className="text-xs text-surface-600">{label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-surface-400">{formatCurrency(value)}</span>
                    <span className="text-xs font-semibold text-surface-700 w-4 text-right tabular-nums">
                      {count}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-100">
                  <div
                    className={`h-2 rounded-full ${stageColors[stage]} transition-all`}
                    style={{ width: `${(count / maxStageCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Priority breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Deals by priority</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {priorityData.map(({ priority, label, count }) => (
              <div key={priority}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${priorityColors[priority]}`} />
                    <span className="text-xs text-surface-600">{label}</span>
                  </div>
                  <span className="text-xs font-semibold text-surface-700 tabular-nums">
                    {count}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-100">
                  <div
                    className={`h-2 rounded-full ${priorityColors[priority]}`}
                    style={{ width: `${(count / maxPriorityCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Value summary */}
          <div className="mt-5 pt-4 border-t border-surface-100 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-50 px-3 py-2.5">
              <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">
                Active pipeline
              </p>
              <p className="text-lg font-bold text-surface-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">
                Closed value
              </p>
              <p className="text-lg font-bold text-emerald-700">{formatCurrency(closedValue)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Score distribution */}
        {scoredDeals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score distribution</CardTitle>
              <span className="text-xs text-surface-500">
                {scoredDeals.length} scored deal{scoredDeals.length !== 1 ? 's' : ''}
              </span>
            </CardHeader>
            <div className="space-y-3">
              {scoreDist.map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-surface-600">{label}</span>
                    <span className="text-xs font-semibold text-surface-700 tabular-nums">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-100">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${(count / maxScoreCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs text-surface-500">Average score</span>
              <span className="text-2xl font-bold text-surface-900 tabular-nums">
                {avgScore ?? '—'}
              </span>
            </div>
          </Card>
        )}

        {/* Industry breakdown */}
        {topIndustries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top industries</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {topIndustries.map(([industry, count]) => (
                <div key={industry}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-surface-600 truncate">{industry}</span>
                    <span className="text-xs font-semibold text-surface-700 tabular-nums ml-2">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-100">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${(count / maxIndustryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
