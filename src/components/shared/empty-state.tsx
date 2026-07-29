import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-fib13 rounded-xl border border-dashed border-border px-fib21 py-fib55 text-center",
        className,
      )}
    >
      <div className="flex h-fib55 w-fib55 items-center justify-center rounded-full bg-accent">
        <Icon className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-fib3">
        <p className="font-display text-base font-medium">{title}</p>
        {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
