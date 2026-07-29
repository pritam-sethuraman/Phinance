import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { BottomTabBar } from "@/components/shared/bottom-tab-bar";

// TODO(M2): wrap with requireUser() session guard once Auth.js lands —
// middleware.ts will also redirect anonymous users to /login.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
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
