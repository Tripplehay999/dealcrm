import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          {...props}
          className={cn(
            'h-9 w-full appearance-none rounded-lg border border-surface-300 bg-white pl-3 pr-8 text-sm text-surface-900',
            'transition-colors duration-150',
            'hover:border-surface-400',
            'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
            props.disabled && 'cursor-not-allowed bg-surface-50 text-surface-400',
            className
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400"
        />
      </div>
      {hint && !error && <p className="text-xs text-surface-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
