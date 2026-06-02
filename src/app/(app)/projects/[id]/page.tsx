import { notFound } from "next/navigation";
import {
  getProject,
  getProjectActivity,
  getProjectCounts,
  getProjectFeedback,
  getProjectPhases,
  getProjectTestCases,
  getTicketDetail,
  groupPendingByArea,
} from "@/lib/db";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectTabs, type ProjectTab } from "@/components/projects/ProjectTabs";
import { AboutCard } from "@/components/projects/overview/AboutCard";
import { SnapshotCard } from "@/components/projects/overview/SnapshotCard";
import { ProductFeaturesCard } from "@/components/projects/overview/ProductFeaturesCard";
import { ProjectActivityCard } from "@/components/projects/overview/ProjectActivityCard";
import { TicketsKanban } from "@/components/projects/tickets/TicketsKanban";
import { TicketDrawer } from "@/components/projects/tickets/TicketDrawer";
import { ProjectGantt } from "@/components/projects/lifecycle/ProjectGantt";
import { PhaseChecklists } from "@/components/projects/lifecycle/PhaseChecklists";
import { FeedbackTable } from "@/components/projects/feedback/FeedbackTable";
import { TestingTab } from "@/components/projects/testing/TestingTab";
import { PendingTab } from "@/components/projects/pending/PendingTab";

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
  const project = await getProject(id);
  if (!project) notFound();

  const active: ProjectTab =
    tabParam && (VALID_TABS as string[]).includes(tabParam)
      ? (tabParam as ProjectTab)
      : "overview";

  const counts = await getProjectCounts(id);
  const openTicket =
    active === "tickets" && ticketParam ? await getTicketDetail(ticketParam) : null;

  return (
    <div>
      <ProjectHeader project={project} />
      <ProjectTabs projectId={id} active={active} counts={counts} />

      {active === "overview" && <OverviewTab project={project} counts={counts} />}

      {active === "lifecycle" && (
        <>
          <div className="mb-6">
            <ProjectGantt phases={await getProjectPhases(id)} />
          </div>
          <PhaseChecklists phases={await getProjectPhases(id)} />
        </>
      )}

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

      {active === "feedback" && <FeedbackTable items={await getProjectFeedback(id)} />}

      {active === "testing" && (
        <TestingTab features={project.features} cases={await getProjectTestCases(id)} />
      )}

      {active === "pending" && (
        <PendingTab project={project} groups={await groupPendingByArea(id)} />
      )}
    </div>
  );
}

async function OverviewTab({
  project,
  counts,
}: {
  project: Awaited<ReturnType<typeof getProject>>;
  counts: Awaited<ReturnType<typeof getProjectCounts>>;
}) {
  if (!project) return null;
  const activity = await getProjectActivity(project.name);
  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <AboutCard project={project} />
        <SnapshotCard project={project} counts={counts} />
      </div>
      <div className="mb-6">
        <ProductFeaturesCard projectId={project.id} features={project.features} counts={counts} />
      </div>
      <ProjectActivityCard events={activity} />
    </>
  );
}
