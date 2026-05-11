import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "~/lib/api/client";
import type { Flag } from "../types/flag.types";

interface FlagsResponse {
  success: boolean;
  data: Flag[];
}

export const getFlagsQueryOptions = () =>
  queryOptions({
    queryKey: ["flags"],
    queryFn: async () => {
      const response = await apiFetch<FlagsResponse>("/flags");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
