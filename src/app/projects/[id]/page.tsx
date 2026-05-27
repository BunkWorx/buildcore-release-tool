import { notFound } from "next/navigation";
import { getProject, getProjectCounts, getTicketDetail } from "@/lib/mock";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectTabs, type ProjectTab } from "@/components/projects/ProjectTabs";
import { AboutCard } from "@/components/projects/overview/AboutCard";
import { SnapshotCard } from "@/components/projects/overview/SnapshotCard";
import { ProductFeaturesCard } from "@/components/projects/overview/ProductFeaturesCard";
import { ProjectActivityCard } from "@/components/projects/overview/ProjectActivityCard";
import { TicketsKanban } from "@/components/projects/tickets/TicketsKanban";
import { TicketDrawer } from "@/components/projects/tickets/TicketDrawer";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; feature?: string; ticket?: string }>;
};

const VALID_TABS: ProjectTab[] = [
  "overview",
  "lifecycle",
  "tickets",
  "feedback",
  "testing",
  "pending",
];

export default async function ProjectHubPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab: tabParam, feature: featureParam, ticket: ticketParam } = await searchParams;
  const project = getProject(id);
  if (!project) notFound();

  const active: ProjectTab =
    tabParam && (VALID_TABS as string[]).includes(tabParam)
      ? (tabParam as ProjectTab)
      : "overview";
  const counts = getProjectCounts(id);
  const openTicket =
    active === "tickets" && ticketParam ? getTicketDetail(ticketParam) : null;

  return (
    <div>
      <ProjectHeader project={project} />
      <ProjectTabs projectId={id} active={active} counts={counts} />

      {active === "overview" && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
            <AboutCard project={project} />
            <SnapshotCard project={project} counts={counts} />
          </div>
          <div className="mb-6">
            <ProductFeaturesCard projectId={id} features={project.features} counts={counts} />
          </div>
          <ProjectActivityCard projectName={project.name} />
        </>
      )}

      {active === "lifecycle" && <TabPlaceholder label="Lifecycle (Gantt + phase checklists)" />}
      {active === "tickets" && (
        <>
          <TicketsKanban
            projectId={id}
            projectRepo={project.externalRepo}
            featureId={featureParam ?? null}
          />
          {openTicket && <TicketDrawer ticket={openTicket} projectId={id} />}
        </>
      )}
      {active === "feedback" && <TabPlaceholder label="Feedback list" />}
      {active === "testing" && <TabPlaceholder label="Testing — by feature / workflow" />}
      {active === "pending" && <TabPlaceholder label="Pending updates — handoff outbox" />}
    </div>
  );
}

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-[var(--bc-radius)] border border-dashed border-[var(--bc-border)] bg-white px-6 py-12 text-center">
      <h3 className="mb-1.5">{label}</h3>
      <p className="text-[13px] text-slate-500">
        Lands in a follow-up commit. The Overview, Projects list, and Dashboard are live now.
      </p>
    </div>
  );
}
