import { apiFetch } from "~/lib/api/client";
import type { Workspace } from "../types/workspace.types";

interface CreateWorkspaceResponse {
  success: boolean;
  data: Workspace;
}

export async function createWorkspace(name: string): Promise<Workspace> {
  const response = await apiFetch<CreateWorkspaceResponse>("/workspace", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return response.data;
}
