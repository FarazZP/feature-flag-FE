import { apiFetch } from "~/lib/api/client";
import type { Flag } from "../types/flag.types";

interface TargetUserResponse {
  success: boolean;
  data: Flag;
}

export async function addTargetUser(flagId: string, userId: string): Promise<Flag> {
  const response = await apiFetch<TargetUserResponse>(`/flags/${flagId}/target-user`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  return response.data;
}

export async function removeTargetUser(flagId: string, userId: string): Promise<Flag> {
  const response = await apiFetch<TargetUserResponse>(`/flags/${flagId}/target-user/${userId}`, {
    method: "DELETE",
  });
  return response.data;
}
