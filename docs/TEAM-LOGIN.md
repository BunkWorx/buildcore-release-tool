# BuildCore Release Tool — team login

**URL (only):** https://buildcore-release-tool-six.vercel.app/login

Do not use `buildcore-release-tool.vercel.app` (retired).

## Who can sign in

Invite-only `@mybuildcore.com` accounts:

- evan@mybuildcore.com
- tyler.woodworth@mybuildcore.com
- alex.bilba@mybuildcore.com

No signup page. No shared password. No Vercel or Supabase setup for Tyler or Alex.

## First login

1. Open the login URL above.
2. Enter your **@mybuildcore.com** email and the **temporary password** Evan sends you (Slack DM or 1Password).
3. After login you see your name and role in the sidebar; all projects and tickets are the migrated tracker data (8 projects).
4. Change your password when Supabase prompts you, or ask Evan to run `node scripts/provision-release-tool-user.mjs` with a new password.

## Staging → tracker automation

When Bid-Sheet staging deploy succeeds, `BunkWorx/buildcore-daily-tracker` calls the release tool webhook and moves BC-PORTAL-* tickets to **On stage**. No manual step for Tyler.

## Evan only (ops)

- Vercel: `bunkworks/buildcore-release-tool`
- Supabase: project `duullaauybtjnsotebvc`
- Provision user: `node scripts/provision-release-tool-user.mjs <email> <password> "<name>" "<role>"`
- Allowlist env: `RELEASE_TOOL_ALLOWED_EMAILS` on Vercel production

See `docs/SOURCE-OF-TRUTH.md` for the full stack map.
