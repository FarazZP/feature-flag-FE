import { createFileRoute, redirect } from "@tanstack/react-router";
import { getMeQueryOptions } from "~/features/auth/api/get-me";
import { AuditLogsPage } from "~/features/audit/components/audit-logs-page";

export const Route = createFileRoute("/audit")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/audit" } });
    }
    if (user.role !== "owner" && user.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
    return { user };
  },
  component: AuditLogsPage,
});
