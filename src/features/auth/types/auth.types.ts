export type WorkspaceRole = "owner" | "admin" | "developer" | "viewer";

export interface User {
  _id: string;
  name: string;
  email: string;
  workspaceId?: string;
  role?: WorkspaceRole;
  createdAt: string;
  updatedAt: string;
}
