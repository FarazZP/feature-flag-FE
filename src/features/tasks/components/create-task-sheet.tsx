import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getMembersQueryOptions } from "~/features/workspace/api/get-members";
import { getTasksQueryOptions } from "../api/get-tasks";
import { createTask } from "../api/create-task";
import { createTaskSchema, type CreateTaskFormValues } from "../models/task.models";
import { TASK_PRIORITIES, PRIORITY_LABELS } from "../types/task.types";

interface CreateTaskSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTaskSheet({ open, onClose }: CreateTaskSheetProps) {
  const queryClient = useQueryClient();
  const { data: members } = useQuery(getMembersQueryOptions());
  const { data: allTasks } = useQuery(getTasksQueryOptions());

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: "", description: "", assigneeId: "", parentId: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create task");
    },
  });

  function onSubmit(values: CreateTaskFormValues) {
    mutate({
      title: values.title,
      ...(values.description ? { description: values.description } : {}),
      ...(values.priority ? { priority: values.priority } : {}),
      ...(values.assigneeId ? { assigneeId: values.assigneeId } : {}),
      ...(values.parentId ? { parentId: values.parentId } : {}),
    });
  }

  const memberList = members ?? [];

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Create Task</SheetTitle>
          <SheetDescription>Add a new task to your workspace.</SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} placeholder="Task title" />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} placeholder="Optional description" rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              onValueChange={(v) => form.setValue("priority", v as any)}
              defaultValue={form.getValues("priority")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {TASK_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select
              onValueChange={(v) => form.setValue("assigneeId", v === "_none" ? "" : v)}
              defaultValue={form.getValues("assigneeId") || "_none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Unassigned</SelectItem>
                {memberList.map((m) => {
                  const user = typeof m.userId === "object" ? m.userId : null;
                  if (!user?._id) return null;
                  return (
                    <SelectItem key={m._id} value={user._id}>
                      {user.name ?? "Unknown"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Parent Task</Label>
            <Select
              onValueChange={(v) => form.setValue("parentId", v === "_none" ? "" : v)}
              defaultValue={form.getValues("parentId") || "_none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="No parent (root task)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">No parent</SelectItem>
                {(allTasks ?? []).map((t) => (
                  <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
