import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { ITEM_STATUS_LABEL, PHASE_COLOR_VAR } from "@/lib/mock";
import type { Phase } from "@/lib/types";

/** Per-phase checklists rendered as nested tables. Editable add/delete/reorder
    interactions land when we wire to Supabase + real mutations; this is the
    read-only port. */
export function PhaseChecklists({ phases }: { phases: Phase[] }) {
  const totalItems = phases.reduce((s, p) => s + p.items.length, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phase checklists</CardTitle>
        <span className="text-[11.5px] text-slate-400">
          {phases.length} phases · {totalItems} items
        </span>
      </CardHeader>
      <div className="p-6">
        {phases.map((p) => (
          <div key={p.id} className="mb-5 last:mb-0">
            <h4 className="mb-2 flex items-center gap-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: PHASE_COLOR_VAR[p.color] }}
              />
              {p.name}
            </h4>
            {p.items.length === 0 ? (
              <p className="px-1 py-2 text-[12.5px] text-slate-400">No items yet.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <Th>Item</Th>
                    <Th>Owner</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {p.items.map((it) => {
                    const status = ITEM_STATUS_LABEL[it.status];
                    return (
                      <tr key={it.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                        <td className="px-4 py-3.5 text-[13.5px]">{it.name}</td>
                        <td className="px-4 py-3.5 text-[13.5px] text-slate-500">{it.owner}</td>
                        <td className="px-4 py-3.5">
                          <Badge kind={status.kind}>{status.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-[var(--bc-border)] bg-slate-50 px-4 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </th>
  );
}
