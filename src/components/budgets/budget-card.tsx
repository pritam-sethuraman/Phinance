"use client";

import { Loader2, MoreVertical, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCents, formatPercent } from "@/lib/money";
import { CATEGORY_META, type CategoryKey } from "@/config/categories";
import type { UtilizationEntry } from "@/lib/services/budget";

const STATUS_LABEL: Record<UtilizationEntry["status"], string> = {
  ok: "On track",
  warn: "Nearing limit",
  over: "Over budget",
};

const STATUS_INDICATOR_CLASS: Record<UtilizationEntry["status"], string> = {
  ok: "bg-status-ok",
  warn: "bg-status-warn",
  over: "bg-status-over",
};

interface BudgetCardProps {
  entry: UtilizationEntry;
  title?: string;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
  size?: "default" | "lg";
}

export function BudgetCard({ entry, title, onEdit, onDelete, deleting, size = "default" }: BudgetCardProps) {
  const label = title ?? (entry.category ? CATEGORY_META[entry.category].label : "Overall");
  const pctClamped = Math.min(entry.pct, 1) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-fib8 space-y-0">
        <CardTitle className={size === "lg" ? "text-xl" : undefined}>{label}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label={`Options for ${label} budget`}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col gap-fib8">
        <div className="flex flex-wrap items-baseline justify-between gap-fib5">
          <span className="font-mono text-sm font-medium">
            {formatCents(entry.spent)}{" "}
            <span className="text-muted-foreground">/ {formatCents(entry.limit)}</span>
          </span>
          <Badge variant={entry.status}>{STATUS_LABEL[entry.status]}</Badge>
        </div>
        <Progress
          value={pctClamped}
          indicatorClassName={STATUS_INDICATOR_CLASS[entry.status]}
          aria-label={`${label} budget: ${formatPercent(entry.pct)} used`}
        />
        <span className="text-xs text-muted-foreground">{formatPercent(entry.pct)} used</span>
      </CardContent>
    </Card>
  );
}
