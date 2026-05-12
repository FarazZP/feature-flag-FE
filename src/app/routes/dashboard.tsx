import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Flag, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getMeQueryOptions } from "~/features/auth/api/get-me";
import { getFlagsQueryOptions } from "~/features/feature-flags/api/get-flags";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/dashboard" } });
    }
    return { user };
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useRouteContext();
  const { data: flags } = useQuery(getFlagsQueryOptions());

  const totalFlags = flags?.length ?? 0;
  const activeFlags =
    flags?.filter(
      (f) => f.environments.development || f.environments.staging || f.environments.production,
    ).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <Link to="/flags">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Flag
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-body text-sm font-medium">Total Flags</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold">{totalFlags}</p>
            <p className="text-muted-foreground text-xs">
              {totalFlags === 0
                ? "No flags created yet"
                : `${totalFlags} flag${totalFlags === 1 ? "" : "s"} in your workspace`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-body text-sm font-medium">Active Flags</CardTitle>
            <Flag className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold">{activeFlags}</p>
            <p className="text-muted-foreground text-xs">
              {activeFlags === 0 ? "No flags enabled yet" : "Enabled in at least one environment"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-body text-sm font-medium">Workspace</CardTitle>
            <Flag className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold">
              {user.workspaceId ? "Active" : "Not set up"}
            </p>
            <p className="text-muted-foreground text-xs">
              {user.workspaceId ? "Your workspace is ready" : "Create a workspace to get started"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
