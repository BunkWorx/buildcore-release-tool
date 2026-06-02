/** Real Supabase queries that mirror the mock.ts API.
 *
 * Pages were ported using the mock module first; this file is the swap —
 * functions return the same shapes the UI components already expect, so
 * pages can switch by changing imports and adding `await`.
 *
 * Schema reference: supabase/migrations/0001_initial_schema.sql
 */

import { createClient } from "./supabase/server";
import { getFeatureById as getFeatureByIdLocal } from "./mock"; // used while we still resolve feature names locally
import type {
  ActivityEvent,
  Feature,
  FeedbackItem,
  Idea,
  PendingAreaGroup,
  PendingUpdate,
  Phase,
  PhaseItem,
  Project,
  ProjectCounts,
  ProjectDetail,
  TestCase,
  Ticket,
  TicketDetail,
} from "./types";

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function getAllProjects(): Promise<Project[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("projects")
    .select(
      "id, name, description, color, status, status_kind, completion, target_release_date, owner",
    )
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map(rowToProject);
}

export async function getProject(id: string): Promise<ProjectDetail | null> {
  const sb = await createClient();
  const { data: projectRow, error: projectErr } = await sb
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (projectErr) throw projectErr;
  if (!projectRow) return null;

  const { data: featureRows, error: featuresErr } = await sb
    .from("features")
    .select("id, name, description, status, sort_order, timeline_start, timeline_end, ticket_refs:feature_tickets(ticket:tickets(ref))")
    .eq("project_id", id)
    .order("sort_order");
  if (featuresErr) throw featuresErr;

  const features: Feature[] = (featureRows ?? []).map((f: FeatureRowWithTickets) => ({
    id: f.id,
    projectId: id,
    name: f.name,
    description: f.description,
    status: f.status,
    sortOrder: f.sort_order,
    ticketRefs: (f.ticket_refs ?? []).map((rel) => {
      const t = Array.isArray(rel.ticket) ? rel.ticket[0] : rel.ticket;
      return t?.ref;
    }).filter(Boolean) as string[],
    timelineStart: f.timeline_start,
    timelineEnd: f.timeline_end,
  })) as Feature[];

  return {
    ...rowToProject(projectRow),
    objective: projectRow.objective,
    audience: projectRow.audience,
    successMetrics: projectRow.success_metrics ?? [],
    externalRepo: projectRow.external_repo,
    features,
  };
}

export async function getProjectCounts(id: string): Promise<ProjectCounts> {
  const sb = await createClient();
  const [tickets, feedback, testing, pending, ideas] = await Promise.all([
    sb.from("tickets").select("id", { count: "exact", head: true }).eq("project_id", id),
    sb.from("feedback_items").select("id", { count: "exact", head: true }).eq("project_id", id),
    sb.from("test_cases").select("id", { count: "exact", head: true }).eq("project_id", id),
    sb.from("test_cases").select("id", { count: "exact", head: true }).eq("project_id", id).eq("status", "failed"),
    sb.from("ideas").select("id", { count: "exact", head: true }).eq("target_project_id", id).in("kind", ["new_feature", "enhancement"]),
  ]);
  return {
    tickets: tickets.count ?? 0,
    feedback: feedback.count ?? 0,
    testing: testing.count ?? 0,
    pending: pending.count ?? 0,
    proposedFromIdeas: ideas.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Lifecycle phases
// ---------------------------------------------------------------------------
export async function getProjectPhases(id: string): Promise<Phase[]> {
  const sb = await createClient();
  const { data: phaseRows, error: phaseErr } = await sb
    .from("lifecycle_phases")
    .select("id, type, name, color, sort_order, start_month, end_month")
    .eq("project_id", id)
    .order("sort_order");
  if (phaseErr) throw phaseErr;

  const phaseIds = (phaseRows ?? []).map((p) => p.id);
  let items: PhaseItemRow[] = [];
  if (phaseIds.length > 0) {
    const { data: itemRows, error: itemErr } = await sb
      .from("phase_items")
      .select("id, phase_id, name, owner, status, sort_order")
      .in("phase_id", phaseIds)
      .order("sort_order");
    if (itemErr) throw itemErr;
    items = itemRows ?? [];
  }

  return (phaseRows ?? []).map((p) => ({
    id: p.id,
    type: p.type,
    name: p.name,
    color: p.color,
    startMonth: Number(p.start_month),
    endMonth: Number(p.end_month),
    items: items
      .filter((it) => it.phase_id === p.id)
      .map((it) => ({
        id: it.id,
        name: it.name,
        owner: it.owner ?? "",
        status: it.status,
      })) satisfies PhaseItem[],
  })) as Phase[];
}

// ---------------------------------------------------------------------------
// Tickets
// ---------------------------------------------------------------------------
export async function getProjectTickets(projectId: string): Promise<Ticket[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("tickets")
    .select("id, ref, title, stage, priority, summary, project_id")
    .eq("project_id", projectId);
  if (error) throw error;
  return (data ?? []).map((t) => ({
    id: t.id,
    ref: t.ref,
    projectId: t.project_id,
    title: t.title,
    stage: t.stage,
    priority: t.priority,
    hasHandoff: !!t.summary,
  }));
}

export async function getProjectTicketsFiltered(
  projectId: string,
  featureId: string | null,
): Promise<Ticket[]> {
  const tickets = await getProjectTickets(projectId);
  if (!featureId) return tickets;
  const sb = await createClient();
  const { data, error } = await sb
    .from("feature_tickets")
    .select("ticket:tickets(ref)")
    .eq("feature_id", featureId);
  if (error) throw error;
  const refs = new Set(
    (data ?? []).map((row: FeatureTicketRow) => {
      const t = Array.isArray(row.ticket) ? row.ticket[0] : row.ticket;
      return t?.ref;
    }).filter(Boolean) as string[],
  );
  return tickets.filter((t) => refs.has(t.ref));
}

export async function getFeatureForProject(
  projectId: string,
  featureId: string,
): Promise<Feature | null> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("features")
    .select(
      "id, name, description, status, sort_order, timeline_start, timeline_end, ticket_refs:feature_tickets(ticket:tickets(ref))",
    )
    .eq("id", featureId)
    .eq("project_id", projectId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as FeatureRowWithTickets;
  return {
    id: row.id,
    projectId,
    name: row.name,
    description: row.description,
    status: row.status,
    sortOrder: row.sort_order,
    ticketRefs: (row.ticket_refs ?? []).map((rel) => {
      const t = Array.isArray(rel.ticket) ? rel.ticket[0] : rel.ticket;
      return t?.ref;
    }).filter(Boolean) as string[],
    timelineStart: row.timeline_start,
    timelineEnd: row.timeline_end,
  } as Feature;
}

export async function getTicketDetail(ref: string): Promise<TicketDetail | null> {
  const sb = await createClient();
  const { data: tRow, error: tErr } = await sb
    .from("tickets")
    .select("*")
    .eq("ref", ref)
    .maybeSingle();
  if (tErr) throw tErr;
  if (!tRow) return null;

  const [acceptance, files, activity] = await Promise.all([
    sb
      .from("ticket_acceptance")
      .select("text, checked, sort_order")
      .eq("ticket_id", tRow.id)
      .order("sort_order"),
    sb
      .from("ticket_files")
      .select("path, note, sort_order")
      .eq("ticket_id", tRow.id)
      .order("sort_order"),
    sb
      .from("ticket_activity")
      .select("who, what, meta, source, occurred_at")
      .eq("ticket_id", tRow.id)
      .order("occurred_at", { ascending: false }),
  ]);
  if (acceptance.error) throw acceptance.error;
  if (files.error) throw files.error;
  if (activity.error) throw activity.error;

  return {
    id: tRow.id,
    ref: tRow.ref,
    projectId: tRow.project_id,
    title: tRow.title,
    stage: tRow.stage,
    priority: tRow.priority,
    hasHandoff: !!tRow.summary,
    repo: tRow.repo,
    branch: tRow.branch,
    prNumber: tRow.pr_number,
    summary: tRow.summary,
    background: tRow.background,
    userStory: tRow.user_story,
    engineeringNotes: tRow.engineering_notes,
    rolePermissionImpact: tRow.role_permission_impact,
    handoffFile: tRow.handoff_file,
    handoffDate: tRow.handoff_date,
    acceptance: (acceptance.data ?? []).map((a) => ({ text: a.text, checked: a.checked })),
    files: (files.data ?? []).map((f) => ({ path: f.path, note: f.note })),
    activity: (activity.data ?? []).map((a) => ({
      who: a.who,
      what: a.what,
      meta: a.meta,
      source: a.source,
      when: relativeTime(a.occurred_at),
    })),
  };
}

// ---------------------------------------------------------------------------
// Feedback + tests + pending
// ---------------------------------------------------------------------------
export async function getProjectFeedback(projectId: string): Promise<FeedbackItem[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("feedback_items")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((f) => ({
    id: f.id,
    projectId: f.project_id,
    title: f.title,
    body: f.body,
    priority: f.priority,
    status: f.status,
    source: f.source ?? "",
    reportedBy: f.reported_by,
    createdAt: relativeTime(f.created_at),
  }));
}

export async function getProjectTestCases(projectId: string): Promise<TestCase[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("test_cases")
    .select("id, project_id, feature_id, name, steps, expected, status, owner, last_run_at, failure_note, sort_order, feature:features(name)")
    .eq("project_id", projectId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((c: TestCaseRowWithFeature) => ({
    id: c.id,
    projectId: c.project_id,
    featureId: c.feature_id,
    featureName: (() => {
      const f = c.feature;
      if (!f) return null;
      if (Array.isArray(f)) return f[0]?.name ?? null;
      return f.name;
    })(),
    name: c.name,
    steps: c.steps ?? [],
    expected: c.expected ?? "",
    status: c.status,
    owner: c.owner ?? "",
    lastRun: c.last_run_at ? relativeTime(c.last_run_at) : null,
    failureNote: c.failure_note,
  }));
}

export async function getProjectPending(projectId: string): Promise<PendingUpdate[]> {
  // Seed model: pending updates are derived from failed test cases for the demo.
  // Once we add the explicit pending_updates write path, this will read from
  // the table directly instead.
  const cases = await getProjectTestCases(projectId);
  return cases
    .filter((c) => c.status === "failed")
    .map((c, i) => {
      const linkedTicketRefs: string[] = [];
      const feature = c.featureId ? getFeatureByIdLocal(projectId, c.featureId) : null;
      if (feature) linkedTicketRefs.push(...feature.ticketRefs);
      return {
        id: `pending-${c.id}`,
        projectId,
        type: "test_failure" as const,
        title: c.name,
        description: c.failureNote ?? "",
        featureId: c.featureId,
        featureName: c.featureName,
        sourceCaseId: c.id,
        linkedTicketRefs,
        steps: c.steps,
        expected: c.expected,
        createdAt: c.lastRun ?? `${i + 1}h ago`,
      };
    });
}

export async function groupPendingByArea(projectId: string): Promise<PendingAreaGroup[]> {
  const items = await getProjectPending(projectId);
  const project = await getProject(projectId);
  const features = project?.features ?? [];
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
// Activity
// ---------------------------------------------------------------------------
export async function getActivity(limit = 24): Promise<ActivityEvent[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("activity_events")
    .select("id, who, what, target, meta, source, occurred_at, project:projects(name)")
    .order("occurred_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((a: ActivityRowWithProject) => ({
    id: a.id,
    who: a.who,
    what: a.what,
    target: a.target,
    meta: a.meta,
    projectName: one(a.project)?.name ?? null,
    source: a.source,
    when: relativeTime(a.occurred_at),
  }));
}

export async function getProjectActivity(projectName: string): Promise<ActivityEvent[]> {
  const all = await getActivity(50);
  return all.filter((a) => a.projectName === projectName);
}

// ---------------------------------------------------------------------------
// Ideas
// ---------------------------------------------------------------------------
export async function getAllIdeas(): Promise<Idea[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("ideas")
    .select(
      "*, target_project:projects!ideas_target_project_id_fkey(id, name), target_feature:features!ideas_target_feature_id_fkey(id, name)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((i: IdeaRow) => ({
    id: i.id,
    kind: i.kind,
    status: i.status,
    title: i.title,
    description: i.description,
    value: i.value,
    audience: i.audience,
    tags: i.tags ?? [],
    owner: i.owner ?? "Tyler",
    votes: i.votes ?? 0,
    targetProjectId: i.target_project_id,
    targetProjectName: one(i.target_project)?.name ?? null,
    targetFeatureId: i.target_feature_id,
    targetFeatureName: one(i.target_feature)?.name ?? null,
    createdAt: relativeTime(i.created_at),
  }));
}

export async function getIdeasForFeature(featureId: string): Promise<Idea[]> {
  const all = await getAllIdeas();
  return all.filter((i) => i.targetFeatureId === featureId);
}

// ---------------------------------------------------------------------------
// Tasks (read for SSR; mutations come later)
// ---------------------------------------------------------------------------
export async function getTasksFor(owner: string) {
  const sb = await createClient();
  const { data, error } = await sb
    .from("tasks")
    .select("*")
    .eq("owner", owner)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    done: t.done,
    linkType: t.link_type,
    linkRef: t.link_ref,
    linkProjectId: t.link_project_id,
    linkProjectName: t.link_project_name,
    due: t.due,
  }));
}

// ---------------------------------------------------------------------------
// Roadmap
// ---------------------------------------------------------------------------
export async function getAllProjectsForRoadmap() {
  const projects = await getAllProjects();
  const detailed = await Promise.all(
    projects.map(async (p) => {
      const phases = await getProjectPhases(p.id);
      const detail = await getProject(p.id);
      return { project: p, phases, features: detail?.features ?? [] };
    }),
  );
  return detailed;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    color: r.color,
    status: r.status,
    statusKind: r.status_kind,
    completion: r.completion,
    targetReleaseDate: r.target_release_date,
    owner: r.owner,
  };
}

/** Supabase's TS inference treats every embedded relation as an array, even
 *  when the FK is many-to-one. This helper normalises to the single object
 *  case (or null). */
function one<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null;
  if (Array.isArray(v)) return v[0] ?? null;
  return v;
}

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

// ---------------------------------------------------------------------------
// Row types — narrow what we read from Supabase. Saves a Database<> generic
// for now; we'll switch to generated types when we add `supabase gen types`.
// ---------------------------------------------------------------------------
import type {
  FeatureStatus,
  FeedbackPriority,
  FeedbackStatus,
  IdeaKind,
  IdeaStatus,
  ItemStatus,
  PhaseType,
  ProjectStatusKind,
  TaskLinkType,
  TestStatus,
  TicketPriority,
  TicketStage,
  BadgeKind,
} from "./types";

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: string | null;
  status_kind: ProjectStatusKind;
  completion: number;
  target_release_date: string | null;
  owner: string | null;
  objective?: string | null;
  audience?: string | null;
  success_metrics?: string[] | null;
  external_repo?: string | null;
};

type FeatureRowWithTickets = {
  id: string;
  name: string;
  description: string | null;
  status: FeatureStatus;
  sort_order: number;
  timeline_start: number | null;
  timeline_end: number | null;
  // Supabase types embedded relations as arrays in inferred TS even when the
  // relationship is many-to-one. We coerce at the call site.
  ticket_refs: Array<{ ticket: { ref: string } | { ref: string }[] }> | null;
};

type FeatureTicketRow = { ticket: { ref: string } | { ref: string }[] };

type PhaseItemRow = {
  id: string;
  phase_id: string;
  name: string;
  owner: string | null;
  status: ItemStatus;
  sort_order: number;
};

type TestCaseRowWithFeature = {
  id: string;
  project_id: string;
  feature_id: string | null;
  feature: { name: string } | { name: string }[] | null;
  name: string;
  steps: string[] | null;
  expected: string | null;
  status: TestStatus;
  owner: string | null;
  last_run_at: string | null;
  failure_note: string | null;
  sort_order: number;
};

type ActivityRowWithProject = {
  id: string;
  who: string;
  what: string;
  target: string | null;
  meta: string | null;
  source: "github" | "portal" | "manual" | "agent" | null;
  occurred_at: string;
  project: { name: string } | { name: string }[] | null;
};

type IdeaRow = {
  id: string;
  kind: IdeaKind;
  status: IdeaStatus;
  title: string;
  description: string | null;
  value: string | null;
  audience: string | null;
  tags: string[] | null;
  owner: string | null;
  votes: number | null;
  target_project_id: string | null;
  target_project: { id: string; name: string } | { id: string; name: string }[] | null;
  target_feature_id: string | null;
  target_feature: { id: string; name: string } | { id: string; name: string }[] | null;
  created_at: string;
};

// Suppress unused-type warnings; keeping the type aliases as documentation
type _Suppress = PhaseType | TicketStage | TicketPriority | FeedbackPriority | FeedbackStatus | TaskLinkType | BadgeKind;
type __unused = _Suppress;
