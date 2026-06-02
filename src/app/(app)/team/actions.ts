"use server";

import { revalidatePath } from "next/cache";
import { getReleaseToolUser } from "@/lib/auth/session";
import { supabaseService } from "@/lib/supabase/server";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Result = { ok: boolean; error?: string };

/** Assign (or clear) a ticket's owner. Service-role write, gated on the caller
 *  being a signed-in, allow-listed release-tool user. The assigned_to FK to
 *  release_tool_profiles guarantees the id resolves to a real person. */
export async function assignTicket(
  ticketId: string,
  assigneeId: string | null,
): Promise<Result> {
  const user = await getReleaseToolUser();
  if (!user) return { ok: false, error: "not_authorized" };
  if (!UUID.test(ticketId)) return { ok: false, error: "bad_ticket_id" };
  if (assigneeId !== null && !UUID.test(assigneeId))
    return { ok: false, error: "bad_assignee_id" };

  const sb = supabaseService();
  const { error } = await sb
    .from("tickets")
    .update({ assigned_to: assigneeId })
    .eq("id", ticketId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/team");
  return { ok: true };
}

/** Set (or clear) a project's structured owner. Same gating as assignTicket. */
export async function setProjectOwner(
  projectId: string,
  ownerId: string | null,
): Promise<Result> {
  const user = await getReleaseToolUser();
  if (!user) return { ok: false, error: "not_authorized" };
  if (!UUID.test(projectId)) return { ok: false, error: "bad_project_id" };
  if (ownerId !== null && !UUID.test(ownerId))
    return { ok: false, error: "bad_owner_id" };

  const sb = supabaseService();
  const { error } = await sb
    .from("projects")
    .update({ owner_id: ownerId })
    .eq("id", projectId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/team");
  return { ok: true };
}
