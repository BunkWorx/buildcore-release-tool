# BuildCore Release Tool (v2)

Project-centric release planning, feature tracking, testing, and engineering-handoff coordination for BuildCore. **Sandboxed — does not write to the `bid-sheet-v2` production database, repo, or runtime.**

**Production:** https://buildcore-release-tool-six.vercel.app
**Login:** https://buildcore-release-tool-six.vercel.app/login
**Repo:** https://github.com/BunkWorx/buildcore-release-tool
**Supabase project:** `buildcore-release-tool` — ref `duullaauybtjnsotebvc` (BunkWorx org)

> The old URL `buildcore-release-tool.vercel.app` and the Supabase project `fbrdhbxfkxywzokbdznv` are **retired** — do not use them. Detailed maps live in [`docs/SOURCE-OF-TRUTH.md`](docs/SOURCE-OF-TRUTH.md) (full stack), [`docs/TEAM-LOGIN.md`](docs/TEAM-LOGIN.md) (team sign-in), and [`docs/CLAUDE-CODE-HANDOFF.md`](docs/CLAUDE-CODE-HANDOFF.md) (architecture + staging automation).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS (CSS-first theme, BuildCore tokens in `src/app/globals.css`)
- Supabase (Postgres + Auth + Realtime) — separate project from bid-sheet-v2
- TanStack Query for client cache
- Lucide icons
- Vercel deployment

## Auth (invite-only Supabase)

Login is Supabase email/password via `@supabase/ssr`, enforced in `src/middleware.ts` (which calls `updateSession` from `src/lib/supabase/middleware.ts`). There is **no shared password** — the legacy `GATE_PASSWORD` unlock gate has been removed.

- **Allowlist:** `RELEASE_TOOL_ALLOWED_EMAILS` (comma-separated) controls who may sign in. No public signup. `src/lib/auth/allowed-emails.ts` fails closed, but falls back to the three known BuildCore emails in production if the env var ships empty.
- **Profiles:** `release_tool_profiles` (display name + role) drives the sidebar greeting.
- **Provision / reset a user:**
  ```bash
  export SUPABASE_SERVICE_ROLE_KEY='<from Supabase dashboard → Project Settings → API>'
  node scripts/provision-release-tool-user.mjs <email> <password> "<Display Name>" "<Role>"
  ```
- **Supabase Auth redirect URL (production):** `https://buildcore-release-tool-six.vercel.app/auth/callback`

## Local development

```bash
npm install                    # one-time
cp .env.example .env.local     # then fill in values (see below)
npm run dev -- --port 3100
```

Open http://localhost:3100. Outside production, if `RELEASE_TOOL_ALLOWED_EMAILS` is empty the allowlist falls open so local dev is not blocked; if it is set, only those emails may sign in.

## Environment variables

See [`.env.example`](.env.example). The important ones:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — browser Supabase client
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; used by the webhook handlers and the provision script (the provision script also accepts `DEST_SERVICE`)
- `RELEASE_TOOL_ALLOWED_EMAILS` — comma-separated invite allowlist (required in production)
- `TICKETS_WEBHOOK_SECRET` — Bearer token for `/api/webhooks/tickets`; must match the GitHub secret `RELEASE_TOOL_TICKETS_WEBHOOK_SECRET` in `BunkWorx/buildcore-daily-tracker`
- `GITHUB_WEBHOOK_SECRET`, `FEEDBACK_WEBHOOK_SECRET` — other webhook secrets (if used)

> `GATE_PASSWORD` is legacy and no longer used for auth. Remove it from Vercel once confirmed.

## Layout

```
src/
  middleware.ts               # Supabase auth — refreshes the session + gates routes
  app/
    layout.tsx                # Root layout (fonts + AppShell)
    login/page.tsx            # Supabase email/password sign-in
    auth/callback/route.ts    # Supabase auth callback
    (app)/                    # Authenticated app: dashboard (page.tsx), projects, roadmap, ideas
    api/
      webhooks/
        tickets/route.ts      # Staging automation / agent posts ticket stage (Bearer auth)
        github/route.ts       # GitHub ticket sync
        feedback/route.ts     # BuildCore portal feedback intake
    globals.css
  lib/
    auth/allowed-emails.ts    # Invite allowlist + production fallback
    supabase/                 # browser / client / server (service-role) / middleware clients
supabase/
  migrations/                 # 0001 schema, 0002 task writes, 0003 auth profiles + RLS
scripts/
  provision-release-tool-user.mjs   # Create or reset an invite user
  import-from-v1.mjs                 # One-shot v1 → v2 data import
  dispatch-daily-tracker-bridge.mjs # Tracker bridge dispatch
```

## What's isolated from bid-sheet-v2

- Separate Supabase project (its own URL + keys)
- Separate GitHub repo and Vercel project
- Separate auth (invite-only Supabase email/password — independent of bid-sheet-v2)
- No code path here ever writes back to bid-sheet-v2

The only inbound integrations are authenticated webhooks: the staging automation posts ticket stage here, and the BuildCore portal posts feedback here. Outbound to bid-sheet-v2: zero.

## Staging → tracker automation

When **Bid-Sheet-v2** merges to `staging` and the Vercel staging deploy succeeds, `BunkWorx/buildcore-daily-tracker` calls `POST /api/webhooks/tickets` (Bearer `TICKETS_WEBHOOK_SECRET`) and moves the linked **BC-PORTAL-*** tickets to **On stage**. Full sequence + payload shape: [`docs/CLAUDE-CODE-HANDOFF.md`](docs/CLAUDE-CODE-HANDOFF.md).

## Deploy

Vercel project `bunkworks/buildcore-release-tool`, linked to this repo. Production environment variables live in the Vercel dashboard (Supabase URL + keys, `RELEASE_TOOL_ALLOWED_EMAILS`, `TICKETS_WEBHOOK_SECRET`). A push to `main` deploys production at https://buildcore-release-tool-six.vercel.app, or run `vercel deploy --prod --yes` from this directory.

## Health check

A scheduled GitHub Actions workflow (`.github/workflows/smoke-test.yml`) pings the production login page (expects `200`) and the ticket webhook unauthenticated (expects `401`) so an outage or broken deploy surfaces in Actions rather than from a user. It can also be run on demand from the Actions tab.
