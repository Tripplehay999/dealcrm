import { ArrowRight, Building2 } from 'lucide-react'
import Link from 'next/link'

const deals = [
  { name: 'Renterio', industry: 'PropTech / SaaS', stage: 'Negotiating', priority: 'High', score: 86, value: '$900k', stageColor: 'text-amber-600 bg-amber-50', priorityColor: 'text-red-600 bg-red-50' },
  { name: 'Ghostwrite AI', industry: 'AI / Content', stage: 'Contacted', priority: 'High', score: 86, value: '$480k', stageColor: 'text-brand-600 bg-brand-50', priorityColor: 'text-red-600 bg-red-50' },
  { name: 'Launchpad Analytics', industry: 'SaaS / Analytics', stage: 'Negotiating', priority: 'High', score: 79, value: '$320k', stageColor: 'text-amber-600 bg-amber-50', priorityColor: 'text-red-600 bg-red-50' },
  { name: 'Onboard.ly', industry: 'SaaS / No-Code', stage: 'Negotiating', priority: 'Medium', score: 69, value: '$175k', stageColor: 'text-amber-600 bg-amber-50', priorityColor: 'text-amber-600 bg-amber-50' },
  { name: 'FlowQueue', industry: 'SaaS / Productivity', stage: 'Contacted', priority: 'Medium', score: 61, value: '$140k', stageColor: 'text-brand-600 bg-brand-50', priorityColor: 'text-amber-600 bg-amber-50' },
  { name: 'Signably', industry: 'SaaS / Legal Tech', stage: 'Interested', priority: 'Low', score: 46, value: '$48k', stageColor: 'text-sky-600 bg-sky-50', priorityColor: 'text-surface-500 bg-surface-100' },
]

const capabilities = [
  ['Deal tracking', 'Stage and priority management', 'Estimated valuation', 'Acquisition source'],
  ['Founder contacts', 'LinkedIn and email', 'Relationship notes', 'Per-deal contact history'],
  ['Timestamped notes', 'Due diligence logs', 'Call summaries', 'Full note history'],
  ['Potential score', 'Traction score', 'Risk score', 'Weighted final score'],
  ['Kanban pipeline board', 'One-click stage moves', 'Prioritized deal cards', 'Pipeline value totals'],
  ['Stage distribution', 'Score distribution', 'Priority breakdown', 'Industry analytics'],
]

const capabilityLabels = [
  'Deal management',
  'Founder CRM',
  'Notes system',
  'Deal scoring',
  'Pipeline board',
  'Analytics',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-surface-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
              <Building2 size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-surface-900 tracking-tight">DealCRM</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-surface-500 hover:text-surface-800 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Get started <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-brand-600 px-5 pt-24 pb-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-medium text-brand-300 uppercase tracking-widest mb-6">
            Acquisition deal management
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-8 max-w-3xl">
            One place for every startup you want to buy.
          </h1>
          <p className="text-lg text-brand-200 max-w-xl leading-relaxed mb-10">
            DealCRM is a workspace for micro-acquirers and startup buyers. Track targets, manage founder relationships, write deal notes, and move opportunities through a structured pipeline.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
            >
              Start for free <ArrowRight size={14} />
            </Link>
            <Link href="/login" className="text-sm text-brand-200 hover:text-white transition-colors">
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* Product — deals table */}
      <section className="bg-brand-600 px-5 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-brand-500 overflow-hidden shadow-xl">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-brand-500 bg-brand-700/60">
              {['Company', 'Stage', 'Priority', 'Score', 'Value'].map((h) => (
                <span key={h} className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider">
                  {h}
                </span>
              ))}
            </div>
            {/* Rows */}
            {deals.map((deal, i) => (
              <div
                key={deal.name}
                className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 border-b border-brand-500/50 last:border-0 ${i === 0 ? 'bg-white/10' : 'bg-brand-700/40'}`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{deal.name}</p>
                  <p className="text-xs text-brand-300 mt-0.5">{deal.industry}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${deal.stageColor}`}>
                  {deal.stage}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${deal.priorityColor}`}>
                  {deal.priority}
                </span>
                <span className={`inline-flex items-center justify-center w-8 h-6 rounded-md text-[11px] font-bold tabular-nums ${
                  deal.score >= 75 ? 'bg-emerald-900/60 text-emerald-300' :
                  deal.score >= 50 ? 'bg-amber-900/60 text-amber-300' :
                  'bg-brand-800/60 text-brand-300'
                }`}>
                  {deal.score}
                </span>
                <span className="text-sm font-medium text-white tabular-nums">{deal.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-brand-300 text-center">Your deals. Your pipeline. No spreadsheets.</p>
        </div>
      </section>

      {/* What it solves */}
      <section className="px-5 py-24 border-b border-surface-100">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold text-surface-950 tracking-tight leading-tight mb-5">
              Buying startups is a process. Treat it like one.
            </h2>
            <p className="text-surface-500 leading-relaxed mb-6">
              Most acquirers track targets in Notion, founders in a contact app, notes in their email, and valuations in a spreadsheet. When a deal moves fast, that system falls apart.
            </p>
            <p className="text-surface-500 leading-relaxed">
              DealCRM puts the whole process in one place — from the first time you see a company to the day you close. Every deal, founder, note, and score, in a workspace built specifically for acquisition deal flow.
            </p>
          </div>
          <div className="space-y-5">
            {[
              {
                label: 'Add a target',
                detail: 'Company, industry, website, estimated value, acquisition type, and source. Set a stage and priority. Done in sixty seconds.',
              },
              {
                label: 'Track the founder',
                detail: 'Name, email, LinkedIn, role, and relationship notes — attached directly to the deal, not floating in your contacts.',
              },
              {
                label: 'Write your notes',
                detail: 'Log every call, email, and piece of diligence as you go. Timestamped, editable, and always tied to the right deal.',
              },
              {
                label: 'Score and prioritize',
                detail: 'Rate potential, traction, and risk from 0–100. DealCRM computes a weighted final score so you know which deals deserve your time.',
              },
              {
                label: 'Move through your pipeline',
                detail: 'Interested → Contacted → Negotiating → Closed. See every deal on a kanban board and update stages in one click.',
              },
            ].map((item, i) => (
              <div key={item.label} className="flex gap-4">
                <span className="text-xs font-bold text-brand-400 tabular-nums mt-0.5 w-5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-sm font-semibold text-surface-900 mb-1">{item.label}</p>
                  <p className="text-sm text-surface-500 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-5 py-24 bg-surface-50 border-b border-surface-100">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-surface-950 mb-10">What&apos;s included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-200 rounded-xl overflow-hidden border border-surface-200">
            {capabilityLabels.map((label, i) => (
              <div key={label} className="bg-white px-6 py-5">
                <p className="text-sm font-semibold text-surface-900 mb-3">{label}</p>
                <ul className="space-y-1.5">
                  {capabilities[i].map((item) => (
                    <li key={item} className="text-xs text-surface-500">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 bg-brand-600">
        <div className="mx-auto max-w-5xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              Ready to run a real acquisition process?
            </h2>
            <p className="text-brand-200">
              Free to use. Takes two minutes to set up.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
            >
              Get started free <ArrowRight size={14} />
            </Link>
            <Link href="/login" className="text-sm text-brand-200 hover:text-white transition-colors">
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 py-6 px-5">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-600">
              <Building2 size={10} className="text-white" />
            </div>
            <span className="text-xs font-bold text-surface-900">DealCRM</span>
          </div>
          <p className="text-xs text-surface-400">
            &copy; {new Date().getFullYear()} DealCRM
          </p>
        </div>
      </footer>

    </div>
  )
}
