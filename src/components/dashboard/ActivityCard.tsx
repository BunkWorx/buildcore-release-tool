import { GitBranch, User, Link2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { MOCK_ACTIVITY } from "@/lib/mock";

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <span className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-success-600" />
          Streaming · last 24 hours
        </span>
      </CardHeader>

      <div className="px-5 py-2">
        {MOCK_ACTIVITY.map((a) => {
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
                  {a.projectName && <> · {a.projectName}</>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
