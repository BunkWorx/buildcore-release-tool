import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PROJECT_STATUS_BADGE_KIND } from "@/lib/mock";
import type { ProjectCounts, ProjectDetail } from "@/lib/types";

type Props = { project: ProjectDetail; counts: ProjectCounts };

/** Right-rail card showing completion %, next release, owner, status,
    and a few cross-tab counts. */
export function SnapshotCard({ project, counts }: Props) {
  const target = project.targetReleaseDate
    ? new Date(project.targetReleaseDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white p-6 shadow-[var(--bc-shadow-xs)]">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Snapshot
      </div>
      <div className="mb-1 flex items-baseline gap-1.5">
        <span className="text-[32px] font-extrabold tracking-tight">{project.completion}%</span>
        <span className="text-[12px] text-slate-400">complete</span>
      </div>
      <ProgressBar percent={project.completion} color={project.color} className="mb-5" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Target release" value={target} />
        <Field label="Owner" value={project.owner ?? "—"} />
        <Field
          label="Status"
          value={
            project.status ? (
              <Badge kind={PROJECT_STATUS_BADGE_KIND[project.statusKind]}>{project.status}</Badge>
            ) : (
              "—"
            )
          }
        />
        <Field label="Open feedback" value={counts.feedback.toString()} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="text-[13px] font-semibold">{value}</div>
    </div>
  );
}
