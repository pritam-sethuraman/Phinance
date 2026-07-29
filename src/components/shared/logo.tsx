import { cn } from "@/lib/utils";

/**
 * Phinance's signature mark: a single arc swept at the golden angle (137.5°),
 * echoing the golden-ratio spacing/radius scale used throughout the app.
 * Deliberately not a spiral or literal "φ" glyph — quieter, reads as a mark
 * at small sizes (favicon, avatar fallback, topbar).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" className="stroke-border" strokeWidth="2" />
      <path
        d="M16 3 A13 13 0 0 1 26.6 21.4"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.5" className="fill-primary" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-fib8", className)}>
      <Logo />
      <span className="font-display text-lg font-medium tracking-tight">Phinance</span>
    </span>
  );
}
