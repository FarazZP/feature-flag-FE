import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { createFlag } from "../api/create-flag";
import { type CreateFlagFormValues, createFlagSchema } from "../models/flag.models";

interface CreateFlagSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CreateFlagSheet({ open, onClose }: CreateFlagSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateFlagFormValues>({
    resolver: zodResolver(createFlagSchema),
    defaultValues: { name: "", key: "", description: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      toast.success("Feature flag created successfully");
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create flag");
    },
  });

  function onSubmit(values: CreateFlagFormValues) {
    mutate({
      name: values.name,
      key: values.key,
      ...(values.description ? { description: values.description } : {}),
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create Feature Flag</SheetTitle>
          <SheetDescription>Add a new feature flag to your workspace.</SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} placeholder="Dark Mode" />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Key</Label>
            <Input id="key" {...form.register("key")} placeholder="dark-mode" />
            {form.formState.errors.key && (
              <p className="text-destructive text-sm">{form.formState.errors.key.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              {...form.register("description")}
              placeholder="Enables dark mode across the app"
            />
            {form.formState.errors.description && (
              <p className="text-destructive text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Flag"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
