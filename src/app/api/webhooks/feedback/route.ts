import { NextResponse, type NextRequest } from "next/server";
import { supabaseService } from "@/lib/supabase/server";
import type { FeedbackPriority } from "@/lib/types";

/** /api/webhooks/feedback
 *
 * The BuildCore portal POSTs here when a user submits feedback via the
 * in-portal widget.
 *
 * Auth: Bearer token in the Authorization header must match
 *       FEEDBACK_WEBHOOK_SECRET from env.
 *
 * Payload:
 *   {
 *     "project_id": "uuid",                // required
 *     "title": "Approve button too small", // required
 *     "body": "...",                       // optional, longer description
 *     "priority": "low|medium|high|critical",  // optional, default medium
 *     "source": "BuildCore portal",        // optional, default "BuildCore portal"
 *     "reported_by": "Auto-routed"         // optional
 *   }
 */

type Body = {
  project_id?: unknown;
  title?: unknown;
  body?: unknown;
  priority?: unknown;
  source?: unknown;
  reported_by?: unknown;
};

const VALID_PRIORITY: FeedbackPriority[] = ["low", "medium", "high", "critical"];

export async function POST(request: NextRequest) {
  const expected = process.env.FEEDBACK_WEBHOOK_SECRET;
  if (!expected || request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const projectId = typeof body.project_id === "string" ? body.project_id : null;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!projectId || !title) {
    return NextResponse.json({ error: "missing_project_id_or_title" }, { status: 400 });
  }
  const descBody = typeof body.body === "string" ? body.body : null;
  const priority = typeof body.priority === "string" && VALID_PRIORITY.includes(body.priority as FeedbackPriority)
    ? (body.priority as FeedbackPriority)
    : "medium";
  const source = typeof body.source === "string" && body.source.trim() ? body.source.trim() : "BuildCore portal";
  const reportedBy = typeof body.reported_by === "string" ? body.reported_by : null;

  const sb = supabaseService();
  const { data, error } = await sb
    .from("feedback_items")
    .insert({
      project_id: projectId,
      title,
      body: descBody,
      priority,
      status: "open",
      source,
      reported_by: reportedBy,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sb.from("activity_events").insert({
    project_id: projectId,
    who: source,
    what: "submitted feedback",
    target: title,
    meta: `${priority.charAt(0).toUpperCase() + priority.slice(1)}${reportedBy ? ` · ${reportedBy}` : ""}`,
    source: "portal",
  });

  return NextResponse.json({ ok: true, id: data.id });
}
