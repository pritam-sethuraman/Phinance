"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface FilterUpdate {
  month?: string;
  category?: string;
  q?: string;
  sort?: string;
  page?: number;
}

/**
 * Reads current filter values from the URL and exposes an `update` function
 * that patches the URL (shareable, back-button friendly — per M5). Changing
 * any filter other than `page` implicitly resets pagination to page 1
 * (removes the `page` param) unless the patch itself sets `page`.
 */
export function useTransactionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = useMemo(
    () => ({
      month: searchParams.get("month") ?? "",
      category: searchParams.get("category") ?? "",
      q: searchParams.get("q") ?? "",
      sort: searchParams.get("sort") ?? "date_desc",
      page: Number(searchParams.get("page") ?? "1"),
    }),
    [searchParams],
  );

  const update = useCallback(
    (patch: FilterUpdate) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      if (!("page" in patch)) {
        params.delete("page");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { current, update };
}
