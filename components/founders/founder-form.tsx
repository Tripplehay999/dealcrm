'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { founderSchema, type FounderInput } from '@/lib/validations/founder'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Founder } from '@/types'

interface Props {
  dealId: string
  founder?: Founder
  onSuccess?: () => void
}

export function FounderForm({ dealId, founder, onSuccess }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!founder

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FounderInput>({
    resolver: zodResolver(founderSchema),
    defaultValues: founder
      ? {
          full_name: founder.full_name,
          email: founder.email ?? '',
          linkedin_url: founder.linkedin_url ?? '',
          twitter_url: founder.twitter_url ?? '',
          role_title: founder.role_title ?? '',
          phone: founder.phone ?? '',
          notes: founder.notes ?? '',
        }
      : {},
  })

  const onSubmit = async (data: FounderInput) => {
    setError(null)

    const payload = {
      ...data,
      email: data.email || null,
      linkedin_url: data.linkedin_url || null,
      twitter_url: data.twitter_url || null,
      role_title: data.role_title || null,
      phone: data.phone || null,
      notes: data.notes || null,
    }

    if (isEdit) {
      const { error: err } = await supabase
        .from('founders')
        .update(payload)
        .eq('id', founder.id)

      if (err) {
        setError(err.message)
        return
      }
    } else {
      const { error: err } = await supabase
        .from('founders')
        .insert({ ...payload, deal_id: dealId })

      if (err) {
        setError(err.message)
        return
      }
    }

    router.refresh()
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Full name"
          placeholder="Alex Johnson"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Role / title"
          placeholder="Co-founder & CEO"
          error={errors.role_title?.message}
          {...register('role_title')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="alex@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone"
          placeholder="+1 (555) 000-0000"
          type="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="LinkedIn URL"
          placeholder="https://linkedin.com/in/..."
          type="url"
          error={errors.linkedin_url?.message}
          {...register('linkedin_url')}
        />
        <Input
          label="Twitter / X URL"
          placeholder="https://twitter.com/..."
          type="url"
          error={errors.twitter_url?.message}
          {...register('twitter_url')}
        />
      </div>

      <Textarea
        label="Notes on this founder"
        placeholder="Communication style, preferences, key motivations..."
        rows={3}
        error={errors.notes?.message}
        {...register('notes')}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={isSubmitting} size="sm">
          {isEdit ? 'Save changes' : 'Add founder'}
        </Button>
        {onSuccess && (
          <Button type="button" variant="ghost" size="sm" onClick={onSuccess}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
