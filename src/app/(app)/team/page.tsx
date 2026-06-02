export const dynamic = "force-dynamic";

import { AlertCircle } from "lucide-react";
import { getReleaseToolUser } from "@/lib/auth/session";
import { getTeamMembers, getTeamProjects, getTeamTickets } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { PRIORITY_KIND, TICKET_STAGES } from "@/lib/mock";
import { AssignSelect } from "./AssignSelect";
import type {
  TeamMember,
  TeamTicket,
  TicketPriority,
  TicketStage,
} from "@/lib/types";

const PRIORITY_RANK: Record<TicketPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
const STAGE_BY_ID = new Map(TICKET_STAGES.map((s) => [s.id, s]));
const STAGE_RANK = new Map(TICKET_STAGES.map((s, i) => [s.id, i]));

function byPriorityThenStage(a: TeamTicket, b: TeamTicket) {
  const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (p !== 0) return p;
  return (STAGE_RANK.get(a.stage) ?? 99) - (STAGE_RANK.get(b.stage) ?? 99);
}

function fmtDate(d: string | null) {
  if (!d) return null;
  const dt = new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StageBadge({ stage }: { stage: TicketStage }) {
  const s = STAGE_BY_ID.get(stage);
  return (
    <Badge kind={s?.kind ?? "neutral"} dot={false}>
      {s?.label ?? stage}
    </Badge>
  );
}

function TicketRow({
  ticket,
  members,
}: {
  ticket: TeamTicket;
  members: TeamMember[];
}) {
  return (
    <div className="rounded-lg border border-[var(--bc-border)] bg-white p-2.5">
      <div className="text-[13px] font-semibold leading-snug">
        {ticket.title}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
        <span className="font-mono text-slate-600">{ticket.ref}</span>
        {ticket.projectName && (
          <>
            <span>·</span>
            <span>{ticket.projectName}</span>
          </>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Badge kind={PRIORITY_KIND[ticket.priority]} dot={false}>
            {ticket.priority}
          </Badge>
          <StageBadge stage={ticket.stage} />
        </div>
        <AssignSelect
          kind="ticket"
          id={ticket.id}
          value={ticket.assigneeId}
          members={members}
        />
      </div>
    </div>
  );
}

export default async function TeamPage() {
  const [members, tickets, projects, me] = await Promise.all([
    getTeamMembers(),
    getTeamTickets(),
    getTeamProjects(),
    getReleaseToolUser(),
  ]);

  const unassigned = tickets
    .filter((t) => !t.assigneeId)
    .sort(byPriorityThenStage);

  return (
    <div>
      <div className="mb-6">
        <h1>Team</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Who is working on what, and each person&rsquo;s priorities.{" "}
          {tickets.length} tickets across {projects.length} projects.
        </p>
      </div>

      {unassigned.length > 0 && (
        <section className="mb-6 rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-warning-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle size={15} className="text-warning-700" />
            <span className="text-[13.5px] font-semibold text-warning-700">
              {unassigned.length} unassigned{" "}
              {unassigned.length === 1 ? "ticket" : "tickets"}
            </span>
            <span className="text-[12px] text-slate-500">
              pick an owner to put each one on someone&rsquo;s list
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-2.5">
            {unassigned.map((t) => (
              <TicketRow key={t.id} ticket={t} members={members} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
        {members.map((m) => {
          const mine = tickets
            .filter((t) => t.assigneeId === m.id)
            .sort(byPriorityThenStage);
          const owned = projects.filter((p) => p.ownerId === m.id);
          const isMe = me?.id === m.id;
          const urgent = mine.filter(
            (t) => t.priority === "critical" || t.priority === "high",
          ).length;
          const active = mine.filter((t) => t.stage !== "live").length;

          return (
            <section
              key={m.id}
              className="flex flex-col rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white p-4"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                  style={{ background: "var(--bc-brand-600)" }}
                >
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold leading-none">
                      {m.displayName}
                    </span>
                    {isMe && (
                      <span className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                        You
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-slate-400">
                    {m.roleLabel}
                  </div>
                </div>
                <div className="ml-auto text-right text-[11px] text-slate-400">
                  <div className="text-[15px] font-bold text-slate-700">
                    {mine.length}
                  </div>
                  {mine.length === 1 ? "ticket" : "tickets"}
                </div>
              </div>

              <div className="mb-3 flex items-center gap-1.5 text-[11.5px] text-slate-500">
                <span>{active} in flight</span>
                <span>·</span>
                <span>
                  {urgent} critical / high
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {mine.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[var(--bc-border)] p-4 text-center text-[12.5px] text-slate-400">
                    No tickets assigned yet.
                  </div>
                ) : (
                  mine.map((t) => (
                    <TicketRow key={t.id} ticket={t} members={members} />
                  ))
                )}
              </div>

              {owned.length > 0 && (
                <div className="mt-4 border-t border-[var(--bc-border)] pt-3">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Projects owned ({owned.length})
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {owned.map((p) => (
                      <div key={p.id}>
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="truncate font-medium">{p.name}</span>
                          <span className="ml-2 shrink-0 text-slate-400">
                            {p.completion}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${p.completion}%`,
                              background: "var(--bc-brand-500)",
                            }}
                          />
                        </div>
                        {fmtDate(p.targetReleaseDate) && (
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            Target {fmtDate(p.targetReleaseDate)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
