import type { PropsWithChildren } from "react";
import { AppSidebar } from "~/components/app-sidebar";
import { AppHeader } from "./app-header";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
