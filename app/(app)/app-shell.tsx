'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { useState } from 'react'
import type { Profile } from '@/types'

export function AppShell({
  children,
  profile,
}: {
  children: React.ReactNode
  profile: Profile | null
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-full">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          onMobileMenuOpen={() => setMobileOpen(true)}
          profile={profile}
        />
        <main className="flex-1 overflow-y-auto bg-surface-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
