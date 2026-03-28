'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { NoteEditor } from './note-editor'
import { NoteItem } from './note-item'
import { FileText, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Deal, Note } from '@/types'

interface Props {
  deal: Deal
  notes: Note[]
  userId: string
}

export function NotesList({ deal, notes, userId }: Props) {
  const [adding, setAdding] = useState(false)

  return (
    <Card padding="none">
      <CardHeader className="px-5 pt-5 pb-4 border-b border-surface-100">
        <CardTitle>
          Notes
          {notes.length > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-100 text-xs font-semibold text-surface-600">
              {notes.length}
            </span>
          )}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={13} />}
          onClick={() => setAdding(true)}
        >
          Add note
        </Button>
      </CardHeader>

      {/* New note editor */}
      {adding && (
        <div className="border-b border-surface-100 px-5 py-4 bg-surface-50">
          <NoteEditor
            dealId={deal.id}
            userId={userId}
            onSuccess={() => setAdding(false)}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {notes.length === 0 && !adding ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Capture your thoughts, call summaries, and due diligence notes here."
          action={
            <Button
              variant="outline"
              size="sm"
              icon={<Plus size={13} />}
              onClick={() => setAdding(true)}
            >
              Write a note
            </Button>
          }
        />
      ) : (
        <div className="divide-y divide-surface-50">
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </Card>
  )
}
