import { Plus } from "lucide-react";
import { MyTasks } from "@/components/dashboard/MyTasks";
import { StatGrid } from "@/components/dashboard/StatGrid";
import { ProjectsCard } from "@/components/dashboard/ProjectsCard";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { TicketPipelineCard } from "@/components/dashboard/TicketPipelineCard";
import { NeedsAttentionCard } from "@/components/dashboard/NeedsAttentionCard";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Welcome back, Tyler</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Snapshot across all BuildCore release projects
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--bc-border)] bg-white px-3.5 py-2 text-[13.5px] font-medium hover:bg-slate-50">
            <Plus size={14} />
            Quick capture
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium text-white"
            style={{ background: "var(--bc-brand-600)" }}
          >
            <Plus size={14} />
            New project
          </button>
        </div>
      </div>

      <MyTasks />

      <StatGrid />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <ProjectsCard />
          <ActivityCard />
        </div>
        <div className="flex flex-col gap-4">
          <TicketPipelineCard />
          <NeedsAttentionCard />
        </div>
      </div>
    </div>
  );
}
