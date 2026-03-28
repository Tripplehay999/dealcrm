'use client'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { LogOut, Menu, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Profile } from '@/types'

interface TopbarProps {
  onMobileMenuOpen: () => void
  profile: Profile | null
}

export function Topbar({ onMobileMenuOpen, profile }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-surface-200 bg-white px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-700 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile dropdown */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
          aria-label="Account menu"
          aria-expanded={menuOpen}
        >
          {initials}
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-surface-200 bg-white py-1 shadow-lg">
              {/* User info */}
              <div className="px-3 py-2 border-b border-surface-100">
                <p className="text-sm font-medium text-surface-900 truncate">
                  {profile?.full_name || 'Account'}
                </p>
                <p className="text-xs text-surface-500 truncate">{profile?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/settings')
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-sm text-surface-700',
                    'hover:bg-surface-50 transition-colors'
                  )}
                >
                  <Settings size={14} className="text-surface-400" />
                  Settings
                </button>

                <button
                  onClick={handleSignOut}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600',
                    'hover:bg-red-50 transition-colors'
                  )}
                >
                  <LogOut size={14} className="text-red-400" />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
