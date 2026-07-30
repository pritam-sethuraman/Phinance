import { cn } from "@/lib/utils";

function scorePassword(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const COLORS = [
  "bg-status-over",
  "bg-status-over",
  "bg-status-warn",
  "bg-status-ok",
  "bg-primary",
];

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password);
  if (!password) return null;

  return (
    <div className="flex flex-col gap-fib3" aria-live="polite">
      <div className="flex gap-fib3">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full bg-muted",
              i < score && COLORS[score],
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{LABELS[score]}</span>
    </div>
  );
}
