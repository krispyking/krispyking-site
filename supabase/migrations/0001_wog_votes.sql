-- CK-5875 — ballot/advice table for krispyking.com/gentleman
--
-- Apply this once a Supabase project is provisioned for the site (this session's
-- Supabase MCP access is read-only and cannot create the project or run this itself —
-- see the CK-5875 report). Run via `supabase db push`, the SQL editor, or the
-- Supabase MCP's own migration tool from a session that has it.

create table if not exists public.wog_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ballot_choice text not null check (
    ballot_choice in (
      'act1_chapter',   -- Act 1 chapter (~30 min, ~$840) — prove it, then decide again
      'full_film',      -- The full film — straight through
      'documentary_first', -- Documentary first — the family/journey story before the drama
      'the_ride',       -- The ride — fund/follow the motorbike retracing as its own series
      'stop_here'       -- Stop here — it was a beautiful test
    )
  ),
  advice text,
  contact text,
  cut_watched text check (cut_watched in ('full_demo', 'standalone_trailer')),
  user_agent text
);

alter table public.wog_votes enable row level security;

-- Anonymous visitors may cast a vote (INSERT) but can never read the table back —
-- results are served only through functions/gentleman-results.js using the
-- service-role key server-side, gated by Chris's simple token. Per CK-5875's spec:
-- "Supabase table wog_votes (RLS on, no public read)".
create policy "anon can insert votes" on public.wog_votes
  for insert
  to anon
  with check (true);

-- Deliberately no SELECT/UPDATE/DELETE policy for anon or authenticated — only the
-- service_role key (server-side only) can read, which bypasses RLS by default.
