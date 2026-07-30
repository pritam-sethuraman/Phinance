"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Wordmark } from "@/components/shared/logo";
import { NavIcon } from "@/components/shared/nav-icon";
import { appNavItems, secondaryNavItems } from "@/config/site";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-fib55 items-center border-b border-border px-fib21">
        <Link href="/dashboard">
          <Wordmark />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-fib1 px-fib13 py-fib21">
        {appNavItems.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={pathname?.startsWith(item.href)}
          />
        ))}

        <div className="my-fib13 h-px bg-border" />

        {secondaryNavItems.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={pathname?.startsWith(item.href)}
          />
        ))}
      </nav>

      <div className="border-t border-border p-fib13">
        <button
          type="button"
          className="flex w-full items-center gap-fib13 rounded-md px-fib13 py-fib8 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  active,
}: {
  item: (typeof appNavItems)[number];
  active?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-fib13 rounded-md px-fib13 py-fib8 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <NavIcon icon={item.icon} className="h-4 w-4" />
      {item.label}
    </Link>
  );
}
