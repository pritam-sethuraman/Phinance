"use client";

import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Exports whatever filters are currently applied on the Transactions page. */
export function ExportCsvButton() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page");
  params.delete("pageSize");
  const href = `/api/export/csv${params.toString() ? `?${params.toString()}` : ""}`;

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href} download>
        <Download className="h-4 w-4" /> Export (CSV)
      </a>
    </Button>
  );
}
