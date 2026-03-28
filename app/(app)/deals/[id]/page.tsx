import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { StageBadge, PriorityBadge, ScoreBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { formatCurrency, formatDate, formatRelativeDate } from '@/lib/utils'
import {
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  MessageSquare,
  Users,
} from 'lucide-react'
import type { Deal, Founder, Note } from '@/types'
import type { Metadata } from 'next'
import { DealDetailActions } from '@/components/deals/deal-detail-actions'
import { DealStageControl } from '@/components/deals/deal-stage-control'
import { NotesList } from '@/components/notes/notes-list'
import { FounderSection } from '@/components/founders/founder-section'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('deals').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Deal' }
}

export default async function DealDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!deal) notFound()

  const [{ data: founders }, { data: notes }] = await Promise.all([
    supabase
      .from('founders')
      .select('*')
      .eq('deal_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('notes')
      .select('*')
      .eq('deal_id', id)
      .order('created_at', { ascending: false }),
  ])

  const d = deal as Deal
  const hasScore =
    d.potential_score != null || d.traction_score != null || d.risk_score != null

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title={d.name}
        description={d.industry ?? undefined}
        action={<DealDetailActions deal={d} />}
      />

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Deal overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <DealStageControl deal={d} />
            </CardHeader>

            {d.description && (
              <p className="text-sm text-surface-600 leading-relaxed mb-5">
                {d.description}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  label: 'Website',
                  value: d.website_url ? (
                    <a
                      href={d.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {d.website_url.replace(/^https?:\/\//, '')}
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-surface-400">—</span>
                  ),
                  icon: Globe,
                },
                {
                  label: 'Acquisition type',
                  value: d.acquisition_type ?? '—',
                  icon: Layers,
                },
                {
                  label: 'Source',
                  value: d.source ?? '—',
                  icon: Building2,
                },
                {
                  label: 'Estimated value',
                  value: formatCurrency(d.estimated_value),
                  icon: Building2,
                },
                {
                  label: 'Added',
                  value: formatDate(d.created_at),
                  icon: CalendarDays,
                },
                {
                  label: 'Last updated',
                  value: formatRelativeDate(d.updated_at),
                  icon: CalendarDays,
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-sm text-surface-800">
                    {typeof item.value === 'string' ? item.value : item.value}
                  </span>
                </div>
              ))}
            </div>

            {d.notes_summary && (
              <div className="mt-5 rounded-lg bg-surface-50 border border-surface-100 px-4 py-3">
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">
                  Internal summary
                </p>
                <p className="text-sm text-surface-700 leading-relaxed">
                  {d.notes_summary}
                </p>
              </div>
            )}
          </Card>

          {/* Founders */}
          <FounderSection deal={d} founders={(founders as Founder[]) ?? []} />

          {/* Notes */}
          <NotesList deal={d} notes={(notes as Note[]) ?? []} userId={user!.id} />
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">Stage</span>
                <StageBadge stage={d.stage} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">Priority</span>
                <PriorityBadge priority={d.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">Status</span>
                <span className="text-xs font-medium text-surface-700 capitalize">
                  {d.status}
                </span>
              </div>
            </div>
          </Card>

          {/* Score card */}
          <Card>
            <CardHeader>
              <CardTitle>Score</CardTitle>
              {d.final_score != null && (
                <ScoreBadge score={d.final_score} />
              )}
            </CardHeader>
            {!hasScore ? (
              <p className="text-sm text-surface-400 text-center py-3">
                No scores set yet.{' '}
                <a href="#" className="text-brand-600 hover:underline">
                  Edit deal
                </a>{' '}
                to add scores.
              </p>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Potential', value: d.potential_score, color: 'bg-brand-500' },
                  { label: 'Traction', value: d.traction_score, color: 'bg-emerald-500' },
                  { label: 'Risk', value: d.risk_score, color: 'bg-amber-500', invert: true },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-surface-500">{item.label}</span>
                      <span className="text-xs font-semibold text-surface-700">
                        {item.value ?? '—'}
                        {item.value != null && item.invert && (
                          <span className="text-[10px] text-surface-400 ml-1">(lower = better)</span>
                        )}
                      </span>
                    </div>
                    {item.value != null && (
                      <div className="h-1.5 w-full rounded-full bg-surface-100">
                        <div
                          className={`h-1.5 rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {d.final_score != null && (
                  <div className="mt-4 rounded-lg bg-surface-50 border border-surface-100 px-3 py-2.5 text-center">
                    <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">
                      Final score
                    </p>
                    <p className="text-3xl font-bold text-surface-900 tabular-nums">
                      {d.final_score}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick stats</CardTitle>
            </CardHeader>
            <div className="space-y-2.5">
              {[
                { label: 'Notes', value: (notes?.length ?? 0).toString() },
                { label: 'Founders', value: (founders?.length ?? 0).toString() },
                { label: 'Est. value', value: formatCurrency(d.estimated_value) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-surface-500">{item.label}</span>
                  <span className="text-sm font-medium text-surface-800">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
