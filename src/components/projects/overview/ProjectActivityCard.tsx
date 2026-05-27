import { GitBranch, User, Link2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { getProjectActivity } from "@/lib/mock";

type Props = { projectName: string };

/** Recent activity scoped to a single project (filtered from the cross-project
    activity feed). */
export function ProjectActivityCard({ projectName }: Props) {
  const events = getProjectActivity(projectName);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>

      <div className="px-5 py-2">
        {events.length === 0 ? (
          <p className="py-3 text-[13px] text-slate-400">No activity yet.</p>
        ) : (
          events.map((a) => {
            const Icon =
              a.source === "agent" || a.source === "github"
                ? GitBranch
                : a.source === "portal"
                  ? Link2
                  : User;
            return (
              <div key={a.id} className="flex gap-3 py-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Icon size={14} />
                </div>
                <div className="text-[13px]">
                  <div>
                    <span className="font-semibold">{a.who}</span> {a.what}{" "}
                    {a.target && <span className="font-medium">{a.target}</span>}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-slate-400">
                    {a.meta && <>{a.meta} · </>}
                    {a.when}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
