import { DealForm } from '@/components/deals/deal-form'
import { PageHeader } from '@/components/layout/page-header'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Deal' }

export default function NewDealPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Add deal"
        description="Track a new acquisition opportunity."
      />
      <div className="rounded-xl border border-surface-200 bg-white p-6">
        <DealForm />
      </div>
    </div>
  )
}
