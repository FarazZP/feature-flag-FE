import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "~/lib/api/client";
import type { Workspace } from "../types/workspace.types";

interface WorkspaceResponse {
  success: boolean;
  data: Workspace;
}

export const getMyWorkspaceQueryOptions = () =>
  queryOptions({
    queryKey: ["workspace"],
    queryFn: async () => {
      try {
        const response = await apiFetch<WorkspaceResponse>("/workspace/me");
        return response.data;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
