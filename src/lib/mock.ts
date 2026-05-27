import type {
  ActivityEvent,
  BadgeKind,
  FeatureStatus,
  IdeaKind,
  Project,
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
