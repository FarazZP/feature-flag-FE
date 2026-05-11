import { apiFetch } from "~/lib/api/client";
import type { WorkspaceMember } from "../types/workspace.types";

interface AddMemberResponse {
  success: boolean;
  data: WorkspaceMember;
}

export async function addMember(email: string): Promise<WorkspaceMember> {
  const response = await apiFetch<AddMemberResponse>("/members/add", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return response.data;
}
