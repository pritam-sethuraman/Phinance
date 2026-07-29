"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { NavIcon } from "@/components/shared/nav-icon";
import { appNavItems } from "@/config/site";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      {appNavItems.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-fib3 py-fib8 text-xs font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <NavIcon icon={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/settings"
        className={cn(
          "flex flex-1 flex-col items-center gap-fib3 py-fib8 text-xs font-medium transition-colors",
          pathname?.startsWith("/settings") || pathname?.startsWith("/profile")
            ? "text-primary"
            : "text-muted-foreground",
        )}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        More
      </Link>
    </nav>
  );
}
