import { Link as LinkIcon, Plus, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FEEDBACK_PRIORITY_KIND, FEEDBACK_STATUS_KIND } from "@/lib/mock";
import type { FeedbackItem } from "@/lib/types";

const STATUS_LABEL: Record<FeedbackItem["status"], string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
};

export function FeedbackTable({ items }: { items: FeedbackItem[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3>Feedback</h3>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bc-border)] bg-white px-2.5 py-1.5 text-[12.5px] font-medium hover:bg-slate-50">
            <LinkIcon size={12} />
            BuildCore portal feed
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-white" style={{ background: "var(--bc-brand-600)" }}>
            <Plus size={12} />
            Add feedback
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[var(--bc-radius)] border border-dashed border-[var(--bc-border)] bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <MessageSquare size={22} />
          </div>
          <h3 className="mb-1.5">No feedback yet</h3>
          <p className="text-[12.5px] text-slate-500">
            Feedback from the BuildCore portal will auto-route here.
          </p>
        </div>
      ) : (
        <Card>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>Source</Th>
                <Th>Age</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f.id} className="border-b border-[var(--bc-border)] last:border-b-0 hover:bg-slate-50">
                  <td className="px-4 py-3.5 text-[13.5px] font-medium">{f.title}</td>
                  <td className="px-4 py-3.5">
                    <Badge kind={FEEDBACK_PRIORITY_KIND[f.priority]} dot={false}>
                      {f.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge kind={FEEDBACK_STATUS_KIND[f.status]}>{STATUS_LABEL[f.status]}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-[13.5px] text-slate-500">{f.source}</td>
                  <td className="px-4 py-3.5 text-[13.5px] tabular-nums text-slate-500">{f.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-[var(--bc-border)] bg-slate-50 px-4 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </th>
  );
}
