import { createFileRoute, redirect } from "@tanstack/react-router";
import { Flag, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getMeQueryOptions } from "~/features/auth/api/get-me";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.name}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Flag
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-body text-sm font-medium">
              Total Flags
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold">0</p>
            <p className="text-muted-foreground text-xs">
              No flags created yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-body text-sm font-medium">
              Active Flags
            </CardTitle>
            <Flag className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold">0</p>
            <p className="text-muted-foreground text-xs">
              Across all environments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-body text-sm font-medium">
              Workspace
            </CardTitle>
            <Flag className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold">
              {user.workspaceId ? "Active" : "Not set up"}
            </p>
            <p className="text-muted-foreground text-xs">
              {user.workspaceId
                ? "Your workspace is ready"
                : "Create a workspace to get started"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
