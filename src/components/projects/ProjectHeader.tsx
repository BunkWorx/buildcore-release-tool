import { Link2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PROJECT_STATUS_BADGE_KIND } from "@/lib/mock";
import type { ProjectDetail } from "@/lib/types";

/** Top-of-hub header: project name, status, description, action buttons. */
export function ProjectHeader({ project }: { project: ProjectDetail }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="mb-1.5 flex flex-wrap items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: project.color }}
          />
          <h1>{project.name}</h1>
          {project.status && (
            <Badge kind={PROJECT_STATUS_BADGE_KIND[project.statusKind]}>
              {project.status}
            </Badge>
          )}
        </div>
        {project.description && (
          <p className="mt-1 text-sm text-slate-600">{project.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        {project.externalRepo && (
          <a
            href={`https://github.com/${project.externalRepo}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--bc-border)] bg-white px-3.5 py-2 text-[13.5px] font-medium hover:bg-slate-50"
          >
            <Link2 size={14} />
            Open in GitHub
          </a>
        )}
        <button
          className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium text-white"
          style={{ background: "var(--bc-brand-600)" }}
        >
          <Plus size={14} />
          Quick action
        </button>
      </div>
    </div>
  );
}
