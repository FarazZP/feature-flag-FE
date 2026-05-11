import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { DefaultErrorComponent } from "~/components/error-boundary";
import { AppShell } from "~/components/layout/app-shell";
import { NotFoundComponent } from "~/components/not-found";
import { Skeleton } from "~/components/ui/skeleton";
import { useAuthContext } from "~/features/auth/components/auth-provider";
import type { RouterContext } from "../router";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  errorComponent: DefaultErrorComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    );
  }

  return <Outlet />;
}
