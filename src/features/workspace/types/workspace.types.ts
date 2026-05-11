export interface Workspace {
  _id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  _id: string;
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "developer" | "viewer";
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  _id: string;
  email: string;
  workspaceId: string;
  invitedBy: string;
  role: "admin" | "developer" | "viewer";
  token: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: string;
  createdAt: string;
}
