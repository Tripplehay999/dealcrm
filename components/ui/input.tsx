import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={cn(
          'h-9 w-full rounded-lg border border-surface-300 bg-white px-3 text-sm text-surface-900',
          'placeholder:text-surface-400',
          'transition-colors duration-150',
          'hover:border-surface-400',
          'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
          props.disabled && 'cursor-not-allowed bg-surface-50 text-surface-400',
          className
        )}
      />
      {hint && !error && (
        <p className="text-xs text-surface-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
