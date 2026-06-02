import { Plus, Lightbulb } from "lucide-react";
import { IDEA_KIND_INFO } from "@/lib/mock";
import { getAllIdeas } from "@/lib/db";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { IdeasTabs } from "@/components/ideas/IdeasTabs";
import { StatusFilter } from "@/components/ideas/StatusFilter";
import { QuickCapture } from "@/components/ideas/QuickCapture";
import type { IdeaKind, IdeaStatus } from "@/lib/types";

type Props = {
  searchParams: Promise<{ kind?: string; status?: string }>;
};

const VALID_KINDS: IdeaKind[] = ["new_project", "new_feature", "enhancement"];

export default async function IdeasPage({ searchParams }: Props) {
  const { kind: kindParam, status: statusParam } = await searchParams;
  const activeKind: IdeaKind =
    kindParam && (VALID_KINDS as string[]).includes(kindParam)
      ? (kindParam as IdeaKind)
      : "new_project";
  const activeStatus: IdeaStatus | "all" = statusParam ? (statusParam as IdeaStatus) : "all";

  const all = await getAllIdeas();
  const inKind = all.filter((i) => i.kind === activeKind);
  const visible = inKind.filter((i) => activeStatus === "all" || i.status === activeStatus);

  const kindCounts = VALID_KINDS.reduce(
    (acc, k) => {
      acc[k] = all.filter((i) => i.kind === k).length;
      return acc;
    },
    {} as Record<IdeaKind, number>,
  );

  const statusCounts: Partial<Record<IdeaStatus, number>> = {};
  for (const i of inKind) {
    statusCounts[i.status] = (statusCounts[i.status] ?? 0) + 1;
  }

  const kindInfo = IDEA_KIND_INFO[activeKind];
  const placeholders: Record<IdeaKind, string> = {
    new_project: "Type a project idea and press Enter for quick capture...",
    new_feature: "Capture a new feature — Enter opens the form to set the target project",
    enhancement: "Capture an enhancement — Enter opens the form to set the target feature",
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Ideas</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            New projects, new features, and enhancements — three lanes so smaller ideas stay
            visible.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium text-white"
          style={{ background: "var(--bc-brand-600)" }}
        >
          <Plus size={14} />
          {kindInfo.label}
        </button>
      </div>

      <QuickCapture
        placeholder={placeholders[activeKind]}
        primaryLabel={activeKind === "new_project" ? "Capture" : "Continue"}
      />

      <IdeasTabs active={activeKind} counts={kindCounts} />

      <StatusFilter active={activeStatus} inKindCounts={statusCounts} totalInKind={inKind.length} />

      {visible.length === 0 ? (
        <div className="rounded-[var(--bc-radius)] border border-dashed border-[var(--bc-border)] bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Lightbulb size={22} />
          </div>
          <h3 className="mb-1.5">No ideas in this view</h3>
          <p className="text-[12.5px] text-slate-500">
            {inKind.length === 0
              ? activeKind === "new_project"
                ? "Type something above to capture your first project idea."
                : "Capture an idea with its target set."
              : "Try Any status."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visible.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
