'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 w-full rounded-2xl border border-surface-200 bg-white shadow-xl',
          sizes[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-surface-100 px-6 py-4">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-surface-900">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-sm text-surface-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
