export type AuditAction =
  | "FLAG_CREATED"
  | "FLAG_UPDATED"
  | "FLAG_DELETED"
  | "USER_TARGETED"
  | "USER_UNTARGETED"
  | "WORKSPACE_CREATED";

export interface AuditLog {
  _id: string;
  action: AuditAction;
  workspaceId: string;
  performedBy: {
    _id: string;
    name: string;
    email: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
