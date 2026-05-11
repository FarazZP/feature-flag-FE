import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { updateFlag } from "../api/update-flag";
import { type UpdateFlagFormValues, updateFlagSchema } from "../models/flag.models";
import type { Flag } from "../types/flag.types";
import { EnvironmentToggle } from "./environment-toggle";

interface EditFlagSheetProps {
  open: boolean;
  onClose: () => void;
  flag: Flag | null;
}

export function EditFlagSheet({ open, onClose, flag }: EditFlagSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateFlagFormValues>({
    resolver: zodResolver(updateFlagSchema),
  });

  useEffect(() => {
    if (flag) {
      form.reset({
        name: flag.name,
        description: flag.description ?? "",
        environments: flag.environments,
      });
    }
  }, [flag, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateFlagFormValues) => updateFlag(flag!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      toast.success("Flag updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update flag");
    },
  });

  function onSubmit(values: UpdateFlagFormValues) {
    const payload: UpdateFlagFormValues = {
      name: values.name,
      ...(values.description ? { description: values.description } : {}),
      ...(values.environments ? { environments: values.environments } : {}),
    };
    mutate(payload);
  }

  const envs = ["development", "staging", "production"] as const;

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Feature Flag</SheetTitle>
          <SheetDescription>Update name, description, and environment toggles.</SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Input id="edit-description" {...form.register("description")} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="font-medium text-sm">Environments</Label>
            <div className="rounded-md border px-3 py-2">
              {envs.map((env) => (
                <EnvironmentToggle
                  key={env}
                  flag={flag!}
                  environment={env}
                  label={env.charAt(0).toUpperCase() + env.slice(1)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
