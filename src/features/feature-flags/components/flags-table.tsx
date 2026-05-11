import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "~/components/status-badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Flag } from "../types/flag.types";

interface FlagsTableProps {
  flags: Flag[];
  onEdit: (flag: Flag) => void;
  onDelete: (flag: Flag) => void;
  onViewDetail: (flag: Flag) => void;
}

function envStatus(enabled: boolean) {
  return enabled
    ? { variant: "success" as const, label: "ON" }
    : { variant: "default" as const, label: "OFF" };
}

export function FlagsTable({ flags, onEdit, onDelete, onViewDetail }: FlagsTableProps) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "key", label: "Key" },
    { key: "development", label: "Development" },
    { key: "staging", label: "Staging" },
    { key: "production", label: "Production" },
  ] as const;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.map((flag) => (
            <TableRow key={flag._id}>
              <TableCell className="font-medium">{flag.name}</TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{flag.key}</code>
              </TableCell>
              {columns.slice(2).map((col) => {
                const enabled = flag.environments[col.key as keyof typeof flag.environments];
                const status = envStatus(enabled);
                return (
                  <TableCell key={col.key}>
                    <StatusBadge variant={status.variant} label={status.label} />
                  </TableCell>
                );
              })}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetail(flag)}>
                      <Eye className="h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(flag)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(flag)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
