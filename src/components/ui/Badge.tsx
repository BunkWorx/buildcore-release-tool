import { cn } from "@/lib/cn";
import type { BadgeKind } from "@/lib/types";

const KIND_CLASSES: Record<BadgeKind, string> = {
  neutral: "bg-slate-100 text-slate-700",
  info:    "bg-info-50 text-info-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger:  "bg-danger-50 text-danger-700",
  brand:   "bg-brand-50 text-brand-700",
  purple:  "bg-purple-50 text-purple-700",
};

type Props = {
  kind?: BadgeKind;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Small pill used for status labels (Live, In dev, On track, etc.).
    The colored dot is on by default; set `dot={false}` for plain pills. */
export function Badge({ kind = "neutral", dot = true, className, children }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold tracking-tight",
        KIND_CLASSES[kind],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
