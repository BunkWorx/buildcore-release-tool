import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Public build-version endpoint (no auth, no secrets). Returns the commit the
 *  running deployment was built from, so the production smoke test can confirm
 *  the live site is serving the latest merged commit. This is how a stale or
 *  missed Vercel deploy gets caught automatically instead of someone noticing a
 *  404. */
export function GET() {
  return NextResponse.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown",
    ref: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    env: process.env.VERCEL_ENV ?? "local",
  });
}
