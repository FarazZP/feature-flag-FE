import { StatusBadge } from "~/components/status-badge";
import type { AuditAction } from "../types/audit.types";

const actionConfig: Record<AuditAction, { label: string; variant: "success" | "warning" | "destructive" | "info" | "default" }> = {
  FLAG_CREATED: { label: "Flag Created", variant: "success" },
  FLAG_UPDATED: { label: "Flag Updated", variant: "info" },
  FLAG_DELETED: { label: "Flag Deleted", variant: "destructive" },
  USER_TARGETED: { label: "User Targeted", variant: "info" },
  USER_UNTARGETED: { label: "User Untargeted", variant: "warning" },
  WORKSPACE_CREATED: { label: "Workspace Created", variant: "success" },
};

interface ActionBadgeProps {
  action: AuditAction;
}

export function ActionBadge({ action }: ActionBadgeProps) {
  const config = actionConfig[action] ?? { label: action, variant: "default" as const };
  return <StatusBadge variant={config.variant} label={config.label} />;
}
