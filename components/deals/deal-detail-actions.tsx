'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Edit2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import type { Deal } from '@/types'

interface Props {
  deal: Deal
}

export function DealDetailActions({ deal }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    await supabase.from('deals').delete().eq('id', deal.id)
    router.push('/deals')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/deals/${deal.id}/edit`}>
        <Button variant="outline" size="sm" icon={<Edit2 size={13} />}>
          Edit
        </Button>
      </Link>
      <Button
        variant={confirmDelete ? 'danger' : 'ghost'}
        size="sm"
        icon={<Trash2 size={13} />}
        loading={deleting}
        onClick={handleDelete}
        className={confirmDelete ? '' : 'text-surface-500'}
      >
        {confirmDelete ? 'Confirm delete' : 'Delete'}
      </Button>
      {confirmDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirmDelete(false)}
        >
          Cancel
        </Button>
      )}
    </div>
  )
}
