import type { ProjectDetail } from "@/lib/types";

type Props = { project: ProjectDetail };

/** "About this project" panel — description, objective, audience, success
    metrics. Mirrors the prototype's left card on the Overview tab. */
export function AboutCard({ project }: Props) {
  return (
    <div className="rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white p-6 shadow-[var(--bc-shadow-xs)]">
      <Section label="About this project">
        <p>{project.description}</p>
      </Section>

      {project.objective && (
        <Section label="Objective">
          <p>{project.objective}</p>
        </Section>
      )}

      {project.audience && (
        <Section label="Audience">
          <p>{project.audience}</p>
        </Section>
      )}

      {project.successMetrics.length > 0 && (
        <Section label="Success metrics" last>
          <ol className="m-0 list-none p-0">
            {project.successMetrics.map((m, i) => (
              <li
                key={i}
                className="relative py-1.5 pl-8 text-[13.5px] leading-relaxed"
              >
                <span
                  className="absolute left-0 top-1.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded text-[10px] font-bold"
                  style={{
                    background: "var(--bc-brand-50)",
                    color: "var(--bc-brand-700)",
                  }}
                >
                  {i + 1}
                </span>
                {m}
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}

function Section({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-5"}>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="text-[14px] leading-relaxed">{children}</div>
    </div>
  );
}
