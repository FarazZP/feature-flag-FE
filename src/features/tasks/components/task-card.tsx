import { CheckCircle2, Circle, Clock, AlertCircle, GripVertical, ChevronRight } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { type Task, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS } from "../types/task.types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  todo: Circle,
  in_progress: Clock,
  in_review: AlertCircle,
  blocked: AlertCircle,
  completed: CheckCircle2,
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const Icon = STATUS_ICONS[task.status] || Circle;

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent/50"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4 shrink-0", {
              "text-slate-400": task.status === "todo",
              "text-blue-500": task.status === "in_progress",
              "text-yellow-500": task.status === "in_review",
              "text-red-500": task.status === "blocked",
              "text-green-500": task.status === "completed",
            })} />
            <span className={cn("font-medium truncate", {
              "line-through text-muted-foreground": task.status === "completed",
            })}>
              {task.title}
            </span>
          </div>
          {task.description && (
            <p className="mt-1 text-muted-foreground text-sm line-clamp-1 ml-6">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 ml-6">
            <Badge variant="secondary" className={cn("text-xs", STATUS_COLORS[task.status])}>
              {STATUS_LABELS[task.status]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {PRIORITY_LABELS[task.priority]}
            </Badge>
            {task.assigneeId && typeof task.assigneeId === "object" && (
              <span className="text-muted-foreground text-xs">
                {task.assigneeId.name}
              </span>
            )}
            {(task.subtaskCount ?? 0) > 0 && (
              <span className="text-muted-foreground text-xs flex items-center gap-0.5">
                <ChevronRight className="h-4 w-4" />
                {task.subtaskCount} subtask{task.subtaskCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </CardContent>
    </Card>
  );
}
