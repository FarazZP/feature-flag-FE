import { apiFetch } from "~/lib/api/client";

interface DeleteTaskResponse {
  success: boolean;
  data: null;
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<DeleteTaskResponse>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
