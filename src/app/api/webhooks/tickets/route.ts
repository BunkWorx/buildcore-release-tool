import { NextResponse, type NextRequest } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import type { TicketStage } from "@/lib/types";

/** /api/webhooks/tickets
 *
 * Evan's agent calls this every time a ticket changes stage in the repo.
 *
 * Auth: Bearer token in the Authorization header must match
 *       TICKETS_WEBHOOK_SECRET from env.
 *
 * Payload:
 *   {
 *     "ref": "BC-7544",
 *     "title": "...",
 *     "stage": "in_dev" | "on_stage" | "ready" | "live" | "created",
 *     "project_id": "uuid",        // optional — used on first insert
 *     "branch": "...",             // optional
 *     "pr_number": 234,            // optional
 *     "actor": "Evan agent"        // optional, defaults to "Evan agent"
 *   }
 *
 * Behavior:
 *   - Upserts the row in tickets keyed by ref.
 *   - Inserts a ticket_activity row reflecting the change.
 *   - Inserts an activity_events row so the cross-project feed sees it.
 */

type Body = {
  ref?: unknown;
  title?: unknown;
  stage?: unknown;
  project_id?: unknown;
  branch?: unknown;
  pr_number?: unknown;
  actor?: unknown;
};

const VALID_STAGES: TicketStage[] = ["created", "in_dev", "on_stage", "ready", "live"];

function checkAuth(request: NextRequest): boolean {
  const expected = process.env.TICKETS_WEBHOOK_SECRET;
  if (!expected) return false;
  const auth = request.headers.get("authorization") ?? "";
  return auth === `Bearer ${expected}`;
}

const STAGE_LABEL: Record<TicketStage, string> = {
  created: "Created",
  in_dev: "In dev",
  on_stage: "On stage",
  ready: "Ready",
  live: "Live",
};

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const ref = typeof body.ref === "string" ? body.ref.trim() : null;
  const stage = typeof body.stage === "string" ? (body.stage as TicketStage) : null;
  if (!ref || !stage || !VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: "missing_ref_or_stage" }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title : null;
  const projectId = typeof body.project_id === "string" ? body.project_id : null;
  const branch = typeof body.branch === "string" ? body.branch : null;
  const prNumber = typeof body.pr_number === "number" ? body.pr_number : null;
  const actor = typeof body.actor === "string" && body.actor.trim() ? body.actor.trim() : "Evan agent";

  const sb = supabaseService();

  // Read current state so we can record a precise stage transition
  const { data: existing } = await sb
    .from("tickets")
    .select("id, project_id, stage, title")
    .eq("ref", ref)
    .maybeSingle();

  // UPDATE for existing tickets (so we don't have to supply NOT-NULL columns
  // like title); INSERT for brand-new tickets.
  let ticketRow: { id: string; project_id: string | null; title: string };
  if (existing) {
    const patch: Record<string, unknown> = {
      stage,
      last_synced_at: new Date().toISOString(),
    };
    if (title) patch.title = title;
    if (branch) patch.branch = branch;
    if (prNumber != null) patch.pr_number = prNumber;
    const { data, error } = await sb
      .from("tickets")
      .update(patch)
      .eq("id", existing.id)
      .select("id, project_id, title")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    ticketRow = data;
  } else {
    if (!projectId) {
      return NextResponse.json(
        { error: "project_id_required_for_new_ticket" },
        { status: 400 },
      );
    }
    const insertRow = {
      ref,
      title: title ?? ref,
      stage,
      project_id: projectId,
      branch,
      pr_number: prNumber,
      last_synced_at: new Date().toISOString(),
    };
    const { data, error } = await sb
      .from("tickets")
      .insert(insertRow)
      .select("id, project_id, title")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    ticketRow = data;
  }

  // Insert the activity entry
  const stageChanged = existing && existing.stage !== stage;
  const what = stageChanged ? "moved" : existing ? "synced" : "created";
  const meta = stageChanged
    ? `${STAGE_LABEL[existing!.stage as TicketStage]} → ${STAGE_LABEL[stage]}`
    : null;

  await sb.from("ticket_activity").insert({
    ticket_id: ticketRow.id,
    who: actor,
    what,
    meta,
    source: "agent",
  });

  await sb.from("activity_events").insert({
    project_id: ticketRow.project_id,
    who: actor,
    what,
    target: `${ref} ${ticketRow.title}`,
    meta,
    source: "agent",
  });

  return NextResponse.json({ ok: true, ref, stage, created: !existing });
}
