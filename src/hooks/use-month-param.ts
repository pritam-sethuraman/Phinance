"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { currentMonthKey } from "@/lib/date";

/** URL-synced ?month= state, shared by the Budgets and Dashboard pages. */
export function useMonthParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = searchParams.get("month") ?? currentMonthKey();

  const setMonth = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === currentMonthKey()) {
        params.delete("month");
      } else {
        params.set("month", next);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  return { month, setMonth };
}
