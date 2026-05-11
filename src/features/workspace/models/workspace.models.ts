import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  role: z.enum(["admin", "developer", "viewer"]),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
export type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;
