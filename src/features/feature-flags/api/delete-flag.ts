import { apiFetch } from "~/lib/api/client";

interface DeleteFlagResponse {
  success: boolean;
  message: string;
}

export async function deleteFlag(id: string): Promise<void> {
  await apiFetch<DeleteFlagResponse>(`/flags/${id}`, {
    method: "DELETE",
  });
}
