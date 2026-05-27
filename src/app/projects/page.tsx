import { Plus } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock";
import { ProjectCard } from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Projects</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {MOCK_PROJECTS.length} active release projects
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium text-white"
          style={{ background: "var(--bc-brand-600)" }}
        >
          <Plus size={14} />
          New project
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-4">
        {MOCK_PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
