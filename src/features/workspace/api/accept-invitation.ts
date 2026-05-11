import { apiFetch } from "~/lib/api/client";

interface AcceptInvitationResponse {
  success: boolean;
  message: string;
}

export async function acceptInvitation(token: string): Promise<void> {
  await apiFetch<AcceptInvitationResponse>("/invitations/accept", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
