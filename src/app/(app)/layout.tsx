import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { BottomTabBar } from "@/components/shared/bottom-tab-bar";
import { ThemeSync } from "@/components/shared/theme-sync";
import { requireUser } from "@/lib/auth/session";
import { getCurrentUserPrefs } from "@/lib/auth/current-user";

// Middleware already redirects anonymous requests away from /(app)/* — this
// is the defense-in-depth second check for anything rendered server-side.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  const prefs = await getCurrentUserPrefs();

  return (
    <div className="flex min-h-screen">
      <ThemeSync theme={prefs.theme} />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-fib21 pb-fib89 md:pb-fib21">
          {children}
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}
