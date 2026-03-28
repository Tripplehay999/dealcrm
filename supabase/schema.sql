-- DealCRM Supabase Schema
-- Run this in the Supabase SQL editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text not null,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on user sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- DEALS
-- ============================================================
create table if not exists public.deals (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  name              text not null,
  description       text,
  website_url       text,
  industry          text,
  acquisition_type  text,
  stage             text not null default 'interested'
                    check (stage in ('interested','contacted','negotiating','closed','rejected')),
  priority          text not null default 'medium'
                    check (priority in ('low','medium','high')),
  status            text not null default 'active'
                    check (status in ('active','archived')),
  estimated_value   numeric(15,2),
  potential_score   integer check (potential_score between 0 and 100),
  risk_score        integer check (risk_score between 0 and 100),
  traction_score    integer check (traction_score between 0 and 100),
  final_score       integer generated always as (
                      round(
                        coalesce(potential_score, 0) * 0.4 +
                        coalesce(traction_score, 0) * 0.4 +
                        (100 - coalesce(risk_score, 50)) * 0.2
                      )
                    ) stored,
  source            text,
  notes_summary     text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists deals_user_id_idx on public.deals(user_id);
create index if not exists deals_stage_idx on public.deals(stage);
create index if not exists deals_status_idx on public.deals(status);
create index if not exists deals_created_at_idx on public.deals(created_at desc);

-- ============================================================
-- FOUNDERS
-- ============================================================
create table if not exists public.founders (
  id            uuid primary key default uuid_generate_v4(),
  deal_id       uuid not null references public.deals(id) on delete cascade,
  full_name     text not null,
  email         text,
  linkedin_url  text,
  twitter_url   text,
  role_title    text,
  phone         text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists founders_deal_id_idx on public.founders(deal_id);

-- ============================================================
-- NOTES
-- ============================================================
create table if not exists public.notes (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references public.deals(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists notes_deal_id_idx on public.notes(deal_id);
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_created_at_idx on public.notes(created_at desc);

-- ============================================================
-- ACTIVITIES
-- ============================================================
create table if not exists public.activities (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  deal_id      uuid references public.deals(id) on delete cascade,
  type         text not null,
  description  text not null,
  created_at   timestamptz not null default now()
);

create index if not exists activities_user_id_idx on public.activities(user_id);
create index if not exists activities_deal_id_idx on public.activities(deal_id);
create index if not exists activities_created_at_idx on public.activities(created_at desc);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_deals_updated_at before update on public.deals
  for each row execute procedure public.set_updated_at();
create trigger set_founders_updated_at before update on public.founders
  for each row execute procedure public.set_updated_at();
create trigger set_notes_updated_at before update on public.notes
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- deals
alter table public.deals enable row level security;

create policy "Users can view own deals"
  on public.deals for select
  using (auth.uid() = user_id);

create policy "Users can insert own deals"
  on public.deals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own deals"
  on public.deals for update
  using (auth.uid() = user_id);

create policy "Users can delete own deals"
  on public.deals for delete
  using (auth.uid() = user_id);

-- founders (access gated through deal ownership)
alter table public.founders enable row level security;

create policy "Users can view founders on own deals"
  on public.founders for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = founders.deal_id
        and deals.user_id = auth.uid()
    )
  );

create policy "Users can insert founders on own deals"
  on public.founders for insert
  with check (
    exists (
      select 1 from public.deals
      where deals.id = founders.deal_id
        and deals.user_id = auth.uid()
    )
  );

create policy "Users can update founders on own deals"
  on public.founders for update
  using (
    exists (
      select 1 from public.deals
      where deals.id = founders.deal_id
        and deals.user_id = auth.uid()
    )
  );

create policy "Users can delete founders on own deals"
  on public.founders for delete
  using (
    exists (
      select 1 from public.deals
      where deals.id = founders.deal_id
        and deals.user_id = auth.uid()
    )
  );

-- notes
alter table public.notes enable row level security;

create policy "Users can view notes on own deals"
  on public.notes for select
  using (
    exists (
      select 1 from public.deals
      where deals.id = notes.deal_id
        and deals.user_id = auth.uid()
    )
  );

create policy "Users can insert notes on own deals"
  on public.notes for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.deals
      where deals.id = notes.deal_id
        and deals.user_id = auth.uid()
    )
  );

create policy "Users can update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- activities
alter table public.activities enable row level security;

create policy "Users can view own activities"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);
