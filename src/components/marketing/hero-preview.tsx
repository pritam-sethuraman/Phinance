import { formatCents } from "@/lib/money";

/**
 * Static illustrative preview of the dashboard's utilization gauge for the
 * landing page hero. Real, live version ships in M7 — this is presentational
 * only (no data fetching).
 */
export function HeroPreview() {
  const spent = 174230;
  const budget = 250000;
  const pct = spent / budget;

  // Arc geometry: 270° sweep starting at 135°, matching the golden-angle motif
  // used in the logo mark.
  const radius = 70;
  const circumference = 2 * Math.PI * radius * 0.75; // 270° of the circle
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="w-full max-w-sm rounded-golden border border-border bg-card p-fib21 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            This month
          </p>
          <p className="font-mono text-2xl font-semibold">
            {formatCents(spent)}
          </p>
        </div>
        <span className="rounded-full bg-status-ok/15 px-fib8 py-fib1 text-xs font-medium text-status-ok">
          On track
        </span>
      </div>

      <div className="relative mx-auto my-fib21 flex h-40 w-40 items-center justify-center">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-[225deg]">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className="stroke-primary"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-xl font-semibold">
            {Math.round(pct * 100)}%
          </span>
          <span className="text-xs text-muted-foreground">
            of {formatCents(budget)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Housing</span>
        <span>Food</span>
        <span>Transport</span>
        <span>Other</span>
      </div>
      <div className="mt-fib5 flex h-2 overflow-hidden rounded-full">
        <span className="w-[40%] bg-[hsl(168_45%_32%)]" />
        <span className="w-[25%] bg-[hsl(38_65%_48%)]" />
        <span className="w-[15%] bg-[hsl(210_45%_48%)]" />
        <span className="w-[20%] bg-[hsl(0_0%_55%)]" />
      </div>
    </div>
  );
}
