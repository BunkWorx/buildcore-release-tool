import { Folder, Ticket, MessageSquare, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MOCK_KPIS } from "@/lib/mock";

type StatCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  iconColor: string;
};

function StatCard({ label, value, delta, deltaTone = "neutral", icon: Icon, iconColor }: StatCardProps) {
  const toneClass =
    deltaTone === "up"
      ? "text-success-700"
      : deltaTone === "down"
        ? "text-danger-700"
        : "text-slate-400";
  return (
    <Card className="px-5 py-4">
      <div className="mb-2 flex items-center justify-between text-[12.5px] font-medium text-slate-600">
        <span>{label}</span>
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <div className="text-[28px] font-extrabold tabular-nums tracking-tight text-slate-900">
        {value}
      </div>
      {delta && <div className={`mt-1.5 text-[12px] ${toneClass}`}>{delta}</div>}
    </Card>
  );
}

export function StatGrid() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Active projects"
        value={MOCK_KPIS.activeProjects}
        delta="+1 this quarter"
        deltaTone="up"
        icon={Folder}
        iconColor="var(--bc-brand-600)"
      />
      <StatCard
        label="Tickets in flight"
        value={MOCK_KPIS.ticketsInFlight - MOCK_KPIS.ticketsLive}
        delta={`${MOCK_KPIS.ticketsInDev} in dev · ${MOCK_KPIS.ticketsLive} live`}
        icon={Ticket}
        iconColor="var(--bc-info-600)"
      />
      <StatCard
        label="Open feedback"
        value={MOCK_KPIS.openFeedback}
        delta={`+${MOCK_KPIS.feedbackDeltaSinceYesterday} since yesterday`}
        deltaTone="down"
        icon={MessageSquare}
        iconColor="var(--bc-warning-600)"
      />
      <StatCardNextRelease />
    </div>
  );
}

function StatCardNextRelease() {
  return (
    <Card className="px-5 py-4">
      <div className="mb-2 flex items-center justify-between text-[12.5px] font-medium text-slate-600">
        <span>Next release</span>
        <Clock size={16} style={{ color: "var(--bc-success-600)" }} />
      </div>
      <div className="text-[22px] font-extrabold tracking-tight text-slate-900">
        {MOCK_KPIS.nextReleaseDate}
      </div>
      <div className="mt-1.5 text-[12px] text-slate-400">
        {MOCK_KPIS.nextReleaseProjectName} · in {MOCK_KPIS.nextReleaseInDays} days
      </div>
    </Card>
  );
}
