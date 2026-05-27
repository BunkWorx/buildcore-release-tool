import { AlertTriangle, Clock, FlaskConical } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { MOCK_NEEDS_ATTENTION } from "@/lib/mock";
import type { NeedsAttentionItem } from "@/lib/mock";

const ICONS: Record<NeedsAttentionItem["iconKind"], { Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }> = {
  danger:  { Icon: AlertTriangle, color: "var(--bc-danger-600)" },
  warning: { Icon: Clock,         color: "var(--bc-warning-600)" },
  info:    { Icon: FlaskConical,  color: "var(--bc-info-600)" },
};

export function NeedsAttentionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
      </CardHeader>
      <div className="px-5 py-2">
        {MOCK_NEEDS_ATTENTION.map((it) => {
          const { Icon, color } = ICONS[it.iconKind];
          return (
            <div
              key={it.id}
              className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-b-0"
            >
              <Icon size={16} style={{ color, flexShrink: 0 }} />
              <div className="flex-1 text-[13px]">
                <div className="font-semibold">{it.title}</div>
                <div className="text-[12px] text-slate-500">{it.meta}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
