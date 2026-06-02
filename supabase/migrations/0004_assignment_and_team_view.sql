-- 0004_assignment_and_team_view.sql
-- Per-person assignment for tickets + structured project ownership, to power
-- the Team view ("who is working on what" + each person's priorities).
--
-- Reads are already allowed for `authenticated` (SELECT qual = true) on tickets
-- and projects, so the new nullable columns are immediately readable. Writes go
-- through a server action using the service-role client after verifying the
-- caller, so no new RLS write policy is introduced.

alter table public.tickets
  add column if not exists assigned_to uuid
  references public.release_tool_profiles(id) on delete set null;

alter table public.projects
  add column if not exists owner_id uuid
  references public.release_tool_profiles(id) on delete set null;

create index if not exists tickets_assigned_to_idx on public.tickets(assigned_to);
create index if not exists projects_owner_id_idx on public.projects(owner_id);

-- Backfill structured owner from the existing free-text `owner` where it clearly
-- maps to a known person (e.g. "Tyler W." -> the Tyler profile). Only fills rows
-- that are currently null so it is safe to re-run.
update public.projects p
set owner_id = rp.id
from public.release_tool_profiles rp
where p.owner_id is null
  and p.owner is not null
  and (
    lower(p.owner) like lower(split_part(rp.display_name, ' ', 1)) || '%'
    or lower(p.owner) = lower(rp.email)
  );
