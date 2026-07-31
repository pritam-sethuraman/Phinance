"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { CATEGORIES, CATEGORY_META } from "@/config/categories";
import { useTransactionFilters } from "./use-transaction-filters";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Amount: high to low" },
  { value: "amount_asc", label: "Amount: low to high" },
];

// const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
//   const date = new Date();
//   date.setMonth(date.getMonth() - i);

//   return {
//     value: date.toISOString().slice(0, 7),
//     label: date.toLocaleDateString("en-US", {
//       month: "long",
//       year: "numeric",
//     }),
//   };
// });

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  return String(new Date().getFullYear() - i);
});

export function TransactionFilterBar() {
  const { current, update } = useTransactionFilters();
  const [searchDraft, setSearchDraft] = useState(current.q);
  const selectedYear = current.month ? current.month.split("-")[0] : "";
  const selectedMonth = current.month ? current.month.split("-")[1] : "";

  // Keep the input in sync if the URL changes from elsewhere (e.g. "Clear filters").
  useEffect(() => {
    setSearchDraft(current.q);
  }, [current.q]);

  // Debounce: push the URL update 300ms after the user stops typing, rather
  // than on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchDraft !== current.q) {
        update({ q: searchDraft || undefined });
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const activeCount = [current.month, current.category, current.q].filter(
    Boolean,
  ).length;
  const hasFilters = activeCount > 0;

  function clearAll() {
    setSearchDraft("");
    update({
      month: undefined,
      category: undefined,
      q: undefined,
      sort: undefined,
    });
  }

  const controls = (
    <>
      <div className="flex flex-col gap-fib5">
        <label
          htmlFor="txn-month"
          className="text-xs font-medium text-muted-foreground"
        >
          Month
        </label>
        <div className="flex gap-fib5">
          <Select
            value={selectedMonth || "ALL"}
            onValueChange={(month) => {
              if (month === "ALL") {
                update({ month: undefined });
              } else {
                update({
                  month: `${selectedYear || new Date().getFullYear()}-${month}`,
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All months</SelectItem>

              {MONTH_OPTIONS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear || String(new Date().getFullYear())}
            onValueChange={(year) => {
              if (selectedMonth) {
                update({
                  month: `${year}-${selectedMonth}`,
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>

            <SelectContent>
              {YEAR_OPTIONS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <Input
          id="txn-month"
          type="month"
          value={current.month}
          onChange={(e) => update({ month: e.target.value || undefined })}
        /> */}
      </div>

      <div className="flex flex-col gap-fib5">
        <label
          htmlFor="txn-category"
          className="text-xs font-medium text-muted-foreground"
        >
          Category
        </label>
        <Select
          value={current.category || "ALL"}
          onValueChange={(v) =>
            update({ category: v === "ALL" ? undefined : v })
          }
        >
          <SelectTrigger id="txn-category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_META[c].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-fib5">
        <label
          htmlFor="txn-sort"
          className="text-xs font-medium text-muted-foreground"
        >
          Sort
        </label>
        <Select value={current.sort} onValueChange={(v) => update({ sort: v })}>
          <SelectTrigger id="txn-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-fib8">
      <div className="flex items-center gap-fib8">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-fib8 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search merchant or note…"
            className="pl-fib34"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            aria-label="Search transactions"
          />
        </div>

        {/* Desktop: inline controls */}
        <div className="hidden items-end gap-fib8 md:flex">{controls}</div>

        {/* Mobile: controls in a bottom sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <Badge className="ml-fib3">{activeCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex flex-col gap-fib21">
            <SheetHeader>
              <SheetTitle>Filter transactions</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-fib13">{controls}</div>
            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full">Done</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="h-auto w-fit px-fib5 py-fib1 text-xs text-muted-foreground"
        >
          <X className="h-3 w-3" /> Clear filters
        </Button>
      )}
    </div>
  );
}
