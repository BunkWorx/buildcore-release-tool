import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseService } from "@/lib/supabase/server";

/** /api/webhooks/github
 *
 * GitHub webhook receiver. Authenticated via X-Hub-Signature-256 against
 * GITHUB_WEBHOOK_SECRET. Handles:
 *   - issues opened/edited/closed   → tickets table
 *   - pull_request opened/closed    → tickets.activity row + pr_number
 *
 * We extract a ref like `BC-7544` from the issue/PR title and use it to
 * match a row in the `tickets` table.
 *
 * This is a thin stub — full event coverage lands when we expand the
 * GitHub integration in Phase 6/7. Right now it accepts the call and
 * logs the event so the wiring is provable end-to-end. */

const REF_PATTERN = /\b(BC-\d+)\b/;

function verify(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !signature.startsWith("sha256=")) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type GithubPayload = {
  action?: string;
  issue?: { title?: string; html_url?: string; number?: number };
  pull_request?: { title?: string; number?: number; html_url?: string };
  repository?: { full_name?: string };
};

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const raw = await request.text();
  if (!verify(raw, request.headers.get("x-hub-signature-256"), secret)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event") ?? "unknown";

  let payload: GithubPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const sb = supabaseService();
  const title = payload.issue?.title ?? payload.pull_request?.title ?? "";
  const match = title.match(REF_PATTERN);
  const ref = match?.[1];

  if (!ref) {
    return NextResponse.json({ ok: true, ignored: "no ticket ref found in title" });
  }

  // Find or create the ticket row by ref
  const { data: ticket } = await sb
    .from("tickets")
    .select("id, project_id, title")
    .eq("ref", ref)
    .maybeSingle();

  if (!ticket) {
    return NextResponse.json({ ok: true, ignored: "unknown ticket ref", ref });
  }

  // Record the event
  const repo = payload.repository?.full_name ?? null;
  const meta = (() => {
    if (event === "pull_request" && payload.action === "opened" && payload.pull_request?.number) {
      return `Opened PR #${payload.pull_request.number}`;
    }
    if (event === "issues" && payload.action === "edited") return "Edited";
    if (event === "issues" && payload.action === "closed") return "Closed";
    return `${event}/${payload.action ?? ""}`;
  })();

  await sb.from("ticket_activity").insert({
    ticket_id: ticket.id,
    who: "GitHub",
    what: meta,
    meta: repo,
    source: "github",
  });

  // If PR opened, also stamp pr_number on the ticket
  if (event === "pull_request" && payload.action === "opened" && payload.pull_request?.number) {
    await sb.from("tickets").update({ pr_number: payload.pull_request.number }).eq("id", ticket.id);
  }

  return NextResponse.json({ ok: true, ref, event, action: payload.action ?? null });
}

// Allow GET for health checks (returns 405 method-style but useful for diag)
export function GET() {
  return NextResponse.json({ ok: true, endpoint: "github webhook" });
}
