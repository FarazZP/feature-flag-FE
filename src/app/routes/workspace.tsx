import { createFileRoute, redirect } from "@tanstack/react-router";
import { getMeQueryOptions } from "~/features/auth/api/get-me";
import { WorkspaceSettingsPage } from "~/features/workspace/components/workspace-settings-page";

export const Route = createFileRoute("/workspace")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/workspace" } });
    }
    return { user };
  },
  component: WorkspaceSettingsPage,
});
