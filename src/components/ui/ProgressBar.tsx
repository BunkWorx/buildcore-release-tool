import { cn } from "@/lib/cn";

type Props = {
  percent: number;
  color?: string;
  className?: string;
};

/** Thin progress bar. `color` accepts any CSS color (incl. CSS vars). */
export function ProgressBar({ percent, color, className }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-slate-100",
        className,
      )}
    >
      <span
        className="block h-full rounded-full"
        style={{
          width: `${clamped}%`,
          background: color ?? "var(--bc-brand-600)",
        }}
      />
    </div>
  );
}
