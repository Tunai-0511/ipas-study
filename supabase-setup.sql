-- iPAS 備考學院 雲端同步：在 Supabase SQL Editor 執行一次
create table if not exists public.user_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  app text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, app)
);
alter table public.user_state enable row level security;
drop policy if exists "own rows" on public.user_state;
create policy "own rows" on public.user_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
