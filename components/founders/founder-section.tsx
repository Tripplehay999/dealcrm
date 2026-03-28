'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Modal } from '@/components/ui/modal'
import { FounderForm } from './founder-form'
import { FounderCard } from './founder-card'
import { Users, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Deal, Founder } from '@/types'

interface Props {
  deal: Deal
  founders: Founder[]
}

export function FounderSection({ deal, founders }: Props) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <>
      <Card padding="none">
        <CardHeader className="px-5 pt-5 pb-4 border-b border-surface-100">
          <CardTitle>
            Founders
            {founders.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-100 text-xs font-semibold text-surface-600">
                {founders.length}
              </span>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus size={13} />}
            onClick={() => setAddOpen(true)}
          >
            Add founder
          </Button>
        </CardHeader>

        {founders.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No founders added"
            description="Add the founders you're in contact with for this deal."
            action={
              <Button
                variant="outline"
                size="sm"
                icon={<Plus size={13} />}
                onClick={() => setAddOpen(true)}
              >
                Add founder
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-surface-100">
            {founders.map((founder) => (
              <FounderCard key={founder.id} founder={founder} />
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add founder"
        description="Add a founder or contact to this deal."
        size="lg"
      >
        <FounderForm
          dealId={deal.id}
          onSuccess={() => setAddOpen(false)}
        />
      </Modal>
    </>
  )
}
