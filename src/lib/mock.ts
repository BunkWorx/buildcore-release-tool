import type {
  ActivityEvent,
  BadgeKind,
  Feature,
  FeatureStatus,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
  Idea,
  IdeaKind,
  IdeaStatus,
  PendingAreaGroup,
  PendingUpdate,
  Phase,
  PhaseItem,
  Project,
  ProjectCounts,
  ProjectDetail,
  ProjectStatusKind,
  Task,
  TestCase,
  TestStatus,
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

// ---------------------------------------------------------------------------
// Lifecycle phases (per project)
// ---------------------------------------------------------------------------
const item = (id: string, name: string, owner: string, status: PhaseItem["status"]): PhaseItem => ({ id, name, owner, status });

const PHASES_BY_PROJECT: Record<string, Phase[]> = {
  "11111111-1111-1111-1111-000000000001": [
    {
      id: "ph-bs-plan", type: "planning", name: "Planning", color: "purple",
      startMonth: 0, endMonth: 1.5,
      items: [
        item("p-bs-plan-1", "MVP approval",            "Tyler", "complete"),
        item("p-bs-plan-2", "Design approval",         "Tyler", "complete"),
        item("p-bs-plan-3", "Go-live date determined", "Tyler", "complete"),
        item("p-bs-plan-4", "Business sign-off",       "Tyler", "in_progress"),
        item("p-bs-plan-5", "Marketing alignment",     "Tyler", "not_started"),
      ],
    },
    {
      id: "ph-bs-dev", type: "development", name: "Development", color: "brand",
      startMonth: 1.5, endMonth: 4.0,
      items: [
        item("p-bs-dev-1", "Development",                   "Evan",  "in_progress"),
        item("p-bs-dev-2", "Product / engineering testing", "Evan",  "in_progress"),
        item("p-bs-dev-3", "User testing (UAT)",            "Tyler", "in_progress"),
        item("p-bs-dev-4", "QA sign-off",                   "Tyler", "not_started"),
      ],
    },
    {
      id: "ph-bs-prep", type: "preparation", name: "Preparation", color: "info",
      startMonth: 4.0, endMonth: 5.5,
      items: [
        item("p-bs-prep-1", "Release phases determined",          "Tyler", "in_progress"),
        item("p-bs-prep-2", "Users determined",                   "Tyler", "in_progress"),
        item("p-bs-prep-3", "SOPs created / updated",             "Tyler", "in_progress"),
        item("p-bs-prep-4", "User guides created",                "Tyler", "not_started"),
        item("p-bs-prep-5", "Training plan determined",           "Tyler", "not_started"),
        item("p-bs-prep-6", "User training / provisioning",       "Tyler", "not_started"),
        item("p-bs-prep-7", "Create feedback / support channels", "Tyler", "not_started"),
      ],
    },
    {
      id: "ph-bs-golive", type: "golive", name: "Go-live Phase 1", color: "success",
      startMonth: 5.5, endMonth: 7.0,
      items: [],
    },
    {
      id: "ph-bs-feedback", type: "feedback", name: "Feedback", color: "warning",
      startMonth: 7.0, endMonth: 10.0,
      items: [],
    },
  ],
  "11111111-1111-1111-1111-000000000002": [
    { id: "ph-cp-plan", type: "planning", name: "Planning", color: "purple", startMonth: 1.0, endMonth: 2.5, items: [] },
    { id: "ph-cp-dev",  type: "development", name: "Development", color: "brand", startMonth: 2.5, endMonth: 5.0, items: [] },
    { id: "ph-cp-prep", type: "preparation", name: "Preparation", color: "info", startMonth: 5.0, endMonth: 6.5, items: [] },
    { id: "ph-cp-golive", type: "golive", name: "Go-live Phase 1", color: "success", startMonth: 6.5, endMonth: 8.0, items: [] },
    { id: "ph-cp-feedback", type: "feedback", name: "Feedback", color: "warning", startMonth: 8.0, endMonth: 11.0, items: [] },
  ],
  "11111111-1111-1111-1111-000000000003": [
    { id: "ph-ft-plan", type: "planning", name: "Planning", color: "purple", startMonth: 3.0, endMonth: 4.5, items: [] },
    { id: "ph-ft-dev",  type: "development", name: "Development", color: "brand", startMonth: 4.5, endMonth: 7.0, items: [] },
    { id: "ph-ft-prep", type: "preparation", name: "Preparation", color: "info", startMonth: 7.0, endMonth: 8.5, items: [] },
    { id: "ph-ft-golive", type: "golive", name: "Go-live Phase 1", color: "success", startMonth: 8.5, endMonth: 11.0, items: [] },
  ],
};

export function getProjectPhases(projectId: string): Phase[] {
  return PHASES_BY_PROJECT[projectId] ?? [];
}

export const PHASE_COLOR_VAR: Record<BadgeKind, string> = {
  purple:  "var(--bc-purple-600)",
  brand:   "var(--bc-brand-600)",
  info:    "var(--bc-info-600)",
  success: "var(--bc-success-600)",
  warning: "var(--bc-warning-600)",
  danger:  "var(--bc-danger-600)",
  neutral: "var(--bc-slate-500)",
};

export const ITEM_STATUS_LABEL: Record<PhaseItem["status"], { label: string; kind: BadgeKind }> = {
  not_started: { label: "Not started", kind: "neutral" },
  in_progress: { label: "In progress", kind: "info" },
  complete:    { label: "Complete",    kind: "success" },
  na:          { label: "N/A",         kind: "neutral" },
};

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------
const PROJECT_FEEDBACK: Record<string, FeedbackItem[]> = {
  "11111111-1111-1111-1111-000000000001": [
    { id: "fb-bs-1", projectId: "11111111-1111-1111-1111-000000000001", title: "Approver can't see total before signing off",        body: null, priority: "high",    status: "open",        source: "Field team",       reportedBy: "Jamie",       createdAt: "2d ago" },
    { id: "fb-bs-2", projectId: "11111111-1111-1111-1111-000000000001", title: "PDF export cuts off long vendor names",              body: null, priority: "medium",  status: "open",        source: "BuildCore portal", reportedBy: "Auto-routed", createdAt: "4d ago" },
    { id: "fb-bs-3", projectId: "11111111-1111-1111-1111-000000000001", title: 'Add filter for "awaiting my approval"',              body: null, priority: "medium",  status: "in_progress", source: "Tyler",            reportedBy: "Tyler",       createdAt: "1w ago" },
    { id: "fb-bs-4", projectId: "11111111-1111-1111-1111-000000000001", title: "Empty state copy is confusing",                      body: null, priority: "low",     status: "resolved",    source: "Field team",       reportedBy: "Riley",       createdAt: "1w ago" },
  ],
  "11111111-1111-1111-1111-000000000002": [
    { id: "fb-cp-1", projectId: "11111111-1111-1111-1111-000000000002", title: "Legacy users hit 404 on first login",                body: null, priority: "critical", status: "open",        source: "Client",  reportedBy: "ACME Corp", createdAt: "6h ago" },
    { id: "fb-cp-2", projectId: "11111111-1111-1111-1111-000000000002", title: "Notification emails sent twice during migration",   body: null, priority: "high",     status: "in_progress", source: "Support", reportedBy: "Support",   createdAt: "1d ago" },
  ],
  "11111111-1111-1111-1111-000000000003": [],
};

export function getProjectFeedback(projectId: string): FeedbackItem[] {
  return PROJECT_FEEDBACK[projectId] ?? [];
}

export const FEEDBACK_STATUS_KIND: Record<FeedbackStatus, BadgeKind> = {
  open:        "danger",
  in_progress: "info",
  resolved:    "success",
};

export const FEEDBACK_PRIORITY_KIND: Record<FeedbackPriority, BadgeKind> = {
  critical: "danger",
  high:     "warning",
  medium:   "info",
  low:      "neutral",
};

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------
const tc = (id: string, name: string, featureId: string | null, status: TestStatus, owner: string, lastRun: string | null, steps: string[], expected: string, failureNote: string | null = null): Omit<TestCase, "projectId" | "featureName"> => ({ id, name, featureId, status, owner, lastRun, steps, expected, failureNote });

const PROJECT_TEST_CASES: Record<string, TestCase[]> = {
  "11111111-1111-1111-1111-000000000001": [
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Vendor sourcing wizard", ...tc("tc-vs-1", "Select vendor type from list",     "f-vendor-sourcing", "passed",      "Tyler", "5d ago", ["Open new bid", "Click Add vendor", "Choose Plumber"],                                "Wizard advances to step 2.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Vendor sourcing wizard", ...tc("tc-vs-2", "Search vendors by name",            "f-vendor-sourcing", "passed",      "Tyler", "5d ago", ["On step 2", 'Type "Smith"'],                                                          'Results filter to vendors with "Smith" in their name.') },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Vendor sourcing wizard", ...tc("tc-vs-3", "Send invite to vendor",             "f-vendor-sourcing", "passed",      "Tyler", "5d ago", ["Pick a vendor", "Click Send invite"],                                                "Vendor receives email; status moves to Invited.") },

    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Drag-and-drop line items", ...tc("tc-dnd-1", "Drag item up within a section",        "f-line-reorder", "passed", "Tyler", "1d ago", ["Open a bid with 3+ line items", "Drag item 3 to position 1"],                          "Item reorders; order persists after refresh.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Drag-and-drop line items", ...tc("tc-dnd-2", "Drag item down within a section",      "f-line-reorder", "passed", "Tyler", "1d ago", ["Open a bid", "Drag item 1 to position 3"],                                           "Item reorders; order persists.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Drag-and-drop line items", ...tc("tc-dnd-3", "Drop indicator shows correct position",  "f-line-reorder", "passed", "Tyler", "1d ago", ["Start dragging an item", "Hover between items"],                                     "A horizontal blue line appears where the item will land.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Drag-and-drop line items", ...tc("tc-dnd-4", "Keyboard reorder with Cmd+Up/Down",      "f-line-reorder", "passed", "Tyler", "1d ago", ["Focus a line item", "Press Cmd+Up"],                                                 "Item moves up one position.") },

    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Role-based approval permissions", ...tc("tc-rbp-1", "Project Manager can approve",              "f-role-permissions", "passed",      "Tyler", "4h ago", ["Log in as PM", "Open a bid with scope approved", "Click Approve"], "Bid is marked approved.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Role-based approval permissions", ...tc("tc-rbp-2", "Field Tech cannot approve",                "f-role-permissions", "passed",      "Tyler", "4h ago", ["Log in as Field Tech", "Open a bid"],                              "Approve button is hidden.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Role-based approval permissions", ...tc("tc-rbp-3", "Approve button hidden for view-only roles", "f-role-permissions", "passed",      "Tyler", "4h ago", ["Log in as Auditor", "Open a bid"],                                 "Approve button is hidden.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Role-based approval permissions", ...tc("tc-rbp-4", "Server rejects unauthorized approval POST", "f-role-permissions", "in_progress", "Evan",  null,     ["As Field Tech, send POST to /api/bids/.../approve"],               "API responds 403.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Role-based approval permissions", ...tc("tc-rbp-5", "Audit log row written for every attempt",  "f-role-permissions", "failed",      "Evan",  "1h ago", ["Attempt an approval (success or fail)", "Query bid_approval_audit table"], "A new row exists with user_id, bid_id, attempted_at, and result.", "No row was written when the attempt was rejected for missing authority. Audit only fires on success path.") },

    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Scope approval gate", ...tc("tc-sag-1", "Approve disabled when scope is pending",  "f-scope-gate", "passed",      "Tyler", "4h ago", ["Open a bid where scope status is pending", "Hover Approve"],          "Approve button is disabled.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Scope approval gate", ...tc("tc-sag-2", "Approve disabled when scope is rejected", "f-scope-gate", "in_progress", "Tyler", null,     ["Open a bid where scope is rejected"],                                 "Approve button is disabled.") },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Scope approval gate", ...tc("tc-sag-3", "API returns 422 when scope not approved", "f-scope-gate", "not_started", "Evan",  null,     ["Send approval POST"],                                                 'Response is 422 with reason "scope_not_approved" and bid unchanged.') },

    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Improved PDF export", ...tc("tc-pdf-1", "Long vendor names wrap correctly",        "f-pdf-export", "failed",      "Tyler", "3h ago", ["Generate PDF from bid with vendor name longer than 40 chars", "Open the PDF"], "Vendor name wraps onto a second line; no overflow off page.", 'Vendor name "Smith Construction and Renovation Services LLC" still overflows the right edge of the page on the cover page. Body sections wrap correctly — looks like the cover-page header style is missing the word-break rule.') },
    { projectId: "11111111-1111-1111-1111-000000000001", featureName: "Improved PDF export", ...tc("tc-pdf-2", "Multi-section bid renders all sections",  "f-pdf-export", "not_started", "Tyler", null,     ["Bid with 3 sections", "Generate PDF"],                                                 "All three sections render in order.") },
  ],
  "11111111-1111-1111-1111-000000000002": [
    { projectId: "11111111-1111-1111-1111-000000000002", featureName: "User mapping import", ...tc("tc-um-1", "Legacy user can log in with old email", "f-user-mapping", "failed", "Tyler", "6h ago", ["Run migration", "Log in as a legacy user"], "Login succeeds and lands on portal home.", "After cutover, ~3% of legacy users hit a 404 page instead of the portal home. Reproduces 100% for users whose email contained a + sign.") },
  ],
  "11111111-1111-1111-1111-000000000003": [],
};

export function getProjectTestCases(projectId: string): TestCase[] {
  return PROJECT_TEST_CASES[projectId] ?? [];
}

export const TEST_STATUS_LABEL: Record<TestStatus, { label: string; kind: BadgeKind }> = {
  not_started: { label: "Not started", kind: "neutral" },
  in_progress: { label: "In progress", kind: "info" },
  passed:      { label: "Passed",      kind: "success" },
  failed:      { label: "Failed",      kind: "danger" },
  blocked:     { label: "Blocked",     kind: "warning" },
};

// ---------------------------------------------------------------------------
// Pending updates (seeded from failed test cases)
// ---------------------------------------------------------------------------
export function getProjectPending(projectId: string): PendingUpdate[] {
  const cases = getProjectTestCases(projectId).filter((c) => c.status === "failed");
  return cases.map((c, i) => {
    const feature = c.featureId ? getFeatureById(projectId, c.featureId) : null;
    return {
      id: `pending-${c.id}`,
      projectId,
      type: "test_failure" as const,
      title: c.name,
      description: c.failureNote ?? "",
      featureId: c.featureId,
      featureName: c.featureName,
      sourceCaseId: c.id,
      linkedTicketRefs: feature?.ticketRefs ?? [],
      steps: c.steps,
      expected: c.expected,
      createdAt: `${i + 1}h ago`,
    };
  });
}

export function groupPendingByArea(projectId: string): PendingAreaGroup[] {
  const items = getProjectPending(projectId);
  const features = FEATURES_BY_PROJECT[projectId] ?? [];
  const groups = new Map<string, PendingAreaGroup>();
  for (const f of features) {
    const featureItems = items.filter((p) => p.featureId === f.id);
    if (featureItems.length > 0) groups.set(f.id, { feature: f, items: featureItems });
  }
  const unassigned = items.filter((p) => !p.featureId);
  if (unassigned.length > 0) groups.set("__unassigned__", { feature: null, items: unassigned });
  return Array.from(groups.values());
}

// ---------------------------------------------------------------------------
// Ideas
// ---------------------------------------------------------------------------
const idea = (
  id: string,
  kind: IdeaKind,
  status: IdeaStatus,
  title: string,
  description: string,
  value: string,
  audience: string,
  tags: string[],
  owner: string,
  votes: number,
  targetProjectId: string | null,
  targetFeatureId: string | null,
  createdAt: string,
): Idea => {
  const targetProject = targetProjectId ? MOCK_PROJECTS.find((p) => p.id === targetProjectId) : null;
  const targetFeature = targetProjectId && targetFeatureId ? (FEATURES_BY_PROJECT[targetProjectId] ?? []).find((f) => f.id === targetFeatureId) : null;
  return {
    id,
    kind,
    status,
    title,
    description,
    value,
    audience,
    tags,
    owner,
    votes,
    targetProjectId,
    targetProjectName: targetProject?.name ?? null,
    targetFeatureId,
    targetFeatureName: targetFeature?.name ?? null,
    createdAt,
  };
};

export const MOCK_IDEAS: Idea[] = [
  idea("idea-1", "new_project", "captured", "Mobile field photo upload with offline queue",
    "Field techs can take and attach photos to a project record from the BuildCore mobile app, even without signal. Uploads sync when connectivity returns.",
    "Field photos today get lost in text messages or never make it into the project record at all. This makes documentation reliable.",
    "Field technicians on remote job sites. PMs who need photo evidence after the fact.",
    ["mobile", "field", "photos"], "Tyler", 9, null, null, "5d ago"),
  idea("idea-2", "new_project", "captured", "NetSuite invoice sync nightly job",
    "Nightly job that pushes newly approved invoices from BuildCore into NetSuite without manual entry.",
    "Accounting spends 4 hours a week on dual entry. Eliminating that frees them up for analysis.",
    "Accounting team. Finance leadership reporting on cash flow.",
    ["integrations", "netsuite", "accounting"], "Tyler", 3, null, null, "12d ago"),
  idea("idea-3", "new_feature", "approved", "Vendor performance scorecard",
    "On every vendor page in Bid Sheet v2, show a rolling scorecard: on-time bid response rate, completion rate, average days-to-complete, dispute count.",
    "Helps PMs pick the right vendor for new work. Today they are guessing or asking around.",
    "Project managers selecting vendors.",
    ["vendors", "analytics"], "Evan", 5, "11111111-1111-1111-1111-000000000001", null, "2w ago"),
  idea("idea-4", "new_feature", "triaging", "Auto-generate change orders from approved scope deltas",
    "When a scope is approved with changes from the prior version, automatically draft a change order doc with the differences pre-filled.",
    "PMs spend an hour per change order today. This cuts it to a 5-minute review.",
    "Project managers and operations directors.",
    ["scope", "change-orders"], "Tyler", 7, "11111111-1111-1111-1111-000000000001", null, "9d ago"),
  idea("idea-5", "enhancement", "captured", "Bulk vendor invite from a saved list",
    "In the vendor sourcing wizard, allow selecting from a previously saved vendor list to invite multiple vendors in one click.",
    "Cuts repeat-vendor sourcing from minutes to seconds for clients who use the same vendor pool.",
    "PMs running repeat projects with the same set of subs.",
    ["vendors", "productivity"], "Tyler", 4, "11111111-1111-1111-1111-000000000001", "f-vendor-sourcing", "4d ago"),
  idea("idea-6", "enhancement", "captured", "Reorder items across sections, not just within",
    "In drag-and-drop line items, allow dragging an item from one bid section into another section.",
    "Editors currently have to delete and recreate when something belongs in a different section.",
    "Bid editors restructuring complex bids.",
    ["drag-drop", "sections"], "Tyler", 2, "11111111-1111-1111-1111-000000000001", "f-line-reorder", "3d ago"),
  idea("idea-7", "enhancement", "approved", "Show approval gate reason on hover",
    "When the Approve button is disabled by the scope gate, show a tooltip that explains why so the user understands what to do next.",
    "Reduces support questions about why approval is blocked.",
    "Anyone trying to approve a bid that has not had its scope signed off.",
    ["ux", "tooltips"], "Tyler", 3, "11111111-1111-1111-1111-000000000001", "f-scope-gate", "3d ago"),
];

export const IDEA_STATUS_LABEL: Record<IdeaStatus, { label: string; kind: BadgeKind }> = {
  captured:   { label: "Captured",     kind: "neutral" },
  triaging:   { label: "Triaging",     kind: "info" },
  approved:   { label: "Approved",     kind: "brand" },
  in_project: { label: "In a project", kind: "success" },
  rejected:   { label: "Rejected",     kind: "danger" },
};

export const IDEA_KIND_INFO: Record<IdeaKind, { label: string; accent: BadgeKind; iconName: "Folder" | "PlusCircle" | "Pencil" }> = {
  new_project: { label: "New project", accent: "brand",  iconName: "Folder" },
  new_feature: { label: "New feature", accent: "info",   iconName: "PlusCircle" },
  enhancement: { label: "Enhancement", accent: "purple", iconName: "Pencil" },
};
