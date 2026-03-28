'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Profile } from '@/types'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
})
type Input = z.infer<typeof schema>

interface Props {
  profile: Profile | null
  userEmail: string
}

export function SettingsForm({ profile, userEmail }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name ?? '',
    },
  })

  const onSubmit = async (data: Input) => {
    setError(null)
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: err } = await supabase
      .from('profiles')
      .update({ full_name: data.full_name })
      .eq('id', user.id)

    if (err) {
      setError(err.message)
      return
    }

    setSuccess(true)
    router.refresh()
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Avatar placeholder */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
          {profile?.full_name?.[0]?.toUpperCase() ?? userEmail[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="text-sm font-medium text-surface-900">
            {profile?.full_name ?? 'Your name'}
          </p>
          <p className="text-xs text-surface-500">{userEmail}</p>
        </div>
      </div>

      <Input
        label="Full name"
        placeholder="Your full name"
        error={errors.full_name?.message}
        {...register('full_name')}
      />

      <Input label="Email" value={userEmail} disabled hint="Email cannot be changed here." />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
          Profile updated successfully.
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-surface-100">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isDirty}
          size="sm"
        >
          Save changes
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="ml-auto text-surface-500"
        >
          Sign out
        </Button>
      </div>
    </form>
  )
}
