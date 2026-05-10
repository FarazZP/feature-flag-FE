import { apiFetch } from "~/lib/api/client";
import type { User } from "../types/auth.types";

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export async function loginUser(email: string, password: string) {
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response.data;
}
