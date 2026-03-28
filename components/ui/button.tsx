'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
  secondary:
    'bg-surface-100 text-surface-900 hover:bg-surface-200 active:bg-surface-300',
  ghost:
    'bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900',
  outline:
    'border border-surface-300 bg-white text-surface-700 hover:bg-surface-50 hover:border-surface-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-base gap-2 rounded-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <Loader2 className="shrink-0 animate-spin" size={14} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
