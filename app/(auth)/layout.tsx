import { Building2 } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Auth header */}
      <header className="flex h-14 items-center px-6 border-b border-surface-200 bg-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-surface-900 tracking-tight">
            DealCRM
          </span>
        </Link>
      </header>

      {/* Center content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>

      <footer className="py-4 text-center text-xs text-surface-400">
        &copy; {new Date().getFullYear()} DealCRM. All rights reserved.
      </footer>
    </div>
  )
}
