// Domain types shared across the app. Mirror the Supabase schema in
// supabase/migrations/0001_initial_schema.sql. As we add Supabase generated
// types, the canonical types will move to a generated file; this stays as the
// hand-authored layer for UI-facing shapes.

export type ProjectStatusKind =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type PhaseType =
  | "planning"
  | "development"
  | "preparation"
  | "golive"
  | "feedback"
  | "custom";

export type ItemStatus =
  | "not_started"
  | "in_progress"
  | "complete"
  | "na";

export type FeatureStatus =
  | "planned"
  | "in_design"
  | "in_dev"
  | "in_testing"
  | "ready"
  | "live";

export type TicketStage =
  | "created"
  | "in_dev"
  | "on_stage"
  | "ready"
  | "live";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export type FeedbackPriority = TicketPriority;

export type FeedbackStatus = "open" | "in_progress" | "resolved";

export type TestStatus =
  | "not_started"
  | "in_progress"
  | "passed"
  | "failed"
  | "blocked";

export type IdeaKind = "new_project" | "new_feature" | "enhancement";

export type IdeaStatus =
  | "captured"
  | "triaging"
  | "approved"
  | "in_project"
  | "rejected";

export type PendingType = "test_failure" | "feedback" | "manual";

export type TaskLinkType = "ticket" | "feedback" | "phase";

export type BadgeKind =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "brand"
  | "purple";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: string | null;
  statusKind: ProjectStatusKind;
  completion: number;
  targetReleaseDate: string | null;
  owner: string | null;
};

export type Task = {
  id: string;
  title: string;
  done: boolean;
  linkType: TaskLinkType | null;
  linkRef: string | null;
  linkProjectId: string | null;
  linkProjectName: string | null;
  due: "today" | "this_week" | null;
};

export type ActivityEvent = {
  id: string;
  who: string;
  what: string;
  target: string | null;
  meta: string | null;
  projectName: string | null;
  source: "github" | "portal" | "manual" | "agent" | null;
  when: string;
};

export type StatusBadgeMap = Record<string, { label: string; kind: BadgeKind }>;
