import { createFileRoute, redirect } from "@tanstack/react-router";
import { getMeQueryOptions } from "~/features/auth/api/get-me";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/login" });
  },
});
