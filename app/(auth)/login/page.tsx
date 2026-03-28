'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setAuthError(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : error.message
      )
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-surface-500">
          Sign in to your DealCRM account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-surface-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-9 w-full rounded-lg border border-surface-300 bg-white px-3 pr-10 text-sm text-surface-900 placeholder:text-surface-400 transition-colors hover:border-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {authError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {authError}
          </div>
        )}

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
          size="lg"
        >
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
          Create one
        </Link>
      </p>
    </div>
  )
}
