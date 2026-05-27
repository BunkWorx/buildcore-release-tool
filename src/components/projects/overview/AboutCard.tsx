import type { ProjectDetail } from "@/lib/types";

type Props = { project: ProjectDetail };

/** "About this project" panel — description, objective, audience, success
    metrics. Mirrors the prototype's left card on the Overview tab. */
export function AboutCard({ project }: Props) {
  return (
    <div className="rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white p-6 shadow-[var(--bc-shadow-xs)]">
      <Label>About this project</Label>
      <p className="mb-4 text-[14px] leading-relaxed">{project.description}</p>

      {project.objective && (
        <>
          <Label>Objective</Label>
          <p className="mb-4 text-[14px] leading-relaxed">{project.objective}</p>
        </>
      )}

      {project.audience && (
        <>
          <Label>Audience</Label>
          <p className="mb-4 text-[14px] leading-relaxed">{project.audience}</p>
        </>
      )}

      {project.successMetrics.length > 0 && (
        <>
          <Label>Success metrics</Label>
          <ul className="list-none p-0">
            {project.successMetrics.map((m, i) => (
              <li
                key={i}
                className="relative py-1 pl-7 text-[13.5px] leading-relaxed"
              >
                <span className="absolute left-0 top-1.5 inline-flex h-4 w-4 items-center justify-center rounded bg-brand-50 text-[10px] font-bold text-brand-700">
                  {i + 1}
                </span>
                {m}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </div>
  );
}
