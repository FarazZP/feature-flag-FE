import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "~/lib/api/client";
import type { WorkspaceMember } from "../types/workspace.types";

interface MembersResponse {
  success: boolean;
  data: WorkspaceMember[];
}

export const getMembersQueryOptions = () =>
  queryOptions({
    queryKey: ["workspace", "members"],
    queryFn: async () => {
      const response = await apiFetch<MembersResponse>("/members");
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
