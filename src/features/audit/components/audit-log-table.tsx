import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ActionBadge } from "./action-badge";
import type { AuditLog } from "../types/audit.types";

interface AuditLogTableProps {
  logs: AuditLog[];
}

function formatMetadata(log: AuditLog): string {
  if (!log.metadata) return "—";
  const { flagId, key, userId } = log.metadata as Record<string, string>;
  const parts: string[] = [];
  if (key) parts.push(`Key: ${key}`);
  if (flagId) parts.push(`Flag ID: ${flagId}`);
  if (userId) parts.push(`User ID: ${userId}`);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id}>
              <TableCell>
                <ActionBadge action={log.action} />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{log.performedBy.name}</p>
                  <p className="text-muted-foreground text-xs">{log.performedBy.email}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-[300px] truncate text-sm">
                {formatMetadata(log)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {formatDate(log.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
