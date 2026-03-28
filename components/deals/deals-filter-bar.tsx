'use client'

import { cn } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useRef, useTransition } from 'react'

const stages = [
  { value: 'all', label: 'All stages' },
  { value: 'interested', label: 'Interested' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
]

const priorities = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const sorts = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'score', label: 'Score' },
  { value: 'value', label: 'Value' },
  { value: 'name', label: 'Name' },
]

interface Props {
  currentParams: {
    stage?: string
    priority?: string
    sort?: string
    q?: string
  }
}

export function DealsFilterBar({ currentParams }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const searchRef = useRef<HTMLInputElement>(null)

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams({
      ...(currentParams.stage && { stage: currentParams.stage }),
      ...(currentParams.priority && { priority: currentParams.priority }),
      ...(currentParams.sort && { sort: currentParams.sort }),
      ...(currentParams.q && { q: currentParams.q }),
      [key]: value,
    })
    if (value === 'all' || value === '') params.delete(key)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = searchRef.current?.value ?? ''
    updateParam('q', q)
  }

  function clearSearch() {
    if (searchRef.current) searchRef.current.value = ''
    updateParam('q', '')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 mb-2">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
        />
        <input
          ref={searchRef}
          defaultValue={currentParams.q ?? ''}
          placeholder="Search deals..."
          className="h-9 w-full rounded-lg border border-surface-300 bg-white pl-8 pr-8 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        {currentParams.q && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
          >
            <X size={13} />
          </button>
        )}
      </form>

      {/* Stage filter */}
      <select
        value={currentParams.stage ?? 'all'}
        onChange={(e) => updateParam('stage', e.target.value)}
        className="h-9 rounded-lg border border-surface-300 bg-white px-3 text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {stages.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        value={currentParams.priority ?? 'all'}
        onChange={(e) => updateParam('priority', e.target.value)}
        className="h-9 rounded-lg border border-surface-300 bg-white px-3 text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {priorities.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={currentParams.sort ?? 'newest'}
        onChange={(e) => updateParam('sort', e.target.value)}
        className="h-9 rounded-lg border border-surface-300 bg-white px-3 text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>
            Sort: {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
