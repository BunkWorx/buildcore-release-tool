import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PROJECT_STATUS_BADGE_KIND, getProjectCounts } from "@/lib/mock";
import type { Project } from "@/lib/types";

/** Card representing one project on the Projects list. The colored left edge
    is the project's accent color. */
export function ProjectCard({ project }: { project: Project }) {
  const counts = getProjectCounts(project.id);
  const target = project.targetReleaseDate
    ? new Date(project.targetReleaseDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative block overflow-hidden rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white p-5 shadow-[var(--bc-shadow-xs)] transition-shadow hover:shadow-[var(--bc-shadow-md)]"
    >
      <span
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: project.color }}
      />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-base font-bold">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-[12.5px] leading-snug text-slate-500">
              {project.description}
            </p>
          )}
        </div>
        {project.status && (
          <Badge kind={PROJECT_STATUS_BADGE_KIND[project.statusKind]}>
            {project.status}
          </Badge>
        )}
      </div>

      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between text-[12px] text-slate-500">
          <span>{project.completion}% complete</span>
          {target && <span className="tabular-nums">Target {target}</span>}
        </div>
        <ProgressBar percent={project.completion} color={project.color} />
      </div>

      <div className="flex gap-3 text-[12px] text-slate-500">
        <span>{counts.tickets} tickets</span>
        <span>{counts.feedback} feedback</span>
        <span>{counts.testing} test cases</span>
      </div>
    </Link>
  );
}
