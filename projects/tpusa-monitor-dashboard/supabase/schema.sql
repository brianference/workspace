-- Sweeps table: each row is one monitoring run
create table if not exists sweeps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  flag_count integer not null default 0,
  legal_count integer not null default 0,
  mention_count integer not null default 0,
  org_count integer not null default 0,
  raw_report text not null default ''
);

-- Flagged posts table: individual posts flagged during a sweep
create table if not exists flagged_posts (
  id uuid primary key default gen_random_uuid(),
  sweep_id uuid not null references sweeps(id) on delete cascade,
  handle text not null,
  excerpt text not null,
  category text not null,
  tags text[] not null default '{}',
  source_url text not null,
  created_at timestamptz not null default now()
);

-- Index for efficient sweep lookups
create index if not exists idx_flagged_posts_sweep_id on flagged_posts(sweep_id);

-- Enable realtime for sweeps table
alter publication supabase_realtime add table sweeps;

-- Row Level Security (open read for anon, restrict writes)
alter table sweeps enable row level security;
alter table flagged_posts enable row level security;

create policy "Allow anonymous read access on sweeps"
  on sweeps for select
  to anon
  using (true);

create policy "Allow anonymous read access on flagged_posts"
  on flagged_posts for select
  to anon
  using (true);
