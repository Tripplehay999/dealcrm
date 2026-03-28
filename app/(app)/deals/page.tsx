import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatRelativeDate, stageLabel } from '@/lib/utils'
import { StageBadge, PriorityBadge, ScoreBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/layout/page-header'
import { Building2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Deal, DealStage, DealPriority } from '@/types'
import type { Metadata } from 'next'
import { DealsFilterBar } from '@/components/deals/deals-filter-bar'

export const metadata: Metadata = { title: 'Deals' }

interface SearchParams {
  stage?: string
  priority?: string
  sort?: string
  q?: string
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let query = supabase
    .from('deals')
    .select('*')
    .eq('user_id', user!.id)

  if (params.stage && params.stage !== 'all') {
    query = query.eq('stage', params.stage)
  }
  if (params.priority && params.priority !== 'all') {
    query = query.eq('priority', params.priority)
  }

  const sortField = params.sort ?? 'created_at'
  const validSorts: Record<string, { column: string; ascending: boolean }> = {
    newest: { column: 'created_at', ascending: false },
    oldest: { column: 'created_at', ascending: true },
    score: { column: 'final_score', ascending: false },
    value: { column: 'estimated_value', ascending: false },
    name: { column: 'name', ascending: true },
  }
  const sort = validSorts[sortField] ?? validSorts.newest
  query = query.order(sort.column, { ascending: sort.ascending })

  const { data } = await query
  let deals: Deal[] = data ?? []

  // Client-side text search (Supabase ilike for search)
  if (params.q) {
    const q = params.q.toLowerCase()
    deals = deals.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.industry?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Deals"
        description={`${deals.length} deal${deals.length !== 1 ? 's' : ''} in your pipeline`}
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

      <DealsFilterBar currentParams={params} />

      {deals.length === 0 ? (
        <div className="mt-4 rounded-xl border border-surface-200 bg-white">
          <EmptyState
            icon={Building2}
            title={params.q || params.stage || params.priority ? 'No deals match your filters' : 'No deals yet'}
            description={
              params.q || params.stage || params.priority
                ? 'Try adjusting your filters or search query.'
                : 'Add your first acquisition target to start building your pipeline.'
            }
            action={
              !params.q && !params.stage && !params.priority ? (
                <Link
                  href="/deals/new"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-medium text-white hover:bg-brand-700"
                >
                  Add your first deal
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-surface-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">
                  Stage
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">
                  Priority
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">
                  Score
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">
                  Value
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider hidden xl:table-cell">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr
                  key={deal.id}
                  className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 shrink-0">
                        <Building2 size={14} className="text-brand-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-900 group-hover:text-brand-600 truncate transition-colors">
                          {deal.name}
                        </p>
                        <p className="text-xs text-surface-400 truncate">
                          {deal.industry ?? 'No industry set'}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <StageBadge stage={deal.stage} />
                  </td>
                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    <PriorityBadge priority={deal.priority} />
                  </td>
                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    <ScoreBadge score={deal.final_score} />
                  </td>
                  <td className="px-3 py-3.5 text-right hidden sm:table-cell">
                    <span className="text-sm font-medium text-surface-700">
                      {formatCurrency(deal.estimated_value)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right hidden xl:table-cell">
                    <span className="text-xs text-surface-400">
                      {formatRelativeDate(deal.updated_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
