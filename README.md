# DealCRM — Track. Analyze. Acquire.

A CRM built for startup acquisitions. Track deals, manage founders, score opportunities, and move targets through a pipeline — in one clean workspace.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth + DB | Supabase (Auth + Postgres) |
| Icons | lucide-react |
| Validation | Zod v4 + react-hook-form |
| Dates | date-fns |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **anon public key** from Project Settings → API.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the database schema

In your Supabase project, go to **SQL Editor** and run the full contents of:

```
supabase/schema.sql
```

This creates:
- `profiles` table (auto-populated on signup via trigger)
- `deals` table (with computed `final_score`)
- `founders` table (cascade-deleted with deals)
- `notes` table (cascade-deleted with deals)
- `activities` table
- Row Level Security policies for all tables
- `updated_at` triggers

### 5. (Optional) Seed sample data

In the SQL Editor, run `supabase/seed.sql` after replacing `YOUR_USER_ID` with your actual Supabase auth user UUID (found in Authentication → Users after signing up once).

### 6. Fix conflicting route file

Because this project started from a Next.js scaffold, there is a root-level `app/page.tsx` that re-exports from `app/(public)/page.tsx`. To resolve the route conflict, delete one of them:

**Easiest fix:**
```bash
# On macOS/Linux:
rm "app/(public)/page.tsx"

# On Windows (PowerShell):
Remove-Item "app/(public)/page.tsx"
```

After deletion, the landing page at `app/page.tsx` will serve `/` cleanly.

### 7. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (public)/page.tsx              Landing page (/)  ← delete this after setup
  page.tsx                       Landing page (/) — the canonical one
  (auth)/
    layout.tsx                   Centered auth shell
    login/page.tsx               Sign in
    signup/page.tsx              Create account
  (app)/
    layout.tsx + app-shell.tsx   Protected app with sidebar
    dashboard/page.tsx
    deals/
      page.tsx                   Deal list with filter/search/sort
      new/page.tsx               Create deal
      [id]/page.tsx              Deal detail
      [id]/edit/page.tsx         Edit deal
    pipeline/page.tsx            Kanban board
    founders/page.tsx            All founders across deals
    analytics/page.tsx           Metrics and distribution charts
    settings/page.tsx            Profile and account

components/
  ui/           Primitives: Button, Input, Select, Textarea, Badge, Card, Modal, EmptyState, StatCard
  layout/       Sidebar, Topbar, PageHeader
  deals/        DealForm, DealsFilterBar, DealDetailActions, DealStageControl
  founders/     FounderSection, FounderCard, FounderForm
  notes/        NotesList, NoteEditor, NoteItem
  pipeline/     PipelineColumn
  settings/     SettingsForm

lib/
  supabase/client.ts    Browser Supabase client
  supabase/server.ts    Server Supabase client (async cookies, Next.js 16)
  validations/          Zod schemas: auth, deal, founder, note
  utils.ts              cn(), formatCurrency(), formatDate(), constants

types/index.ts          All shared TypeScript interfaces
middleware.ts           Route protection via Supabase session check
```

---

## Deal Score Formula

```
final_score = round(
  (potential_score × 0.40) +
  (traction_score  × 0.40) +
  ((100 - risk_score) × 0.20)
)
```

This is a **generated column** in Postgres — always computed automatically, never stale.

---

## Auth Flow

- `middleware.ts` intercepts every request and checks the Supabase session
- Unauthenticated → redirected to `/login`
- Authenticated users visiting `/login` or `/signup` → redirected to `/dashboard`
- Profile row auto-created on signup via a Postgres trigger on `auth.users`

---

## Supabase Notes

- **Email confirmation**: Disabled by default in many projects. If signup doesn't redirect to dashboard, go to Authentication → Settings → Disable "Enable email confirmations".
- **RLS**: All tables enforce Row Level Security. No cross-user data leakage possible.
- **Generated columns**: `final_score` on `deals` is Postgres-generated — never write it directly from the app. It updates automatically when score fields change.
