import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROJECTS, PROJECT_STATUS_BADGE_KIND } from "@/lib/mock";

export function ProjectsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12.5px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          View all
          <ArrowRight size={12} />
        </Link>
      </CardHeader>

      {MOCK_PROJECTS.map((p) => {
        const targetDate = p.targetReleaseDate
          ? new Date(p.targetReleaseDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : null;
        return (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="grid grid-cols-[12px_1fr_auto] items-center gap-4 border-b border-[var(--bc-border)] px-5 py-4 last:border-b-0 hover:bg-slate-50"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            <div>
              <div className="text-[14px] font-semibold">{p.name}</div>
              <div className="mt-0.5 text-[12px] text-slate-500">
                {p.completion}% complete
                {targetDate && <> · target {targetDate}</>}
              </div>
            </div>
            {p.status && (
              <Badge kind={PROJECT_STATUS_BADGE_KIND[p.statusKind]}>{p.status}</Badge>
            )}
          </Link>
        );
      })}
    </Card>
  );
}
