import { apiFetch } from "~/lib/api/client";
import type { Task } from "../types/task.types";

interface CreateTaskResponse {
  success: boolean;
  data: Task;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: string;
  assigneeId?: string;
  parentId?: string;
}

export async function createTask(data: CreateTaskPayload): Promise<Task> {
  const response = await apiFetch<CreateTaskResponse>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}
