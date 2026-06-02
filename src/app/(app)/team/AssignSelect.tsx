"use client";

import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { assignTicket, setProjectOwner } from "./actions";
import type { TeamMember } from "@/lib/types";

/** Small native-select control for assigning a ticket owner or a project owner.
 *  Calls the matching server action; revalidatePath("/team") refreshes the
 *  server-rendered lists, and useTransition keeps the control disabled while the
 *  write is in flight. Native select so it stays accessible and dependency-free. */
export function AssignSelect({
  kind,
  id,
  value,
  members,
}: {
  kind: "ticket" | "project";
  id: string;
  value: string | null;
  members: TeamMember[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <span className="relative inline-flex items-center">
      <select
        aria-label={kind === "ticket" ? "Assign ticket" : "Set project owner"}
        disabled={pending}
        value={value ?? ""}
        onChange={(e) => {
          const next = e.target.value || null;
          startTransition(async () => {
            if (kind === "ticket") await assignTicket(id, next);
            else await setProjectOwner(id, next);
          });
        }}
        className="appearance-none rounded-md border border-[var(--bc-border)] bg-white py-1 pl-2 pr-6 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 focus:border-brand-500 focus:outline-none disabled:opacity-50"
      >
        <option value="">Unassigned</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.displayName}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-1.5 text-slate-400"
      />
    </span>
  );
}
