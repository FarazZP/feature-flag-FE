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
import { updateTask } from "../api/update-task";
import { editTaskSchema, type EditTaskFormValues } from "../models/task.models";
import { TASK_PRIORITIES, PRIORITY_LABELS } from "../types/task.types";
import type { Task } from "../types/task.types";

interface EditTaskSheetProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

export function EditTaskSheet({ open, onClose, task }: EditTaskSheetProps) {
  const queryClient = useQueryClient();
  const { data: members } = useQuery(getMembersQueryOptions());
  const { data: allTasks } = useQuery(getTasksQueryOptions());

  const form = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    values: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",
      assigneeId: task?.assigneeId?._id ?? "",
      parentId: task?.parentId ?? null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Parameters<typeof updateTask>[1]) => updateTask(task!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    },
  });

  function onSubmit(values: EditTaskFormValues) {
    mutate({
      title: values.title,
      ...(values.description !== undefined ? { description: values.description } : {}),
      priority: values.priority,
      ...(values.assigneeId ? { assigneeId: values.assigneeId } : {}),
      parentId: values.parentId ?? null,
    });
  }

  const memberList = members ?? [];
  const filteredTasks = (allTasks ?? []).filter((t) => t._id !== task?._id);

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Update task details.</SheetDescription>
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
              value={form.watch("priority")}
              onValueChange={(v) => form.setValue("priority", v as any)}
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
              value={form.watch("assigneeId") || "_none"}
              onValueChange={(v) => form.setValue("assigneeId", v === "_none" ? "" : v)}
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
              value={form.watch("parentId") || "_none"}
              onValueChange={(v) => form.setValue("parentId", v === "_none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="No parent (root task)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">No parent</SelectItem>
                {filteredTasks.map((t) => (
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
