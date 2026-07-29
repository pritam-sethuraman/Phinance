import Link from "next/link";
import {
  ArrowRight,
  PiggyBank,
  LineChart,
  Download,
  ShieldCheck,
} from "lucide-react";
import { Wordmark } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { siteConfig } from "@/config/site";

const features = [
  {
    icon: PiggyBank,
    title: "Track expenses",
    body: "Log an expense in under 10 seconds. Amount, category, merchant, note — nothing else in the way.",
  },
  {
    icon: ShieldCheck,
    title: "Budget smartly",
    body: "Set an overall budget and per-category limits. Get a clear warning before you go over, not after.",
  },
  {
    icon: LineChart,
    title: "Analytics & trends",
    body: "See where your money actually goes: monthly trend, budget vs. actual, top categories.",
  },
  {
    icon: Download,
    title: "Export anytime",
    body: "Your data is yours. Pull a CSV of any month or filter, whenever you want it.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-fib21 py-fib21">
        <Link href="/">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-fib8">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-fib55 px-fib21 py-fib55 md:grid-cols-2 md:py-fib89">
        <div className="flex flex-col gap-fib21">
          <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
            Take control of <em className="not-italic text-primary">your</em>{" "}
            money.
          </h1>
          <p className="max-w-md text-balance text-lg text-muted-foreground">
            {siteConfig.description} Every screen answers one question: am I on
            track?
          </p>
          <div className="flex flex-wrap gap-fib13">
            <Button size="lg" asChild>
              <Link href="/register">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">See demo</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <HeroPreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-fib21 px-fib21 py-fib55 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-fib13 rounded-xl border border-border bg-card p-fib21"
            >
              <div className="flex h-fib34 w-fib34 items-center justify-center rounded-full bg-accent">
                <Icon
                  className="h-5 w-5 text-accent-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-display text-base font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why $0 */}
      <section id="cost" className="mx-auto max-w-6xl px-fib21 py-fib55">
        <div className="grid gap-fib34 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-fib13">
            <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              Why does Phinance cost $0?
            </h2>
            <p className="text-muted-foreground">
              Budgeting apps shouldn&apos;t cost $8–15 a month to tell you what
              you already own: your own spending data. Phinance runs entirely on
              free infrastructure tiers — Vercel, Neon Postgres, Auth.js — so
              there&apos;s no subscription to justify and no ads paying the
              bills.
            </p>
            <p className="text-muted-foreground">
              That&apos;s a real architectural constraint, not a marketing line:
              every feature is built to work within a free tier, or it
              doesn&apos;t ship.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-fib21">
            <dl className="flex flex-col divide-y divide-border">
              {[
                ["Hosting", "Vercel Hobby"],
                ["Database", "Neon Postgres (free)"],
                ["Auth", "Google, GitHub, email"],
                ["Monthly cost", "$0.00"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-fib8 text-sm"
                >
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-mono font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-fib21 py-fib55">
          <h2 className="mb-fib21 font-display text-2xl font-medium tracking-tight">
            Frequently asked
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {[
              {
                q: "Is my financial data private?",
                a: "Yes. Your transactions and budgets are scoped to your account only — no data is sold or shared with advertisers.",
              },
              {
                q: "Does it connect to my bank?",
                a: "Not yet. MVP is manual entry, built for speed. Bank sync is planned for a later phase.",
              },
              {
                q: "Can I export my data?",
                a: "Yes — CSV export is built in from day one, with Excel and PDF summaries planned as a fast-follow.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-fib21">
                <h3 className="font-display text-base font-medium">{q}</h3>
                <p className="mt-fib5 text-sm text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-fib13 px-fib21 py-fib21 text-sm text-muted-foreground sm:flex-row">
          <Wordmark className="text-foreground" />
          <div className="flex items-center gap-fib21">
            <a href="#" className="transition-colors hover:text-foreground">
              About
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a
              href={siteConfig.links.github}
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
