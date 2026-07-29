import { LayoutDashboard, ArrowLeftRight, Wallet, BarChart3, Settings, User } from "lucide-react";
import type { NavItem } from "@/config/site";

const ICONS: Record<NavItem["icon"], typeof LayoutDashboard> = {
  "layout-dashboard": LayoutDashboard,
  "arrow-left-right": ArrowLeftRight,
  wallet: Wallet,
  "bar-chart-3": BarChart3,
  settings: Settings,
  user: User,
};

export function NavIcon({ icon, className }: { icon: NavItem["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden="true" />;
}
