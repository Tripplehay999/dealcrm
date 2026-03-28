'use client'

import { NoteEditor } from './note-editor'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeDate } from '@/lib/utils'
import { Edit2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Note } from '@/types'

interface Props {
  note: Note
}

export function NoteItem({ note }: Props) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this note?')) return
    setDeleting(true)
    await supabase.from('notes').delete().eq('id', note.id)
    router.refresh()
  }

  if (editing) {
    return (
      <div className="px-5 py-4 bg-surface-50">
        <NoteEditor
          dealId={note.deal_id}
          userId={note.user_id}
          note={note}
          onSuccess={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="group px-5 py-4 hover:bg-surface-50/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-surface-800 leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
          <p className="mt-2 text-xs text-surface-400">
            {formatRelativeDate(note.created_at)}
            {note.updated_at !== note.created_at && ' · edited'}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
            aria-label="Edit note"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            aria-label="Delete note"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
