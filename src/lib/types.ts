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

export type Feature = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  status: FeatureStatus;
  sortOrder?: number;
  ticketRefs: string[];
  timelineStart: number | null;
  timelineEnd: number | null;
};

export type ProjectDetail = Project & {
  objective: string | null;
  audience: string | null;
  successMetrics: string[];
  externalRepo: string | null;
  features: Feature[];
};

export type ProjectCounts = {
  tickets: number;
  feedback: number;
  testing: number;
  pending: number;
  proposedFromIdeas: number;
};

export type Ticket = {
  id: string;
  ref: string;                 // BC-7544
  projectId: string;
  title: string;
  stage: TicketStage;
  priority: TicketPriority;
  hasHandoff: boolean;         // true if ticket_details record exists
};

export type TicketAcceptance = { text: string; checked: boolean };

export type TicketFile = { path: string; note: string | null };

export type TicketActivityEntry = {
  who: string;
  what: string;
  meta: string | null;
  source: "github" | "agent" | "manual" | "portal" | null;
  when: string;
};

export type Phase = {
  id: string;
  type: PhaseType;
  name: string;
  color: BadgeKind;        // 'purple' | 'brand' | 'info' | 'success' | 'warning' | 'neutral'
  startMonth: number;
  endMonth: number;
  items: PhaseItem[];
};

export type PhaseItem = {
  id: string;
  name: string;
  owner: string;
  status: ItemStatus;
};

export type FeedbackItem = {
  id: string;
  projectId: string;
  title: string;
  body: string | null;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  source: string;
  reportedBy: string | null;
  createdAt: string;
};

export type TestCase = {
  id: string;
  projectId: string;
  featureId: string | null;
  featureName: string | null;
  name: string;
  steps: string[];
  expected: string;
  status: TestStatus;
  owner: string;
  lastRun: string | null;
  failureNote: string | null;
};

export type PendingUpdate = {
  id: string;
  projectId: string;
  type: PendingType;
  title: string;
  description: string;
  featureId: string | null;
  featureName: string | null;
  sourceCaseId: string | null;
  linkedTicketRefs: string[];
  steps: string[];
  expected: string | null;
  createdAt: string;
};

export type PendingAreaGroup = {
  feature: Feature | null;
  items: PendingUpdate[];
};

export type Idea = {
  id: string;
  kind: IdeaKind;
  status: IdeaStatus;
  title: string;
  description: string | null;
  value: string | null;
  audience: string | null;
  tags: string[];
  owner: string;
  votes: number;
  targetProjectId: string | null;
  targetProjectName: string | null;
  targetFeatureId: string | null;
  targetFeatureName: string | null;
  createdAt: string;
};

export type TicketDetail = Ticket & {
  repo: string | null;
  branch: string | null;
  prNumber: number | null;
  summary: string | null;
  background: string | null;
  userStory: string | null;
  engineeringNotes: string | null;
  rolePermissionImpact: string | null;
  handoffFile: string | null;
  handoffDate: string | null;
  acceptance: TicketAcceptance[];
  files: TicketFile[];
  activity: TicketActivityEntry[];
};

// ---------------------------------------------------------------------------
// Team view — who is working on what + each person's priorities (BC-271)
// ---------------------------------------------------------------------------
export type TeamMember = {
  id: string;
  displayName: string;
  roleLabel: string;
  email: string;
  initials: string;
};

export type TeamTicket = {
  id: string;
  ref: string;
  title: string;
  stage: TicketStage;
  priority: TicketPriority;
  projectId: string;
  projectName: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
};

export type TeamProject = {
  id: string;
  name: string;
  status: string | null;
  statusKind: ProjectStatusKind;
  completion: number;
  targetReleaseDate: string | null;
  ownerId: string | null;
};

