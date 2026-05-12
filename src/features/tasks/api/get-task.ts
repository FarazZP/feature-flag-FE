import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "~/lib/api/client";
import type { Task } from "../types/task.types";

interface TaskResponse {
  success: boolean;
  data: Task;
}

export const getTaskQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const response = await apiFetch<TaskResponse>(`/tasks/${id}`);
      return response.data;
    },
    staleTime: 1000 * 30,
    enabled: !!id,
  });
