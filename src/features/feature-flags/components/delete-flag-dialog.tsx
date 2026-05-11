import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { deleteFlag } from "../api/delete-flag";
import type { Flag } from "../types/flag.types";

interface DeleteFlagDialogProps {
  open: boolean;
  onClose: () => void;
  flag: Flag | null;
}

export function DeleteFlagDialog({ open, onClose, flag }: DeleteFlagDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteFlag(flag!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      toast.success("Flag deleted successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete flag");
    },
  });

  if (!flag) return null;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Feature Flag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{flag.name}</strong>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => mutate()}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
