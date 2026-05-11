import { apiFetch } from "~/lib/api/client";
import type { WorkspaceMember } from "../types/workspace.types";
import type { MemberRole } from "../types/workspace.types";

interface UpdateRoleResponse {
  success: boolean;
  data: WorkspaceMember;
}

export async function updateMemberRole(memberId: string, role: MemberRole): Promise<WorkspaceMember> {
  const response = await apiFetch<UpdateRoleResponse>(`/members/${memberId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
  return response.data;
}
