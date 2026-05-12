import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Clock, AlertCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
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
import { cn } from "~/lib/utils";
import { getTaskQueryOptions } from "../api/get-task";
import { updateTaskStatus } from "../api/update-task-status";
import { deleteTask } from "../api/delete-task";
import { TASK_STATUSES, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS } from "../types/task.types";
import type { Task } from "../types/task.types";
import { TaskCard } from "./task-card";
import { CreateTaskSheet } from "./create-task-sheet";

interface TaskDetailSheetProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: () => void;
}

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  todo: Circle,
  in_progress: Clock,
  in_review: AlertCircle,
  blocked: AlertCircle,
  completed: CheckCircle2,
};

export function TaskDetailSheet({ open, onClose, task, onEdit }: TaskDetailSheetProps) {
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [subtaskOpen, setSubtaskOpen] = useState(false);

  const { data: fullTask, isLoading } = useQuery(
    getTaskQueryOptions(task?._id ?? ""),
  );

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Status updated");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
      setDeleteOpen(false);
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
    },
  });

  const currentTask = fullTask ?? task;
  if (!currentTask) return null;

  const StatusIcon = STATUS_ICONS[currentTask.status] || Circle;
  const subtasks = currentTask.subtasks ?? [];
  const currentStatusIdx = TASK_STATUSES.indexOf(currentTask.status);

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
        <SheetContent side="right" className="flex flex-col w-[450px] sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle className="text-lg">{currentTask.title}</SheetTitle>
            <SheetDescription>Task details and management.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex-1 space-y-6 overflow-y-auto">
            <div className="space-y-2">
              {currentTask.description && (
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="text-sm">{currentTask.description}</p>
                </div>
              )}

              <div className="flex gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Badge variant="secondary" className={cn("text-xs mt-0.5", STATUS_COLORS[currentTask.status])}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {STATUS_LABELS[currentTask.status]}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Priority</Label>
                  <p className="text-sm">{PRIORITY_LABELS[currentTask.priority]}</p>
                </div>
              </div>

              {currentTask.assigneeId && typeof currentTask.assigneeId === "object" && (
                <div>
                  <Label className="text-muted-foreground text-xs">Assignee</Label>
                  <p className="text-sm">{currentTask.assigneeId.name}</p>
                </div>
              )}

              {currentTask.createdById && typeof currentTask.createdById === "object" && (
                <div>
                  <Label className="text-muted-foreground text-xs">Created by</Label>
                  <p className="text-sm">{currentTask.createdById.name}</p>
                </div>
              )}

              <div className="flex gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Created</Label>
                  <p className="text-sm">{new Date(currentTask.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Updated</Label>
                  <p className="text-sm">{new Date(currentTask.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="font-medium text-sm">Update Status</Label>
              <div className="flex flex-wrap gap-2">
                {TASK_STATUSES.map((s) => {
                  const Icon = STATUS_ICONS[s];
                  const isCurrent = s === currentTask.status;
                  return (
                    <Button
                      key={s}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => statusMutation.mutate({ id: currentTask._id, status: s })}
                      disabled={statusMutation.isPending || isCurrent}
                    >
                      <Icon className="mr-1 h-3.5 w-3.5" />
                      {STATUS_LABELS[s]}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium text-sm">Subtasks ({subtasks.length})</Label>
                <Button variant="ghost" size="sm" onClick={() => setSubtaskOpen(true)}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : subtasks.length > 0 ? (
                <div className="space-y-2">
                  {subtasks.map((sub) => (
                    <TaskCard
                      key={sub._id}
                      task={sub}
                      onClick={() => {
                        queryClient.setQueryData(["tasks", currentTask._id], null);
                        setTimeout(() => onClose(), 50);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No subtasks yet.</p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onEdit}>
                <Pencil className="mr-1 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CreateTaskSheet
        open={subtaskOpen}
        onClose={() => setSubtaskOpen(false)}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task and all its subtasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(currentTask._id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
