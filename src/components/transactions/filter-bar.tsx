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

export function TransactionFilterBar() {
  const { current, update } = useTransactionFilters();
  const [searchDraft, setSearchDraft] = useState(current.q);

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

  const activeCount = [current.month, current.category, current.q].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  function clearAll() {
    setSearchDraft("");
    update({ month: undefined, category: undefined, q: undefined, sort: undefined });
  }

  const controls = (
    <>
      <div className="flex flex-col gap-fib5">
        <label htmlFor="txn-month" className="text-xs font-medium text-muted-foreground">
          Month
        </label>
        <Input
          id="txn-month"
          type="month"
          value={current.month}
          onChange={(e) => update({ month: e.target.value || undefined })}
        />
      </div>

      <div className="flex flex-col gap-fib5">
        <label htmlFor="txn-category" className="text-xs font-medium text-muted-foreground">
          Category
        </label>
        <Select
          value={current.category || "ALL"}
          onValueChange={(v) => update({ category: v === "ALL" ? undefined : v })}
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
        <label htmlFor="txn-sort" className="text-xs font-medium text-muted-foreground">
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
              {activeCount > 0 && <Badge className="ml-fib3">{activeCount}</Badge>}
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
