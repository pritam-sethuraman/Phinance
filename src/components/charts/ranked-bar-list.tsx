import { formatCents } from "@/lib/money";

interface RankedBarListProps {
  data: { label: string; value: number; color?: string }[];
}

export function RankedBarList({ data }: RankedBarListProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ol className="flex flex-col gap-fib8">
      {data.map((entry, i) => (
        <li key={entry.label} className="flex items-center gap-fib8">
          <span className="w-fib21 shrink-0 text-right text-xs font-medium text-muted-foreground">
            {i + 1}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-fib3">
            <div className="flex items-center justify-between gap-fib8 text-sm">
              <span className="truncate font-medium">{entry.label}</span>
              <span className="shrink-0 font-mono text-muted-foreground">{formatCents(entry.value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(entry.value / max) * 100}%`,
                  backgroundColor: entry.color ?? "hsl(var(--primary))",
                }}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
