import { apiFetch } from "~/lib/api/client";
import type { Task } from "../types/task.types";

interface UpdateTaskStatusResponse {
  success: boolean;
  data: Task;
}

export async function updateTaskStatus(id: string, status: string): Promise<Task> {
  const response = await apiFetch<UpdateTaskStatusResponse>(`/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
}
