-- Allow anon (and authenticated) clients to insert/update/delete tasks.
-- The whole app sits behind the password gate, so the anon key is trusted
-- for user mutations. RLS stays in place for tighter tables.

create policy "anon insert tasks" on tasks for insert to anon, authenticated with check (true);
create policy "anon update tasks" on tasks for update to anon, authenticated using (true) with check (true);
create policy "anon delete tasks" on tasks for delete to anon, authenticated using (true);
