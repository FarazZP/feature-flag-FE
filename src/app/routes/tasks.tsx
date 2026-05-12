import { createFileRoute, redirect } from "@tanstack/react-router";
import { getMeQueryOptions } from "~/features/auth/api/get-me";
import { TasksPage } from "~/features/tasks/components/tasks-page";

export const Route = createFileRoute("/tasks")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/tasks" } });
    }
    return { user };
  },
  component: TasksPage,
});
