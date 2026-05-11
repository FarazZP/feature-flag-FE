import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { acceptInvitation } from "../api/accept-invitation";
import { acceptInvitationSchema, type AcceptInvitationFormValues } from "../models/workspace.models";

export function AcceptInvitationPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { token: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      toast.success("Invitation accepted! Welcome to the workspace.");
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to accept invitation");
    },
  });

  function onSubmit(values: AcceptInvitationFormValues) {
    mutate(values.token);
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            Enter the invitation token you received to join a workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Invitation Token</Label>
              <Input
                id="token"
                {...form.register("token")}
                placeholder="Paste your invitation token here"
              />
              {form.formState.errors.token && (
                <p className="text-destructive text-sm">{form.formState.errors.token.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Accepting..." : "Accept Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
