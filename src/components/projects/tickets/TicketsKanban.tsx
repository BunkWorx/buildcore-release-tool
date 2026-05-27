import Link from "next/link";
import { GitBranch, Link as LinkIcon, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { TICKET_STAGES, PRIORITY_KIND, getFeatureById, getProjectTicketsFiltered } from "@/lib/mock";
import type { Ticket } from "@/lib/types";

type Props = {
  projectId: string;
  projectRepo: string | null;
  featureId: string | null;
};

/** Kanban for the project's tickets. Reads filter state from the URL and
    narrows columns + counts when ?feature= is present. */
export function TicketsKanban({ projectId, projectRepo, featureId }: Props) {
  const all = getProjectTicketsFiltered(projectId, null);
  const filtered = getProjectTicketsFiltered(projectId, featureId);
  const feature = featureId ? getFeatureById(projectId, featureId) : null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3>Tickets</h3>
        <div className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-400">
          <GitBranch size={12} />
          Synced from {projectRepo ?? "GitHub"} · last 5m ago
        </div>
      </div>

      {feature && (
        <div
          className="mb-4 flex flex-wrap items-center gap-2.5 rounded-[var(--bc-radius)] border px-4 py-3 text-[13px]"
          style={{
            background: "var(--bc-brand-50)",
            borderColor: "var(--bc-brand-100)",
          }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
            Filter
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500 bg-white px-2.5 py-1 text-[12.5px] font-semibold text-brand-700">
            <LinkIcon size={11} />
            {feature.name}
            <Link
              href={`/projects/${projectId}?tab=tickets`}
              className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-brand-700 hover:bg-brand-100"
              aria-label="Clear filter"
            >
              ×
            </Link>
          </span>
          <span className="text-[12.5px] text-slate-500">
            Showing {filtered.length} of {all.length} tickets
          </span>
          <Link
            href={`/projects/${projectId}?tab=tickets`}
            className="ml-auto text-[12.5px] font-semibold text-brand-700 underline"
          >
            Clear filter
          </Link>
        </div>
      )}

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        {TICKET_STAGES.map((stage) => {
          const inStage = filtered.filter((t) => t.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="flex min-h-[200px] flex-col gap-2 rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between px-1 pb-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                <span>{stage.label}</span>
                <span className="rounded-full border border-[var(--bc-border)] bg-white px-1.5 text-[10.5px] font-semibold text-slate-500">
                  {inStage.length}
                </span>
              </div>
              {inStage.map((t) => (
                <TicketCard key={t.id} ticket={t} projectId={projectId} feature={featureId} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  projectId,
  feature,
}: {
  ticket: Ticket;
  projectId: string;
  feature: string | null;
}) {
  const params = new URLSearchParams();
  params.set("tab", "tickets");
  if (feature) params.set("feature", feature);
  params.set("ticket", ticket.ref);
  const href = `/projects/${projectId}?${params.toString()}`;

  return (
    <Link
      href={href}
      className="block cursor-pointer rounded-lg border border-[var(--bc-border)] bg-white p-2.5 text-[12.5px] shadow-[var(--bc-shadow-xs)] transition-shadow hover:shadow-[var(--bc-shadow-sm)]"
    >
      <div className="mb-1 text-[13px] font-semibold leading-snug">{ticket.title}</div>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <span className="font-mono text-[11px] text-slate-600">{ticket.ref}</span>
        <span>·</span>
        <Badge kind={PRIORITY_KIND[ticket.priority]} dot={false}>
          {ticket.priority}
        </Badge>
        {ticket.hasHandoff && (
          <span className="ml-auto inline-flex items-center gap-1 text-brand-700">
            <ArrowRight size={10} />
            Handoff
          </span>
        )}
      </div>
    </Link>
  );
}
