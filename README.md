# BuildCore Release Tool (v2)

Project-centric release planning, feature tracking, testing, and engineering-handoff coordination for BuildCore. **Sandboxed — does not write to the `bid-sheet-v2` production database, repo, or runtime.**

**Production:** https://buildcore-release-tool.vercel.app
**Repo:** https://github.com/tylerwoodworth-cmd/buildcore-release-tool
**Supabase project:** `buildcore-release-tool` (separate from bid-sheet-v2's project)

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS (CSS-first theme, BuildCore tokens in `src/app/globals.css`)
- Supabase (Postgres + Realtime) — separate project from bid-sheet-v2
- TanStack Query for client cache
- Lucide icons
- Vercel deployment

## Local development

```bash
# Use Tyler's node install on macOS
export PATH="/Users/tylerwoodworth/local/node/bin:$PATH"

npm install      # one-time
cp .env.example .env.local   # then fill in values
npm run dev -- --port 3100
```

Open http://localhost:3100. If `GATE_PASSWORD` is unset in development the password gate is bypassed; in production it's required.

## Environment variables

See `.env.example`. The important ones:

- `GATE_PASSWORD` — shared password for the unlock screen
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client-side Supabase connection
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used by webhook handlers
- `TICKETS_WEBHOOK_SECRET`, `GITHUB_WEBHOOK_SECRET`, `FEEDBACK_WEBHOOK_SECRET` — webhook signing secrets

## Layout

```
src/
  app/
    layout.tsx          # Root layout — loads Roboto + AppShell
    page.tsx            # Dashboard
    roadmap/page.tsx
    projects/page.tsx
    ideas/page.tsx
    unlock/page.tsx     # Password gate UI
    api/
      unlock/route.ts   # Sets the gate cookie
      webhooks/         # (Phase 4) GitHub, tickets, feedback intake
  components/
    layout/
      AppShell.tsx      # Sidebar + Topbar + content slot
      Sidebar.tsx
      Topbar.tsx
      SyncIndicator.tsx # Realtime connection status pill
    PagePlaceholder.tsx # Stand-in until pages are ported from the prototype
  lib/
    cn.ts               # Class merger helper
  middleware.ts         # Password gate enforcement
supabase/
  migrations/           # (Phase 2) SQL migrations
scripts/
  import-from-v1.ts     # (Phase 6) One-shot v1 → v2 data import
```

## What's isolated from bid-sheet-v2

- Separate Supabase project (its own URL + keys)
- Separate GitHub repo
- Separate Vercel project
- Separate auth (currently a single shared password)
- No code path here ever writes back to bid-sheet-v2

The only inbound integrations are read-only webhooks: Evan's agent posts ticket status here, the BuildCore portal posts feedback here. Outbound to bid-sheet-v2: zero.

## Build order

1. Scaffolding + layout shell ✓
2. Supabase schema + seed (apply via `supabase/migrations/` + `supabase/seed.sql`) ✓
3. Port screens from the prototype ✓
   - Dashboard (My tasks, KPIs, projects, activity, pipeline, needs attention)
   - Projects list + Project hub
     - Overview (About, Snapshot, Product features, Activity)
     - Lifecycle (Gantt + phase checklists)
     - Tickets (Kanban + handoff drawer + feature filter)
     - Feedback (table)
     - Testing (by-feature view with pass/fail breakdown)
     - Pending (area-grouped, with per-area handoff prompt copy)
   - Roadmap (project + feature timeline)
   - Ideas (3-lane: New projects / New features / Enhancements)
4. Webhook endpoints — TODO
   - `/api/webhooks/github` (ticket sync from bid-sheet-v2 repo)
   - `/api/webhooks/tickets` (Evan's agent posting status updates)
   - `/api/webhooks/feedback` (BuildCore portal feedback submissions)
5. Realtime — partial ✓
   - SyncIndicator subscribed to live channel state ✓
   - MyTasks reads/writes/subscribes live ✓
   - Other tables read-only via anon (writes through service-role API routes later)
6. v1 → v2 import script — TODO
7. Vercel deploy ✓
   - Production: https://buildcore-release-tool.vercel.app
   - Env vars: GATE_PASSWORD + Supabase URL + anon key + service role key
   - Deploy: `vercel deploy --prod --yes` (from this directory, already linked)
