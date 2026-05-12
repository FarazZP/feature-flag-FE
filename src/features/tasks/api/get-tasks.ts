import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "~/lib/api/client";
import type { Task } from "../types/task.types";

interface TasksResponse {
  success: boolean;
  data: Task[];
}

export const getTasksQueryOptions = (filters?: {
  status?: string;
  assigneeId?: string;
  parentId?: string;
}) =>
  queryOptions({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.assigneeId) params.set("assigneeId", filters.assigneeId);
      if (filters?.parentId !== undefined) params.set("parentId", filters.parentId);

      const qs = params.toString();
      const response = await apiFetch<TasksResponse>(`/tasks${qs ? `?${qs}` : ""}`);
      return response.data;
    },
    staleTime: 1000 * 30,
  });
