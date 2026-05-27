import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

/** Plain white card surface with the BuildCore border + radius + xs shadow.
    All dashboard panels, project cards, and feature cards extend this look. */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--bc-radius)] border border-[var(--bc-border)] bg-white shadow-[var(--bc-shadow-xs)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-[var(--bc-border)] px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("m-0 text-[15px] font-bold", className)} {...props} />;
}

export function CardBody({ className, ...props }: CardProps) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
