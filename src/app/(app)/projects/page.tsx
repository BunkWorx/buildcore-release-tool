export const dynamic = "force-dynamic";

import { Plus } from "lucide-react";
import { getAllProjects, getProjectCounts } from "@/lib/db";
import { ProjectCard } from "@/components/projects/ProjectCard";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const counts = await Promise.all(projects.map((p) => getProjectCounts(p.id)));
  const projectsWithCounts = projects.map((p, i) => ({ project: p, counts: counts[i] }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Projects</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {projects.length} active release projects
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
        {projectsWithCounts.map(({ project, counts }) => (
          <ProjectCard key={project.id} project={project} counts={counts} />
        ))}
      </div>
    </div>
  );
}
