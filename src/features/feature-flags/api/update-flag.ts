import { apiFetch } from "~/lib/api/client";
import type { Flag } from "../types/flag.types";

interface UpdateFlagResponse {
  success: boolean;
  data: Flag;
}

interface UpdateFlagPayload {
  name?: string;
  description?: string;
  environments?: {
    development?: boolean;
    staging?: boolean;
    production?: boolean;
  };
}

export async function updateFlag(id: string, data: UpdateFlagPayload): Promise<Flag> {
  const response = await apiFetch<UpdateFlagResponse>(`/flags/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}
