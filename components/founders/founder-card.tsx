'use client'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { FounderForm } from './founder-form'
import { createClient } from '@/lib/supabase/client'
import { Edit2, ExternalLink, Link2, Mail, Phone, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Founder } from '@/types'

interface Props {
  founder: Founder
}

export function FounderCard({ founder }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Remove ${founder.full_name} from this deal?`)) return
    setDeleting(true)
    await supabase.from('founders').delete().eq('id', founder.id)
    router.refresh()
  }

  const initials = founder.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <div className="flex items-start gap-4 px-5 py-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-surface-900">{founder.full_name}</p>
              {founder.role_title && (
                <p className="text-xs text-surface-500">{founder.role_title}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditOpen(true)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
                aria-label="Edit founder"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                aria-label="Remove founder"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {founder.email && (
              <a
                href={`mailto:${founder.email}`}
                className="flex items-center gap-1 text-xs text-surface-600 hover:text-brand-600"
              >
                <Mail size={12} />
                {founder.email}
              </a>
            )}
            {founder.phone && (
              <a
                href={`tel:${founder.phone}`}
                className="flex items-center gap-1 text-xs text-surface-600 hover:text-brand-600"
              >
                <Phone size={12} />
                {founder.phone}
              </a>
            )}
            {founder.linkedin_url && (
              <a
                href={founder.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-surface-600 hover:text-brand-600"
              >
                <Link2 size={12} />
                LinkedIn
                <ExternalLink size={10} />
              </a>
            )}
            {founder.twitter_url && (
              <a
                href={founder.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-surface-600 hover:text-brand-600"
              >
                <ExternalLink size={12} />
                Twitter / X
              </a>
            )}
          </div>

          {founder.notes && (
            <p className="mt-2 text-xs text-surface-500 leading-relaxed italic">
              &ldquo;{founder.notes}&rdquo;
            </p>
          )}
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit: ${founder.full_name}`}
        size="lg"
      >
        <FounderForm
          dealId={founder.deal_id}
          founder={founder}
          onSuccess={() => setEditOpen(false)}
        />
      </Modal>
    </>
  )
}
