'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { noteSchema, type NoteInput } from '@/lib/validations/note'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Note } from '@/types'

interface Props {
  dealId: string
  userId: string
  note?: Note
  onSuccess?: () => void
  onCancel?: () => void
}

export function NoteEditor({ dealId, userId, note, onSuccess, onCancel }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!note

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: { content: note?.content ?? '' },
  })

  const onSubmit = async (data: NoteInput) => {
    setError(null)

    if (isEdit) {
      const { error: err } = await supabase
        .from('notes')
        .update({ content: data.content })
        .eq('id', note.id)

      if (err) {
        setError(err.message)
        return
      }
    } else {
      const { error: err } = await supabase.from('notes').insert({
        deal_id: dealId,
        user_id: userId,
        content: data.content,
      })

      if (err) {
        setError(err.message)
        return
      }
    }

    reset()
    router.refresh()
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Textarea
        placeholder={isEdit ? 'Update your note...' : 'Write a note about this deal...'}
        rows={4}
        error={errors.content?.message}
        autoFocus
        {...register('content')}
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" loading={isSubmitting}>
          {isEdit ? 'Save changes' : 'Save note'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
