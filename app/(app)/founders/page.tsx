import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { formatRelativeDate } from '@/lib/utils'
import { ExternalLink, Link2, Mail, Users } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Founders' }

export default async function FoundersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get founders with their deal names
  const { data } = await supabase
    .from('founders')
    .select('*, deal:deals!inner(id, name, user_id)')
    .eq('deals.user_id', user!.id)
    .order('created_at', { ascending: false })

  const founders = data ?? []

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Founders"
        description={`${founders.length} founder${founders.length !== 1 ? 's' : ''} across all deals`}
      />

      {founders.length === 0 ? (
        <div className="rounded-xl border border-surface-200 bg-white">
          <EmptyState
            icon={Users}
            title="No founders yet"
            description="Founders are added from individual deal pages. Open a deal and add a founder to get started."
            action={
              <Link
                href="/deals"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-medium text-white hover:bg-brand-700"
              >
                Go to deals
              </Link>
            }
          />
        </div>
      ) : (
        <div className="rounded-xl border border-surface-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Founder
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">
                  Deal
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">
                  Contact
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden xl:table-cell">
                  Links
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider hidden xl:table-cell">
                  Added
                </th>
              </tr>
            </thead>
            <tbody>
              {founders.map((founder: any) => {
                const initials = founder.full_name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <tr
                    key={founder.id}
                    className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-surface-900">
                            {founder.full_name}
                          </p>
                          {founder.role_title && (
                            <p className="text-xs text-surface-400">
                              {founder.role_title}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 hidden md:table-cell">
                      <Link
                        href={`/deals/${founder.deal?.id}`}
                        className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                      >
                        {founder.deal?.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 hidden lg:table-cell">
                      {founder.email && (
                        <a
                          href={`mailto:${founder.email}`}
                          className="flex items-center gap-1 text-xs text-surface-600 hover:text-brand-600"
                        >
                          <Mail size={12} />
                          {founder.email}
                        </a>
                      )}
                    </td>
                    <td className="px-3 py-3.5 hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        {founder.linkedin_url && (
                          <a
                            href={founder.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-surface-400 hover:text-brand-600 transition-colors"
                            aria-label="LinkedIn"
                          >
                            <Link2 size={14} />
                          </a>
                        )}
                        {founder.twitter_url && (
                          <a
                            href={founder.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-surface-400 hover:text-brand-600 transition-colors"
                            aria-label="Twitter / X"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden xl:table-cell">
                      <span className="text-xs text-surface-400">
                        {formatRelativeDate(founder.created_at)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
