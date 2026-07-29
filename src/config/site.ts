export const siteConfig = {
  name: "Phinance",
  tagline: "Take control of your money.",
  description:
    "Track spend, set budgets, and see insights — 100% free, private, yours.",
  url: "https://phinance-tracker.vercel.app/",
  links: {
    github: "https://github.com/pritam-sethuraman/phinance",
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
  icon:
    | "layout-dashboard"
    | "arrow-left-right"
    | "wallet"
    | "bar-chart-3"
    | "settings"
    | "user";
}

/** Primary app navigation — used by both the desktop sidebar and mobile bottom tab bar. */
export const appNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
  { label: "Transactions", href: "/transactions", icon: "arrow-left-right" },
  { label: "Budgets", href: "/budgets", icon: "wallet" },
  { label: "Analytics", href: "/analytics", icon: "bar-chart-3" },
];

/** Secondary nav — shown in the sidebar but not the mobile bottom bar (lives under "More"). */
export const secondaryNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: "settings" },
  { label: "Profile", href: "/profile", icon: "user" },
];
