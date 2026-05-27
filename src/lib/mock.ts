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
  Ticket,
  TicketDetail,
  TicketPriority,
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

// ---------------------------------------------------------------------------
// Tickets + ticket details
// ---------------------------------------------------------------------------
const PROJECT_TICKETS: Record<string, Ticket[]> = {
  "11111111-1111-1111-1111-000000000001": [
    { id: "tk-bs-1", ref: "BC-7611", projectId: "11111111-1111-1111-1111-000000000001", title: "Vendor approval inline editing",  stage: "created",  priority: "high",     hasHandoff: false },
    { id: "tk-bs-2", ref: "BC-7619", projectId: "11111111-1111-1111-1111-000000000001", title: "Bid sheet PDF export styling fix", stage: "created",  priority: "medium",   hasHandoff: false },
    { id: "tk-bs-3", ref: "BC-7588", projectId: "11111111-1111-1111-1111-000000000001", title: "Add scope approval gate to bid review", stage: "in_dev",   priority: "high",     hasHandoff: true },
    { id: "tk-bs-4", ref: "BC-7591", projectId: "11111111-1111-1111-1111-000000000001", title: "Migration: bids table backfill",  stage: "in_dev",   priority: "medium",   hasHandoff: false },
    { id: "tk-bs-5", ref: "BC-7544", projectId: "11111111-1111-1111-1111-000000000001", title: "Role permission matrix for bid approvers", stage: "on_stage", priority: "critical", hasHandoff: true },
    { id: "tk-bs-6", ref: "BC-7501", projectId: "11111111-1111-1111-1111-000000000001", title: "Bid line item drag reorder",      stage: "ready",    priority: "medium",   hasHandoff: true },
    { id: "tk-bs-7", ref: "BC-7480", projectId: "11111111-1111-1111-1111-000000000001", title: "New bid creation wizard",         stage: "live",     priority: "high",     hasHandoff: false },
    { id: "tk-bs-8", ref: "BC-7472", projectId: "11111111-1111-1111-1111-000000000001", title: "Vendor card redesign",            stage: "live",     priority: "low",      hasHandoff: false },
  ],
  "11111111-1111-1111-1111-000000000002": [
    { id: "tk-cp-1", ref: "BC-7700", projectId: "11111111-1111-1111-1111-000000000002", title: "Migration dry-run report",        stage: "created",  priority: "high",     hasHandoff: false },
    { id: "tk-cp-2", ref: "BC-7665", projectId: "11111111-1111-1111-1111-000000000002", title: "User mapping import script",      stage: "in_dev",   priority: "critical", hasHandoff: false },
    { id: "tk-cp-3", ref: "BC-7670", projectId: "11111111-1111-1111-1111-000000000002", title: "Legacy order history backfill",   stage: "in_dev",   priority: "high",     hasHandoff: false },
    { id: "tk-cp-4", ref: "BC-7610", projectId: "11111111-1111-1111-1111-000000000002", title: "Portal login DNS cutover",        stage: "live",     priority: "high",     hasHandoff: false },
  ],
  "11111111-1111-1111-1111-000000000003": [
    { id: "tk-ft-1", ref: "BC-7750", projectId: "11111111-1111-1111-1111-000000000003", title: "Widget shell + open/close interaction", stage: "created", priority: "high", hasHandoff: false },
  ],
};

export const TICKET_STAGES: Array<{ id: TicketStage; label: string; kind: BadgeKind }> = [
  { id: "created",  label: "Created",            kind: "neutral" },
  { id: "in_dev",   label: "In dev",             kind: "info" },
  { id: "on_stage", label: "On stage",           kind: "purple" },
  { id: "ready",    label: "Ready for release", kind: "warning" },
  { id: "live",     label: "Live",               kind: "success" },
];

export const PRIORITY_KIND: Record<TicketPriority, BadgeKind> = {
  critical: "danger",
  high:     "warning",
  medium:   "info",
  low:      "neutral",
};

export function getProjectTickets(projectId: string): Ticket[] {
  return PROJECT_TICKETS[projectId] ?? [];
}

// Mock ticket details — only seeded for the three tickets with full handoffs
const TICKET_DETAILS: Record<string, TicketDetail> = {
  "BC-7544": {
    id: "tk-bs-5",
    ref: "BC-7544",
    projectId: "11111111-1111-1111-1111-000000000001",
    title: "Role permission matrix for bid approvers",
    stage: "on_stage",
    priority: "critical",
    hasHandoff: true,
    repo: "evanedgeworth/Bid-Sheet-v2",
    branch: "feat/bid-approver-permissions",
    prNumber: 234,
    summary:
      "Enforce the BuildCore permission matrix on the bid approval flow so only roles with scope_approval authority can sign off on a bid, and only when their portal area permission for projects is at least edit.",
    background:
      "The current bid sheet lets any logged-in user complete a bid approval. With nine roles now in production and three approval gates planned (scope, change order, project close), we need a single permission-check layer in front of the approve action. Driven by BC-PORTAL-7511 through 7517 (canonical matrix).",
    userStory:
      'As a Project Manager, I can only approve a bid when my role grants scope_approval authority AND my projects area is at least "edit", so that bids can\'t be approved by users without the proper authority.',
    engineeringNotes:
      "Use the canonical permission matrix at ~/buildcore-tyler/handoffs/2026-05-24/2026-05-24-role-permissions-system-handoff.html as the source of truth. Authorities are stored on the user_role table as a JSONB column. The check should be a single function imported in both the page and the API route — do not duplicate the role list.",
    rolePermissionImpact:
      "No new portal areas or authorities are introduced. This ticket is the first consumer of scope_approval. After this lands, the matrix should be cross-referenced before any future approval gate (change_order_approval, project_close) is built.",
    handoffFile: "2026-05-24-role-permissions-system-handoff.html",
    handoffDate: "2026-05-24",
    acceptance: [
      { text: "Approve button hidden when current user lacks scope_approval authority", checked: true },
      { text: "Approve button visible but disabled when authority present but projects area is view-only", checked: true },
      { text: "Server-side check rejects approval POST when caller lacks authority, returns 403", checked: true },
      { text: "Audit row written to bid_approval_audit on every attempt (approved AND rejected)", checked: false },
      { text: "Unit tests cover all 9 roles against the approve endpoint", checked: false },
    ],
    files: [
      { path: "src/app/(dashboard)/projects/[id]/bids/[bidId]/page.tsx", note: "hide/disable Approve button" },
      { path: "src/app/api/bids/[bidId]/approve/route.ts", note: "server-side authority check" },
      { path: "src/lib/permissions.ts", note: "add hasAuthority() helper" },
      { path: "src/hooks/usePermissions.ts", note: "client hook reads current user authorities" },
    ],
    activity: [
      { who: "Evan agent", what: "opened PR #234", meta: null,                   source: "github", when: "2h ago" },
      { who: "Evan agent", what: "pushed 4 commits to feat/bid-approver-permissions", meta: null, source: "github", when: "5h ago" },
      { who: "Evan agent", what: "moved",        meta: "In dev → On stage",      source: "agent",  when: "12m ago" },
      { who: "Tyler",      what: "created from handoff", meta: null,            source: "manual", when: "2 days ago" },
    ],
  },
  "BC-7588": {
    id: "tk-bs-3",
    ref: "BC-7588",
    projectId: "11111111-1111-1111-1111-000000000001",
    title: "Add scope approval gate to bid review",
    stage: "in_dev",
    priority: "high",
    hasHandoff: true,
    repo: "evanedgeworth/Bid-Sheet-v2",
    branch: "feat/scope-approval-gate",
    prNumber: 241,
    summary:
      'Insert a "Scope approval" step in the bid review flow that blocks the Approve action until the project\'s scope has been signed off by a user with scope_approval authority.',
    background:
      "Field teams have been approving bids before scope sign-off was complete, creating change-order rework downstream. Adding an explicit gate in the UI and the API surface prevents this.",
    userStory:
      "As an Operations Director, I can't finalize a bid approval until the project scope has been signed off, so that we stop approving bids against unfinished scopes.",
    engineeringNotes:
      "Reuse the existing scope_approvals Supabase table. Don't add a new state field — scope status is derived from latest row in scope_approvals for the project.",
    rolePermissionImpact:
      "No new portal areas. Reads scope_approval authority added in BC-7544. No changes to the 11 areas or 6 authorities.",
    handoffFile: "2026-05-25-scope-approval-gate-handoff.html",
    handoffDate: "2026-05-25",
    acceptance: [
      { text: "Bid review page shows a Scope-status banner (pending / approved / rejected)", checked: true },
      { text: "Approve button disabled when scope status is pending or rejected", checked: true },
      { text: "Tooltip explains why button is disabled", checked: false },
      { text: "API endpoint returns 422 with reason when scope not approved", checked: false },
    ],
    files: [
      { path: "src/app/(dashboard)/projects/[id]/bids/[bidId]/page.tsx", note: "add scope status banner" },
      { path: "src/components/ScopeStatusBanner.tsx", note: "new component" },
      { path: "src/app/api/bids/[bidId]/approve/route.ts", note: "add scope check" },
    ],
    activity: [
      { who: "Evan agent", what: "opened PR #241", meta: null,             source: "github", when: "8h ago" },
      { who: "Evan agent", what: "moved",         meta: "Created → In dev", source: "agent",  when: "yesterday" },
      { who: "Tyler",      what: "created from handoff", meta: null,       source: "manual", when: "2 days ago" },
    ],
  },
  "BC-7501": {
    id: "tk-bs-6",
    ref: "BC-7501",
    projectId: "11111111-1111-1111-1111-000000000001",
    title: "Bid line item drag reorder",
    stage: "ready",
    priority: "medium",
    hasHandoff: true,
    repo: "evanedgeworth/Bid-Sheet-v2",
    branch: "feat/bid-line-reorder",
    prNumber: 218,
    summary:
      "Let bid editors drag line items up and down within a bid section to reorder them. Order persists to the database.",
    background:
      "Currently line items appear in creation order with no way to reorder. Bid editors are deleting and re-creating items to get the right order, losing notes in the process.",
    userStory:
      "As a Bid Editor, I can drag a line item to a new position within its section, so I don't have to delete and recreate items to reorder them.",
    engineeringNotes:
      "Use @dnd-kit/core (already in deps). Add a sort_order int column to bid_lines via migration 0089.",
    rolePermissionImpact:
      "No role or permission changes. Anyone with edit access to a bid can reorder its line items.",
    handoffFile: "2026-05-22-bid-line-reorder-handoff.html",
    handoffDate: "2026-05-22",
    acceptance: [
      { text: "Drag handle visible on hover for each line item", checked: true },
      { text: "Drop indicator shows where the item will land", checked: true },
      { text: "Order persists after page refresh", checked: true },
      { text: "Optimistic UI — reorder visible immediately, rollback on save error", checked: true },
      { text: "Keyboard accessible — Up/Down arrows with modifier reorder", checked: true },
    ],
    files: [
      { path: "src/components/BidLineItemList.tsx", note: "drag context + handle" },
      { path: "src/hooks/useBidLineOrder.ts", note: "reorder logic + persistence" },
      { path: "src/app/api/bids/[bidId]/lines/reorder/route.ts", note: "new endpoint" },
    ],
    activity: [
      { who: "Evan agent", what: "moved",          meta: "On stage → Ready for release", source: "agent",  when: "2 days ago" },
      { who: "Evan agent", what: "opened PR #218", meta: null,                            source: "github", when: "4 days ago" },
      { who: "Tyler",      what: "created from handoff", meta: null,                     source: "manual", when: "5 days ago" },
    ],
  },
};

export function getTicketDetail(ref: string): TicketDetail | null {
  return TICKET_DETAILS[ref] ?? null;
}

/** Get tickets for a project, optionally narrowed to a feature. */
export function getProjectTicketsFiltered(
  projectId: string,
  featureId: string | null,
): Ticket[] {
  const tickets = getProjectTickets(projectId);
  if (!featureId) return tickets;
  const features = FEATURES_BY_PROJECT[projectId] ?? [];
  const feature = features.find((f) => f.id === featureId);
  if (!feature) return tickets;
  const refSet = new Set(feature.ticketRefs);
  return tickets.filter((t) => refSet.has(t.ref));
}

export function getFeatureById(projectId: string, featureId: string): Feature | null {
  const features = FEATURES_BY_PROJECT[projectId] ?? [];
  return features.find((f) => f.id === featureId) ?? null;
}
