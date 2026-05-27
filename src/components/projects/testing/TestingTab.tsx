import { FlaskConical } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TEST_STATUS_LABEL } from "@/lib/mock";
import type { Feature, TestCase } from "@/lib/types";

type Props = {
  features: Feature[];
  cases: TestCase[];
};

/** Tests grouped by feature (matches the prototype's primary view).
    Each feature shows pass/fail/pending counts and a list of cases. */
export function TestingTab({ features, cases }: Props) {
  const byFeature = new Map<string, TestCase[]>();
  const orphans: TestCase[] = [];
  for (const c of cases) {
    if (c.featureId) {
      const arr = byFeature.get(c.featureId) ?? [];
      arr.push(c);
      byFeature.set(c.featureId, arr);
    } else {
      orphans.push(c);
    }
  }

  if (cases.length === 0) {
    return (
      <div className="rounded-[var(--bc-radius)] border border-dashed border-[var(--bc-border)] bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <FlaskConical size={22} />
        </div>
        <h3 className="mb-1.5">No test cases yet</h3>
        <p className="text-[12.5px] text-slate-500">
          Create test cases tied to features to track UAT and regression coverage.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3>Testing</h3>
        <span className="text-[11.5px] text-slate-400">
          By feature · {cases.length} cases
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {features
          .map((f) => ({ feature: f, items: byFeature.get(f.id) ?? [] }))
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <FeatureGroup key={g.feature.id} feature={g.feature} cases={g.items} />
          ))}

        {orphans.length > 0 && (
          <FeatureGroup feature={null} cases={orphans} />
        )}
      </div>
    </div>
  );
}

function FeatureGroup({ feature, cases }: { feature: Feature | null; cases: TestCase[] }) {
  const passed  = cases.filter((c) => c.status === "passed").length;
  const failed  = cases.filter((c) => c.status === "failed").length;
  const inProg  = cases.filter((c) => c.status === "in_progress").length;
  const total   = cases.length;
  const passPct = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex-1">
          <CardTitle>{feature ? feature.name : "Unassigned"}</CardTitle>
          <p className="mt-0.5 text-[11.5px] text-slate-400">
            {total} cases · {passed} passed · {failed} failed
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
            {passed > 0 && (
              <span
                className="absolute left-0 top-0 h-full"
                style={{ width: `${(passed / total) * 100}%`, background: "var(--bc-success-600)" }}
              />
            )}
            {failed > 0 && (
              <span
                className="absolute top-0 h-full"
                style={{ left: `${(passed / total) * 100}%`, width: `${(failed / total) * 100}%`, background: "var(--bc-danger-600)" }}
              />
            )}
            {inProg > 0 && (
              <span
                className="absolute top-0 h-full"
                style={{ left: `${((passed + failed) / total) * 100}%`, width: `${(inProg / total) * 100}%`, background: "var(--bc-info-600)" }}
              />
            )}
          </div>
          <span className="text-[12px] font-semibold tabular-nums">{passPct}%</span>
        </div>
      </CardHeader>
      <div className="bg-slate-50 px-4 py-3">
        {cases.map((c) => {
          const label = TEST_STATUS_LABEL[c.status];
          return (
            <div
              key={c.id}
              className="mb-2 rounded-lg border border-[var(--bc-border)] bg-white last:mb-0"
            >
              <div className="grid grid-cols-[24px_1fr_auto_auto] items-center gap-3 px-3.5 py-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background:
                      c.status === "passed"
                        ? "var(--bc-success-600)"
                        : c.status === "failed"
                          ? "var(--bc-danger-600)"
                          : c.status === "in_progress"
                            ? "var(--bc-info-600)"
                            : "var(--bc-slate-300)",
                  }}
                />
                <span className="text-[13.5px] font-medium">{c.name}</span>
                <span className="text-[12px] text-slate-500">{c.owner}</span>
                <Badge kind={label.kind} dot={false}>
                  {label.label}
                </Badge>
              </div>
              {c.status === "failed" && c.failureNote && (
                <div className="border-t border-slate-100 bg-danger-50/40 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-danger-700">
                  <strong className="text-[11px] font-bold uppercase tracking-wider text-danger-700">
                    What broke:
                  </strong>{" "}
                  {c.failureNote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
