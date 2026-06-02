-- Real login: profiles tied to auth.users + revoke public anon reads.

create table if not exists release_tool_profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  display_name text not null,
  role_label text not null default 'Member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger release_tool_profiles_touch before update on release_tool_profiles
  for each row execute function touch_updated_at();

alter table release_tool_profiles enable row level security;

create policy "profiles read own"
  on release_tool_profiles for select to authenticated
  using (auth.uid() = id);

create policy "profiles update own"
  on release_tool_profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Drop permissive anon-read policies from 0001 (tool is not public).
do $$
declare
  t text;
  pol record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' and tablename <> 'release_tool_profiles'
  loop
    for pol in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t and policyname like 'anon read%'
    loop
      execute format('drop policy if exists %I on %I', pol.policyname, t);
    end loop;
  end loop;
end $$;
