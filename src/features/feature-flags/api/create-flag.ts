import { apiFetch } from "~/lib/api/client";
import type { Flag } from "../types/flag.types";

interface CreateFlagResponse {
  success: boolean;
  data: Flag;
}

interface CreateFlagPayload {
  name: string;
  key: string;
  description?: string;
}

export async function createFlag(data: CreateFlagPayload): Promise<Flag> {
  const response = await apiFetch<CreateFlagResponse>("/flags", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}
