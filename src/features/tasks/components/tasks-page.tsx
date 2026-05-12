import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useDisclosure } from "~/hooks/use-disclosure";
import { getTasksQueryOptions } from "../api/get-tasks";
import { TASK_STATUSES, STATUS_LABELS } from "../types/task.types";
import type { Task } from "../types/task.types";
import { TaskCard } from "./task-card";
import { CreateTaskSheet } from "./create-task-sheet";
import { TaskDetailSheet } from "./task-detail-sheet";
import { EditTaskSheet } from "./edit-task-sheet";

export function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>("_all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: tasks, isLoading } = useQuery(
    getTasksQueryOptions(statusFilter !== "_all" ? { status: statusFilter } : undefined),
  );

  const createDisclosure = useDisclosure();
  const detailDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();

  const selectedTask = tasks?.find((t) => t._id === selectedTaskId) ?? null;

  function handleViewTask(task: Task) {
    setSelectedTaskId(task._id);
    detailDisclosure.open();
  }

  function handleEditClick() {
    detailDisclosure.close();
    editDisclosure.open();
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tasks" description="Manage and track workspace tasks.">
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </PageHeader>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" description="Manage and track workspace tasks.">
        <Button onClick={createDisclosure.open}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </PageHeader>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Statuses</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {statusFilter !== "_all" && (
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter("_all")}>
            Clear
          </Button>
        )}
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={() => handleViewTask(task)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            {statusFilter ? "No tasks match this filter." : "No tasks yet. Create your first task to get started."}
          </p>
        </div>
      )}

      <CreateTaskSheet open={createDisclosure.isOpen} onClose={createDisclosure.close} />
      <TaskDetailSheet
        open={detailDisclosure.isOpen}
        onClose={detailDisclosure.close}
        task={selectedTask}
        onEdit={handleEditClick}
      />
      <EditTaskSheet
        open={editDisclosure.isOpen}
        onClose={editDisclosure.close}
        task={selectedTask}
      />
    </div>
  );
}
