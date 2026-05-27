import { PHASE_COLOR_VAR } from "@/lib/mock";
import type { Phase } from "@/lib/types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TODAY_PCT = 41; // mid-May for the demo

/** Single-project Gantt — one row per phase, rendered against a 12-month
    grid. The vertical "Today" line marks the current date. */
export function ProjectGantt({ phases }: { phases: Phase[] }) {
  return (
    <div className="overflow-hidden rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white">
      <div className="grid border-b border-[var(--bc-border)] bg-slate-50" style={{ gridTemplateColumns: "240px 1fr" }}>
        <div className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phase</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
          {MONTHS.map((m) => (
            <div key={m} className="border-l border-[var(--bc-border)] py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {m}
            </div>
          ))}
        </div>
      </div>
      {phases.map((p) => {
        const left = (p.startMonth / 12) * 100;
        const width = ((p.endMonth - p.startMonth) / 12) * 100;
        return (
          <div key={p.id} className="grid border-b border-[var(--bc-border)] last:border-b-0" style={{ gridTemplateColumns: "240px 1fr" }}>
            <div className="flex items-center gap-2.5 border-r border-[var(--bc-border)] bg-white px-4 py-3 text-[13px] font-medium">
              {p.name}
            </div>
            <div
              className="relative min-h-[48px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, var(--bc-slate-100) 0 1px, transparent 1px calc(100%/12))",
              }}
            >
              <div
                className="absolute top-3 flex h-[22px] items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-md px-2 text-[11.5px] font-semibold text-white shadow-[0_1px_0_rgba(15,23,42,0.05)]"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: PHASE_COLOR_VAR[p.color],
                }}
                title={p.name}
              >
                {p.name}
              </div>
              <div
                className="pointer-events-none absolute inset-y-0"
                style={{ left: `${TODAY_PCT}%`, borderLeft: "2px dashed var(--bc-danger-600)" }}
              >
                <span
                  className="absolute -left-[22px] -top-[22px] rounded px-1.5 py-px text-[10px] font-bold text-white"
                  style={{ background: "var(--bc-danger-600)" }}
                >
                  Today
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
