import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { getMeQueryOptions } from "~/features/auth/api/get-me";
import { AcceptInvitationPage } from "~/features/workspace/components/accept-invitation-page";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/accept-invitation")({
  validateSearch: searchSchema,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/accept-invitation" } });
    }
    return { user };
  },
  component: AcceptInvitationPage,
});
