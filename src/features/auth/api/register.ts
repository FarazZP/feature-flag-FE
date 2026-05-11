import { apiFetch } from "~/lib/api/client";
import type { User } from "../types/auth.types";

interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export async function registerUser(name: string, email: string, password: string) {
  const response = await apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return response.data;
}
