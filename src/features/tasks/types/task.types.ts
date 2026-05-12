export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "in_review" | "blocked" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  workspaceId: string;
  parentId?: string | null;
  flagId?: {
    _id: string;
    name: string;
    key: string;
  } | null;
  createdById: {
    _id: string;
    name: string;
    email: string;
  };
  subtaskCount?: number;
  subtasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export const TASK_STATUSES = ["todo", "in_progress", "in_review", "blocked", "completed"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  blocked: "Blocked",
  completed: "Completed",
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const STATUS_COLORS: Record<string, string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  in_review: "bg-yellow-100 text-yellow-700",
  blocked: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};
