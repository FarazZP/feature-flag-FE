import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { acceptInvitation } from "../api/accept-invitation";
import { acceptInvitationSchema, type AcceptInvitationFormValues } from "../models/workspace.models";

interface AcceptInvitationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AcceptInvitationDialog({ open, onClose }: AcceptInvitationDialogProps) {
  const queryClient = useQueryClient();

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
      toast.success("Invitation accepted! You've joined the workspace.");
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to accept invitation");
    },
  });

  function onSubmit(values: AcceptInvitationFormValues) {
    mutate(values.token);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Invitation</DialogTitle>
          <DialogDescription>
            Enter the invitation token you received to join a workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invitation-token">Invitation Token</Label>
            <Input
              id="invitation-token"
              {...form.register("token")}
              placeholder="Paste your invitation token"
            />
            {form.formState.errors.token && (
              <p className="text-destructive text-sm">{form.formState.errors.token.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Accepting..." : "Accept Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
