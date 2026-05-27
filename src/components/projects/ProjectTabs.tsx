import Link from "next/link";
import { Activity, Ticket, MessageSquare, FlaskConical, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ProjectCounts } from "@/lib/types";

export type ProjectTab =
  | "overview"
  | "lifecycle"
  | "tickets"
  | "feedback"
  | "testing"
  | "pending";

type Props = {
  projectId: string;
  active: ProjectTab;
  counts: ProjectCounts;
};

type TabDef = {
  id: ProjectTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }> | null;
  countKey?: keyof ProjectCounts;
};

const TABS: TabDef[] = [
  { id: "overview",  label: "Overview",  icon: null },
  { id: "lifecycle", label: "Lifecycle", icon: Activity },
  { id: "tickets",   label: "Tickets",   icon: Ticket,        countKey: "tickets" },
  { id: "feedback",  label: "Feedback",  icon: MessageSquare, countKey: "feedback" },
  { id: "testing",   label: "Testing",   icon: FlaskConical,  countKey: "testing" },
  { id: "pending",   label: "Pending",   icon: Inbox,         countKey: "pending" },
];

/** Tab strip on the Project hub. Each tab is a Link with ?tab= so the
    selection persists in the URL (shareable + back-button works). */
export function ProjectTabs({ projectId, active, counts }: Props) {
  return (
    <div className="mb-6 flex gap-1 border-b border-[var(--bc-border)]">
      {TABS.map((t) => {
        const Icon = t.icon;
        const count = t.countKey ? counts[t.countKey] : undefined;
        const isActive = active === t.id;
        return (
          <Link
            key={t.id}
            href={t.id === "overview" ? `/projects/${projectId}` : `/projects/${projectId}?tab=${t.id}`}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
              isActive
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-500 hover:text-slate-900",
            )}
          >
            {Icon && <Icon size={14} />}
            {t.label}
            {count != null && count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-px text-[11px] font-semibold",
                  isActive ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500",
                )}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
