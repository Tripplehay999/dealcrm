import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { StageBadge, PriorityBadge, ScoreBadge } from '@/components/ui/badge'
import { PageHeader } from '@/components/layout/page-header'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatRelativeDate, DEAL_STAGES } from '@/lib/utils'
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import type { Deal } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { data: recentActivity } = await supabase
    .from('activities')
    .select('*, deal:deals(id, name)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const allDeals: Deal[] = deals ?? []

  // Compute stats
  const totalDeals = allDeals.length
  const activeDeals = allDeals.filter((d) => d.status === 'active').length
  const closedDeals = allDeals.filter((d) => d.stage === 'closed').length
  const highPriorityDeals = allDeals.filter((d) => d.priority === 'high').length
  const scoredDeals = allDeals.filter((d) => d.final_score != null)
  const averageScore =
    scoredDeals.length > 0
      ? Math.round(
          scoredDeals.reduce((sum, d) => sum + (d.final_score ?? 0), 0) /
            scoredDeals.length
        )
      : null
  const totalValue = allDeals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)

  // Stage breakdown
  const stageBreakdown = DEAL_STAGES.map((stage) => ({
    stage,
    count: allDeals.filter((d) => d.stage === stage).length,
  }))

  // Recent deals (top 5)
  const recentDeals = allDeals.slice(0, 5)

  const stats = [
    {
      label: 'Total Deals',
      value: totalDeals,
      icon: Building2,
      iconColor: 'text-brand-600',
      iconBg: 'bg-brand-50',
    },
    {
      label: 'Active Deals',
      value: activeDeals,
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Closed',
      value: closedDeals,
      icon: CheckCircle2,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
    },
    {
      label: 'High Priority',
      value: highPriorityDeals,
      icon: Star,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'Avg. Score',
      value: averageScore != null ? averageScore : '—',
      icon: BarChart3,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50',
    },
    {
      label: 'Est. Total Value',
      value: formatCurrency(totalValue),
      icon: TrendingUp,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
  ]

  const stageColors: Record<string, string> = {
    interested: 'bg-sky-500',
    contacted: 'bg-brand-500',
    negotiating: 'bg-amber-500',
    closed: 'bg-emerald-500',
    rejected: 'bg-surface-300',
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Your acquisition pipeline at a glance."
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent deals */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="px-5 pt-5 pb-0">
              <CardTitle>Recent Deals</CardTitle>
              <Link
                href="/deals"
                className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            </CardHeader>

            {recentDeals.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No deals yet"
                description="Add your first acquisition target to get started."
                action={
                  <Link
                    href="/deals/new"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-medium text-white hover:bg-brand-700"
                  >
                    Add your first deal
                  </Link>
                }
              />
            ) : (
              <div className="mt-4">
                {recentDeals.map((deal, i) => (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors border-t border-surface-100 first:border-0"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 shrink-0">
                      <Building2 size={14} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {deal.name}
                      </p>
                      <p className="text-xs text-surface-400 truncate">
                        {deal.industry ?? 'No industry'} · {formatRelativeDate(deal.updated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StageBadge stage={deal.stage} />
                      <ScoreBadge score={deal.final_score} />
                      <span className="text-xs font-medium text-surface-500">
                        {formatCurrency(deal.estimated_value)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Pipeline breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline</CardTitle>
              <Link
                href="/pipeline"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View board
              </Link>
            </CardHeader>
            {totalDeals === 0 ? (
              <p className="text-sm text-surface-400 text-center py-4">
                No deals in pipeline
              </p>
            ) : (
              <div className="space-y-2.5">
                {stageBreakdown.map(({ stage, count }) => (
                  <div key={stage} className="flex items-center gap-2.5">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${stageColors[stage]}`}
                    />
                    <span className="flex-1 text-xs text-surface-600 capitalize">
                      {stage}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 rounded-full ${stageColors[stage]} opacity-30`}
                        style={{
                          width: totalDeals > 0 ? `${(count / totalDeals) * 64}px` : '0',
                        }}
                      />
                      <span className="text-xs font-semibold text-surface-700 tabular-nums w-4 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            {!recentActivity || recentActivity.length === 0 ? (
              <p className="text-sm text-surface-400 text-center py-4">
                No recent activity
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-100">
                      <Clock size={10} className="text-surface-400" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-700 leading-relaxed">
                        {activity.description}
                      </p>
                      <p className="text-[11px] text-surface-400 mt-0.5">
                        {formatRelativeDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
