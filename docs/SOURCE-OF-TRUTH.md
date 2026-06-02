# Release tool — single source of truth

## Playbook (do this first — never ask Tyler for BunkWorx Vercel env)

When staging automation or the release tool needs to work:

1. **One stack:** `buildcore-release-tool-six.vercel.app` + BunkWorx Supabase `duullaauybtjnsotebvc` (you control both).
2. **If Tyler’s data lives elsewhere:** export from his Supabase (anon read is enough) and import into the org project (`scripts/migrate-tyler-to-bunkworx.mjs`). Same UUIDs, one database.
3. **Wire automation** (webhook secret, service role) on **your** Vercel only.
4. **Tell Tyler one URL** — no env vars, no BunkWorx dashboard access required.

**Do not:**

- Create a second empty Supabase “for automation” while Tyler’s DB still has the real projects.
- Ask Tyler to set `SUPABASE_SERVICE_ROLE_KEY` / secrets on `bunkworks/*` (he cannot; that was the wrong dependency).
- Treat “Tyler said done” on **his** Vercel as done on **yours** — they are different projects.

Tyler being on the Supabase **team** does not grant access to his **personal** project or your **Vercel** team. Migration + one URL fixes that without looping him.

## The one production stack

| Layer | Canonical |
|--------|-----------|
| App | https://buildcore-release-tool-six.vercel.app |
| Vercel | `bunkworks/buildcore-release-tool` |
| Database | Supabase `buildcore-release-tool` in BunkWorx org (`duullaauybtjnsotebvc`) |
| Staging ticket sync | `BunkWorx/buildcore-daily-tracker` → `POST /api/webhooks/tickets` on **six** |

## Deprecated (do not use)

- https://buildcore-release-tool.vercel.app
- Supabase project `fbrdhbxfkxywzokbdznv` (Tyler personal)

Historical data from the deprecated database was copied into the BunkWorx project on 2026-06-02.

## Who does what

- **Evan / eng:** Vercel + Supabase org + GitHub secrets + `RELEASE_TOOL_ALLOWED_EMAILS` on Vercel.
- **Tyler:** Sign in at **six** with his **@mybuildcore.com** invite (no shared password, no Vercel access).

## Auth (invite-only)

- **Login:** https://buildcore-release-tool-six.vercel.app/login — Supabase email/password.
- **Allowlist:** `RELEASE_TOOL_ALLOWED_EMAILS` (comma-separated). No public signup.
- **Greeting:** from `release_tool_profiles` (display name + role per user).
- **Provision user:** `node scripts/provision-release-tool-user.mjs <email> <password> "<name>" "<role>"`
- **Supabase Auth redirect URL:** `https://buildcore-release-tool-six.vercel.app/auth/callback`
- **Disable** “Confirm email” for invites if using pre-confirmed admin-created users.

## Re-run data copy (optional)

```bash
node scripts/migrate-tyler-to-bunkworx.mjs
```

Requires `DEST_SERVICE` (BunkWorx service role). Source is read via public anon RLS on the legacy project.
