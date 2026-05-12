import { apiFetch } from "~/lib/api/client";
import type { Task } from "../types/task.types";

interface UpdateTaskResponse {
  success: boolean;
  data: Task;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: string;
  assigneeId?: string;
  status?: string;
  parentId?: string | null;
}

export async function updateTask(id: string, data: UpdateTaskPayload): Promise<Task> {
  const response = await apiFetch<UpdateTaskResponse>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}
