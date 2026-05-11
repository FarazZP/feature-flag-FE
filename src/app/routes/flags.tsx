import { createFileRoute, redirect } from "@tanstack/react-router";
import { getMeQueryOptions } from "~/features/auth/api/get-me";
import { FlagsPage } from "~/features/feature-flags/components/flags-page";

export const Route = createFileRoute("/flags")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/flags" } });
    }
    return { user };
  },
  component: FlagsPage,
});
