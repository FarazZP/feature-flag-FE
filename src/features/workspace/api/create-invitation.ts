import { apiFetch } from "~/lib/api/client";
import type { Invitation } from "../types/workspace.types";

interface CreateInvitationResponse {
  success: boolean;
  data: Invitation;
}

export async function createInvitation(email: string, role: string): Promise<Invitation> {
  const response = await apiFetch<CreateInvitationResponse>("/invitations", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
  return response.data;
}
