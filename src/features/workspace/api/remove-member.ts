import { apiFetch } from "~/lib/api/client";

interface RemoveMemberResponse {
  success: boolean;
  message: string;
}

export async function removeMember(memberId: string): Promise<void> {
  await apiFetch<RemoveMemberResponse>(`/members/${memberId}`, {
    method: "DELETE",
  });
}
