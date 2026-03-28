'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    setAuthError(null)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
      },
    })

    if (error) {
      setAuthError(error.message)
      return
    }

    // If email confirmation is off in Supabase, user is immediately active
    router.push('/dashboard')
    router.refresh()
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-50">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-surface-900">Check your email</h2>
        <p className="mt-2 text-sm text-surface-500">
          We sent a confirmation link to your inbox. Click it to activate your account.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-surface-500">
          Start tracking acquisition deals today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          type="text"
          placeholder="Alex Johnson"
          autoComplete="name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

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
              placeholder="Min. 8 characters"
              autoComplete="new-password"
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
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-surface-400">
        By signing up, you agree to our terms of service and privacy policy.
      </p>

      <p className="mt-4 text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
