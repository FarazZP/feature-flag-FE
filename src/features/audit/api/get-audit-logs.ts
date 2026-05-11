import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "~/lib/api/client";
import type { AuditLog } from "../types/audit.types";

interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
}

export const getAuditLogsQueryOptions = () =>
  queryOptions({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const response = await apiFetch<AuditLogsResponse>("/audit");
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
