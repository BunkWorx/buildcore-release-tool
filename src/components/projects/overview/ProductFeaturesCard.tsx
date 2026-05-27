import Link from "next/link";
import { ArrowRight, Lightbulb, Plus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FEATURE_STATUS_LABEL } from "@/lib/mock";
import type { Feature, ProjectCounts } from "@/lib/types";

type Props = {
  projectId: string;
  features: Feature[];
  counts: ProjectCounts;
};

/** Master feature list for a project. Drives the Roadmap timeline. */
export function ProductFeaturesCard({ projectId, features, counts }: Props) {
  const liveCount = features.filter((f) => f.status === "live").length;

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="m-0 text-[15px] font-bold">Product features</h3>
          <p className="mt-0.5 text-[11.5px] text-slate-400">
            {features.length} features
            {liveCount > 0 && <> · {liveCount} already live</>}
            <> · drives the Roadmap timeline</>
          </p>
        </div>
        <div className="flex gap-1.5">
          {counts.proposedFromIdeas > 0 && (
            <Link
              href="/ideas"
              title={`${counts.proposedFromIdeas} related ideas in the backlog`}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <Lightbulb size={12} />
              {counts.proposedFromIdeas} from Ideas
            </Link>
          )}
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bc-border)] bg-white px-2.5 py-1.5 text-[12.5px] font-medium hover:bg-slate-50">
            <Plus size={12} />
            Add feature
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 gap-3 p-5 lg:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => {
          const status = FEATURE_STATUS_LABEL[f.status];
          const hasTickets = f.ticketRefs.length > 0;
          const target = hasTickets
            ? `/projects/${projectId}?tab=tickets&feature=${f.id}`
            : null;
          const className =
            "group block rounded-[10px] border border-[var(--bc-border)] bg-white p-4 transition-shadow hover:border-brand-300 hover:shadow-[var(--bc-shadow-sm)]";
          const inner = (
            <>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="text-[14.5px] font-semibold leading-snug">{f.name}</h4>
                  {f.description && (
                    <p className="mt-1 text-[12.5px] leading-snug text-slate-500">
                      {f.description}
                    </p>
                  )}
                </div>
                <Badge kind={status.kind}>{status.label}</Badge>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11.5px] text-slate-400">
                <div className="flex flex-wrap gap-1">
                  {f.ticketRefs.length === 0 ? (
                    <span>No tickets yet</span>
                  ) : (
                    f.ticketRefs.map((ref) => (
                      <span
                        key={ref}
                        className="rounded bg-slate-100 px-1.5 py-px font-mono text-[10.5px] font-semibold text-slate-600"
                      >
                        {ref}
                      </span>
                    ))
                  )}
                </div>
                <span className="inline-flex items-center gap-1">
                  {f.ticketRefs.length} {f.ticketRefs.length === 1 ? "ticket" : "tickets"}
                  {hasTickets && <ArrowRight size={12} />}
                </span>
              </div>
            </>
          );
          return target ? (
            <Link key={f.id} href={target} className={className}>
              {inner}
            </Link>
          ) : (
            <div key={f.id} className={className}>
              {inner}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
