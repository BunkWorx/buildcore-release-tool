import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_TICKET_PIPELINE } from "@/lib/mock";

export function TicketPipelineCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket pipeline</CardTitle>
      </CardHeader>
      <div className="px-5 py-2">
        {MOCK_TICKET_PIPELINE.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-b-0"
          >
            <Badge kind={s.kind}>{s.label}</Badge>
            <span className="text-[15px] font-semibold tabular-nums">{s.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
