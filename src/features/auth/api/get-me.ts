import { queryOptions } from "@tanstack/react-query";
import { apiFetch } from "~/lib/api/client";
import type { User } from "../types/auth.types";

interface MeResponse {
  success: boolean;
  data: User;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export const getMeQueryOptions = () =>
  queryOptions({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = getStoredToken();
      if (!token) return null;
      try {
        const response = await apiFetch<MeResponse>("/auth/me");
        return response.data;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
