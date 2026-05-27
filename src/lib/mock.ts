import type {
  ActivityEvent,
  BadgeKind,
  Feature,
  FeatureStatus,
  IdeaKind,
  Project,
  ProjectCounts,
  ProjectDetail,
  ProjectStatusKind,
  Task,
  TicketStage,
} from "./types";

// Temporary in-memory data used while we port the prototype. Each query will
// be replaced with a Supabase-backed equivalent in Phase 5. The shapes here
// match what those queries will return — so swapping in real data won't
// touch the UI components.

export const MOCK_PROJECTS: Project[] = [
  {
    id: "11111111-1111-1111-1111-000000000001",
    name: "Bid Sheet v2",
    description:
      "Full rewrite of the bid sheet experience with vendor sourcing and approval workflow.",
    color: "#008C95",
    status: "On track",
    statusKind: "success",
    completion: 64,
    targetReleaseDate: "2026-07-15",
    owner: "Tyler W.",
  },
  {
    id: "11111111-1111-1111-1111-000000000002",
    name: "Client portal migration",
    description:
      "Migrate legacy client portal users and orders to the new BuildCore portal.",
    color: "#D97706",
    status: "At risk",
    statusKind: "warning",
    completion: 38,
    targetReleaseDate: "2026-08-30",
    owner: "Tyler W.",
  },
  {
    id: "11111111-1111-1111-1111-000000000003",
    name: "BuildCore feedback tracker",
    description:
      "In-portal feedback widget that creates tickets and routes to the right project automatically.",
    color: "#7C3AED",
    status: "On track",
    statusKind: "success",
    completion: 22,
    targetReleaseDate: "2026-10-01",
    owner: "Tyler W.",
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Sign off on BC-7501 release",
    done: false,
    linkType: "ticket",
    linkRef: "BC-7501",
    linkProjectId: "11111111-1111-1111-1111-000000000001",
    linkProjectName: "Bid Sheet v2",
    due: "today",
  },
  {
    id: "t2",
    title: "Triage portal 404 critical from client",
    done: false,
    linkType: "feedback",
    linkRef: null,
    linkProjectId: "11111111-1111-1111-1111-000000000002",
    linkProjectName: "Client portal migration",
    due: "today",
  },
  {
    id: "t3",
    title: "Write release notes for Bid Sheet v2 GA",
    done: false,
    linkType: null,
    linkRef: null,
    linkProjectId: null,
    linkProjectName: null,
    due: "this_week",
  },
  {
    id: "t4",
    title: "Draft permission matrix changes for new approver role",
    done: false,
    linkType: null,
    linkRef: null,
    linkProjectId: null,
    linkProjectName: null,
    due: null,
  },
  {
    id: "t5",
    title: "Reply to Evan re: scope approval gate",
    done: true,
    linkType: "ticket",
    linkRef: "BC-7588",
    linkProjectId: "11111111-1111-1111-1111-000000000001",
    linkProjectName: "Bid Sheet v2",
    due: null,
  },
];

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "a1",
    who: "Evan agent",
    what: "moved",
    target: "BC-7544 Role permission matrix for bid approvers",
    meta: "In dev → On stage",
    projectName: "Bid Sheet v2",
    source: "agent",
    when: "12m ago",
  },
  {
    id: "a2",
    who: "Tyler",
    what: "created feedback",
    target: "Approver can't see total before signing off",
    meta: "Bid Sheet v2",
    projectName: "Bid Sheet v2",
    source: "manual",
    when: "2h ago",
  },
  {
    id: "a3",
    who: "Evan agent",
    what: "moved",
    target: "BC-7480 New bid creation wizard",
    meta: "Ready → Live",
    projectName: "Bid Sheet v2",
    source: "agent",
    when: "5h ago",
  },
  {
    id: "a4",
    who: "Tyler",
    what: "updated phase",
    target: "Preparation: SOPs created",
    meta: "In progress → Complete",
    projectName: "Client portal migration",
    source: "manual",
    when: "yesterday",
  },
  {
    id: "a5",
    who: "BuildCore portal",
    what: "submitted feedback",
    target: "Legacy users hit 404 on first login",
    meta: "Critical · Auto-routed",
    projectName: "Client portal migration",
    source: "portal",
    when: "yesterday",
  },
];

// Cross-project rollups used by the Dashboard KPI cards
export const MOCK_TICKET_PIPELINE: Array<{ id: TicketStage; label: string; count: number; kind: BadgeKind }> = [
  { id: "created",  label: "Created",           count: 4, kind: "neutral" },
  { id: "in_dev",   label: "In dev",            count: 4, kind: "info" },
  { id: "on_stage", label: "On stage",          count: 1, kind: "purple" },
  { id: "ready",    label: "Ready for release", count: 1, kind: "warning" },
  { id: "live",     label: "Live",              count: 3, kind: "success" },
];

export const MOCK_KPIS = {
  activeProjects: 3,
  ticketsInFlight: 10,
  ticketsInDev: 4,
  ticketsLive: 3,
  openFeedback: 5,
  feedbackDeltaSinceYesterday: 2,
  nextReleaseDate: "Jul 15",
  nextReleaseProjectName: "Bid Sheet v2",
  nextReleaseInDays: 50,
};

export type NeedsAttentionItem = {
  id: string;
  iconKind: "danger" | "warning" | "info";
  title: string;
  meta: string;
};

export const MOCK_NEEDS_ATTENTION: NeedsAttentionItem[] = [
  {
    id: "na-1",
    iconKind: "danger",
    title: "Critical feedback open 6h",
    meta: "Client portal migration",
  },
  {
    id: "na-2",
    iconKind: "warning",
    title: "BC-7501 ready for release",
    meta: "Awaiting your sign-off",
  },
  {
    id: "na-3",
    iconKind: "info",
    title: "22 test cases pending",
    meta: "Permissions matrix · Bid Sheet v2",
  },
];

// Status-kind to badge-kind mapping for project status pills
export const PROJECT_STATUS_BADGE_KIND: Record<ProjectStatusKind, BadgeKind> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  neutral: "neutral",
};

export const FEATURE_STATUS_LABEL: Record<FeatureStatus, { label: string; kind: BadgeKind }> = {
  planned:    { label: "Planned",    kind: "neutral" },
  in_design:  { label: "In design",  kind: "purple" },
  in_dev:     { label: "In dev",     kind: "info" },
  in_testing: { label: "In testing", kind: "warning" },
  ready:      { label: "Ready",      kind: "brand" },
  live:       { label: "Live",       kind: "success" },
};

export const IDEA_KIND_META: Record<IdeaKind, { label: string; iconName: string }> = {
  new_project:  { label: "New project",  iconName: "Folder" },
  new_feature:  { label: "New feature",  iconName: "PlusCircle" },
  enhancement:  { label: "Enhancement",  iconName: "Pencil" },
};

// ---------------------------------------------------------------------------
// Per-project detail extensions
// ---------------------------------------------------------------------------
const FEATURES_BY_PROJECT: Record<string, Feature[]> = {
  "11111111-1111-1111-1111-000000000001": [
    {
      id: "f-vendor-sourcing",
      projectId: "11111111-1111-1111-1111-000000000001",
      name: "Vendor sourcing wizard",
      description:
        "Step-by-step wizard for finding and inviting vendors to bid, replacing the old one-shot dialog.",
      status: "live",
      ticketRefs: ["BC-7480", "BC-7472"],
      timelineStart: 1.5,
      timelineEnd: 3.0,
    },
    {
      id: "f-line-reorder",
      projectId: "11111111-1111-1111-1111-000000000001",
      name: "Drag-and-drop line items",
      description:
        "Reorder bid line items by dragging instead of deleting and recreating them. Notes and history are preserved.",
      status: "ready",
      ticketRefs: ["BC-7501"],
      timelineStart: 2.0,
      timelineEnd: 4.5,
    },
    {
      id: "f-role-permissions",
      projectId: "11111111-1111-1111-1111-000000000001",
      name: "Role-based approval permissions",
      description:
        "Only users whose role grants scope approval authority can sign off on a bid. Other users see the approve button hidden or disabled.",
      status: "in_testing",
      ticketRefs: ["BC-7544"],
      timelineStart: 3.0,
      timelineEnd: 5.0,
    },
    {
      id: "f-scope-gate",
      projectId: "11111111-1111-1111-1111-000000000001",
      name: "Scope approval gate",
      description:
        "Blocks bid approval until the project scope has been formally signed off. Prevents downstream change-order rework.",
      status: "in_dev",
      ticketRefs: ["BC-7588"],
      timelineStart: 4.0,
      timelineEnd: 6.0,
    },
    {
      id: "f-pdf-export",
      projectId: "11111111-1111-1111-1111-000000000001",
      name: "Improved PDF export",
      description:
        "Cleaner bid sheet PDFs with better handling of long vendor names and multi-section layouts.",
      status: "in_dev",
      ticketRefs: ["BC-7619"],
      timelineStart: 4.0,
      timelineEnd: 6.5,
    },
    {
      id: "f-inline-vendor-edit",
      projectId: "11111111-1111-1111-1111-000000000001",
      name: "Inline vendor approval editing",
      description:
        "Edit vendor approval status without leaving the bid page, replacing the slow modal-based flow.",
      status: "planned",
      ticketRefs: ["BC-7611"],
      timelineStart: 5.0,
      timelineEnd: 6.5,
    },
    {
      id: "f-migration",
      projectId: "11111111-1111-1111-1111-000000000001",
      name: "Migration: bids table backfill",
      description:
        "Backfills legacy bid data into the new schema with no downtime. Required to ship the rest of v2.",
      status: "in_dev",
      ticketRefs: ["BC-7591"],
      timelineStart: 3.0,
      timelineEnd: 5.5,
    },
  ],
  "11111111-1111-1111-1111-000000000002": [
    {
      id: "f-dns-cutover",
      projectId: "11111111-1111-1111-1111-000000000002",
      name: "Portal login DNS cutover",
      description:
        "Repoint legacy portal login URL to the new BuildCore portal so existing bookmarks keep working.",
      status: "live",
      ticketRefs: ["BC-7610"],
      timelineStart: 1.0,
      timelineEnd: 2.0,
    },
    {
      id: "f-user-mapping",
      projectId: "11111111-1111-1111-1111-000000000002",
      name: "User mapping import",
      description:
        "One-time script that maps every legacy user record to the new identity model, including saved preferences.",
      status: "in_dev",
      ticketRefs: ["BC-7665"],
      timelineStart: 3.0,
      timelineEnd: 5.5,
    },
    {
      id: "f-order-backfill",
      projectId: "11111111-1111-1111-1111-000000000002",
      name: "Order history backfill",
      description:
        "Backfills every legacy order so clients see their full history on day one of the new portal.",
      status: "in_dev",
      ticketRefs: ["BC-7670"],
      timelineStart: 4.0,
      timelineEnd: 6.0,
    },
    {
      id: "f-dry-run",
      projectId: "11111111-1111-1111-1111-000000000002",
      name: "Migration dry-run report",
      description:
        "Run the full migration against a copy of production and produce a report showing what would change before we cut over.",
      status: "planned",
      ticketRefs: ["BC-7700"],
      timelineStart: 5.0,
      timelineEnd: 7.0,
    },
  ],
  "11111111-1111-1111-1111-000000000003": [
    {
      id: "f-widget-shell",
      projectId: "11111111-1111-1111-1111-000000000003",
      name: "Floating feedback widget",
      description:
        "A small button anchored to the bottom-right of every portal page that opens a feedback form on click.",
      status: "in_dev",
      ticketRefs: ["BC-7750"],
      timelineStart: 4.0,
      timelineEnd: 7.0,
    },
    {
      id: "f-auto-routing",
      projectId: "11111111-1111-1111-1111-000000000003",
      name: "Automatic project routing",
      description:
        "Reads the current portal route to guess which project the feedback belongs to and pre-selects it.",
      status: "planned",
      ticketRefs: [],
      timelineStart: 6.0,
      timelineEnd: 8.0,
    },
    {
      id: "f-screenshot-attach",
      projectId: "11111111-1111-1111-1111-000000000003",
      name: "Screenshot attachment",
      description:
        "Lets users attach a screenshot of what they were looking at when they submitted the feedback.",
      status: "planned",
      ticketRefs: [],
      timelineStart: 7.0,
      timelineEnd: 9.0,
    },
  ],
};

const PROJECT_EXTRAS: Record<
  string,
  Pick<ProjectDetail, "objective" | "audience" | "successMetrics" | "externalRepo">
> = {
  "11111111-1111-1111-1111-000000000001": {
    objective:
      "Cut the time from project award to vendor-approved bid from 9 days to 3, and stop the leakage of approved bids that bypass scope sign-off.",
    audience:
      "Project managers, operations directors, and vendor coordinators who create and approve bids on every BuildCore project.",
    successMetrics: [
      "Median time-to-approved-bid under 3 business days",
      "Zero approved bids without a corresponding scope sign-off",
      "PM satisfaction score (in-app survey) above 4 of 5",
    ],
    externalRepo: "evanedgeworth/Bid-Sheet-v2",
  },
  "11111111-1111-1111-1111-000000000002": {
    objective:
      "Move every active client off the legacy portal and on to the new BuildCore portal without losing their order history, saved preferences, or sign-in continuity.",
    audience:
      "All active BuildCore clients and the support team who fields their tickets.",
    successMetrics: [
      "Less than 1% of active clients hit a login error in week one",
      "Zero data-loss incidents on order history",
      "Support ticket volume returns to baseline within two weeks",
    ],
    externalRepo: "evanedgeworth/buildcore-client-portal",
  },
  "11111111-1111-1111-1111-000000000003": {
    objective:
      "Give every user a one-click way to send feedback from anywhere in BuildCore, with the resulting ticket auto-routed to the correct project owner.",
    audience:
      "All BuildCore portal users plus the product owner who triages incoming feedback.",
    successMetrics: [
      "Median time from feedback submitted to ticket triaged under 2 hours",
      "Auto-routing accuracy above 80% (correct project on first try)",
      "At least 25% of weekly active users submit feedback in the first month",
    ],
    externalRepo: "evanedgeworth/buildcore-portal",
  },
};

const PROJECT_COUNTS: Record<string, ProjectCounts> = {
  "11111111-1111-1111-1111-000000000001": {
    tickets: 8,
    feedback: 4,
    testing: 19,
    pending: 2,
    proposedFromIdeas: 5,
  },
  "11111111-1111-1111-1111-000000000002": {
    tickets: 4,
    feedback: 2,
    testing: 1,
    pending: 1,
    proposedFromIdeas: 0,
  },
  "11111111-1111-1111-1111-000000000003": {
    tickets: 1,
    feedback: 0,
    testing: 0,
    pending: 0,
    proposedFromIdeas: 0,
  },
};

export function getProject(id: string): ProjectDetail | null {
  const project = MOCK_PROJECTS.find((p) => p.id === id);
  if (!project) return null;
  const extras = PROJECT_EXTRAS[id] ?? {
    objective: null,
    audience: null,
    successMetrics: [],
    externalRepo: null,
  };
  return {
    ...project,
    ...extras,
    features: FEATURES_BY_PROJECT[id] ?? [],
  };
}

export function getProjectCounts(id: string): ProjectCounts {
  return (
    PROJECT_COUNTS[id] ?? {
      tickets: 0,
      feedback: 0,
      testing: 0,
      pending: 0,
      proposedFromIdeas: 0,
    }
  );
}

export function getProjectActivity(projectName: string): ActivityEvent[] {
  return MOCK_ACTIVITY.filter((a) => a.projectName === projectName);
}
