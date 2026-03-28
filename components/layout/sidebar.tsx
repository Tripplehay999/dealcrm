'use client'

import { cn } from '@/lib/utils'
import {
  BarChart3,
  Building2,
  ChevronRight,
  Kanban,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Deals', href: '/deals', icon: Building2 },
  { label: 'Pipeline', href: '/pipeline', icon: Kanban },
  { label: 'Founders', href: '/founders', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
]

const secondary = [
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
  onClick?: () => void
}

function NavItem({ href, icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
      )}
    >
      <Icon
        size={16}
        className={cn(active ? 'text-brand-600' : 'text-surface-400')}
      />
      {label}
      {active && (
        <ChevronRight size={12} className="ml-auto text-brand-400" />
      )}
    </Link>
  )
}

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href)

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-surface-100 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
          <Building2 size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold text-surface-900 tracking-tight">
          DealCRM
        </span>
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden flex h-7 w-7 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100"
          aria-label="Close navigation"
        >
          <X size={15} />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {nav.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={isActive(item.href)}
            onClick={onMobileClose}
          />
        ))}
      </nav>

      {/* Secondary nav */}
      <div className="border-t border-surface-100 py-3 px-2 space-y-0.5">
        {secondary.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={isActive(item.href)}
            onClick={onMobileClose}
          />
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-surface-200 bg-white">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-surface-950/30"
            onClick={onMobileClose}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-full w-56 bg-white shadow-xl z-50">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
