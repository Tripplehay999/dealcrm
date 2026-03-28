import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { DealForm } from '@/components/deals/deal-form'
import type { Deal } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('deals').select('name').eq('id', id).single()
  return { title: `Edit ${data?.name ?? 'Deal'}` }
}

export default async function EditDealPage({ params }: Props) {
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link
          href={`/deals/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700"
        >
          <ArrowLeft size={14} />
          Back to deal
        </Link>
      </div>
      <PageHeader
        title={`Edit: ${deal.name}`}
        description="Update deal information and scoring."
      />
      <div className="rounded-xl border border-surface-200 bg-white p-6">
        <DealForm deal={deal as Deal} />
      </div>
    </div>
  )
}
