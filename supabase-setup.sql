-- iPAS 備考學院：雲端同步與管理後台，可在 Supabase SQL Editor 重複執行。
-- 不包含任何學習者資料；既有資料不會因重跑而被刪除。
begin;
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

-- 明確授權：登入者仍受 own rows RLS 限制，匿名者不能讀寫學習紀錄。
grant usage on schema public to authenticated, service_role;
revoke all on table public.user_state from anon;
grant select, insert, update, delete on table public.user_state to authenticated;
grant all on table public.user_state to service_role;

-- 管理後台 RPC：以下定義取自既有線上專案，保留管理信箱檢查。
-- 更換管理者時，請同步修改兩個函式的 admins 陣列。
CREATE OR REPLACE FUNCTION public.usage_stats()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  caller text := auth.jwt() ->> 'email';
  admins text[] := array['tunai0511edu@gmail.com'];   -- ★保持你的管理信箱
  res jsonb;
begin
  if caller is null or not exists (select 1 from unnest(admins) a where lower(a)=lower(caller)) then
    raise exception 'not authorized';
  end if;
  select jsonb_build_object(
    'generated_at', now(),
    'total_users', (select count(distinct user_id) from user_state),
    'active_7d',  (select count(distinct user_id) from user_state where updated_at > now()-interval '7 days'),
    'active_30d', (select count(distinct user_id) from user_state where updated_at > now()-interval '30 days'),
    'by_app', (select coalesce(jsonb_agg(t order by t.users desc),'[]'::jsonb) from (
        select us.app, count(distinct us.user_id) as users, max(us.updated_at) as last_active,
               coalesce(sum(ra.cnt),0)::int as attempts
        from user_state us
        left join lateral (
          select coalesce(sum(case when jsonb_typeof(p.value->'attempts')='array'
                 then jsonb_array_length(p.value->'attempts') else 0 end),0) as cnt
          from jsonb_each(coalesce(us.data->'data','{}'::jsonb)) p) ra on true
        group by us.app) t),
    'users', (select coalesce(jsonb_agg(u order by u.last_active desc nulls last),'[]'::jsonb) from (
        select
          (select au.email from auth.users au where au.id = us.user_id) as email,
          max(us.data->'profiles'->0->>'name') as name,
          string_agg(distinct us.app, ', ') as apps,
          count(el.elem) as attempts,
          case when coalesce(sum((el.elem->>'total')::int),0) > 0
               then round(100.0*sum((el.elem->>'correct')::int)/sum((el.elem->>'total')::int))::int
               else null end as accuracy,
          max(us.updated_at) as last_active
        from user_state us
        left join lateral jsonb_each(coalesce(us.data->'data','{}'::jsonb)) prof on true
        left join lateral jsonb_array_elements(
          case when jsonb_typeof(prof.value->'attempts')='array' then prof.value->'attempts' else '[]'::jsonb end
        ) el(elem) on true
        group by us.user_id
        order by max(us.updated_at) desc nulls last
        limit 500) u),
    'daily', (select coalesce(jsonb_agg(d order by d.day),'[]'::jsonb) from (
        select date_trunc('day',updated_at)::date as day, count(distinct user_id) as active
        from user_state where updated_at > now()-interval '30 days' group by 1) d)
  ) into res;
  return res;
end; $function$;

CREATE OR REPLACE FUNCTION public.user_attempts(p_email text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  caller text := auth.jwt() ->> 'email';
  admins text[] := array['tunai0511edu@gmail.com'];   -- ★同一個管理信箱
  uid uuid;
  res jsonb;
begin
  if caller is null or not exists (select 1 from unnest(admins) a where lower(a)=lower(caller)) then
    raise exception 'not authorized';
  end if;
  select id into uid from auth.users where lower(email)=lower(p_email) limit 1;
  if uid is null then return '[]'::jsonb; end if;

  select coalesce(jsonb_agg(
           jsonb_build_object('app',app,'subject',subject,'mode',mode,
                              'correct',correct,'total',total,'score',score,'finished',finished)
           order by finished desc nulls last), '[]'::jsonb) into res
  from (
    select us.app as app,
           el.elem->>'subjectName' as subject,
           el.elem->>'modeName'    as mode,
           el.elem->>'correct'     as correct,
           el.elem->>'total'       as total,
           el.elem->>'score'       as score,
           el.elem->>'finishedAt'  as finished
    from user_state us
    left join lateral jsonb_each(coalesce(us.data->'data','{}'::jsonb)) prof on true
    left join lateral jsonb_array_elements(
      case when jsonb_typeof(prof.value->'attempts')='array' then prof.value->'attempts' else '[]'::jsonb end
    ) el(elem) on true
    where us.user_id = uid and el.elem is not null
    limit 1000
  ) x;
  return res;
end; $function$;

-- PostgreSQL 新函式預設可被 PUBLIC 執行，必須明確收回。
revoke all on function public.usage_stats() from public, anon;
revoke all on function public.user_attempts(text) from public, anon;
grant execute on function public.usage_stats() to authenticated, service_role;
grant execute on function public.user_attempts(text) to authenticated, service_role;

commit;
