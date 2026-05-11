import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { getMeQueryOptions } from "~/features/auth/api/get-me";
import { LoginForm } from "~/features/auth/components/login-form";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions());
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-semibold">FeatureFlag</h1>
        <p className="mt-2 text-muted-foreground">Manage your feature flags with confidence.</p>
      </div>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
