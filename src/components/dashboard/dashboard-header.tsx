"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMonthParam } from "@/hooks/use-month-param";
import { QuickAddButton } from "./quick-add-button";

export function DashboardHeader({
  userName,
  currency,
  locale,
}: {
  userName?: string | null;
  currency?: string;
  locale?: string;
}) {
  const { month, setMonth } = useMonthParam();

  // Computed client-side only, after mount — the server (likely UTC) and
  // the visitor's local time can disagree about which greeting bucket
  // applies, which would otherwise cause a hydration mismatch warning.
  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const firstName = userName?.trim().split(/\s+/)[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-fib13">
      <h2 className="font-display text-xl font-medium">
        {greeting}
        {firstName ? `, ${firstName}` : ""}
      </h2>
      <div className="flex items-center gap-fib8">
        <Input
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
          className="w-fit"
          aria-label="Select month"
        />
        <QuickAddButton currency={currency} locale={locale} />
      </div>
    </div>
  );
}
