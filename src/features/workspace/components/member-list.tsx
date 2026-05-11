import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, Shield, Trash2 } from "lucide-react";
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
import { StatusBadge } from "~/components/status-badge";
import { updateMemberRole } from "../api/update-member-role";
import { removeMember } from "../api/remove-member";
import type { WorkspaceMember, MemberRole } from "../types/workspace.types";

interface MemberListProps {
  members: WorkspaceMember[];
  currentUserId: string;
}

function getUserInfo(member: WorkspaceMember) {
  if (typeof member.userId === "object") {
    return { name: member.userId.name, email: member.userId.email, id: member.userId._id };
  }
  return { name: "Unknown", email: "", id: member.userId };
}

function roleBadge(role: string) {
  switch (role) {
    case "owner":
      return { variant: "info" as const, label: "Owner" };
    case "admin":
      return { variant: "warning" as const, label: "Admin" };
    case "developer":
      return { variant: "success" as const, label: "Developer" };
    case "viewer":
      return { variant: "default" as const, label: "Viewer" };
    default:
      return { variant: "default" as const, label: role };
  }
}

export function MemberList({ members, currentUserId }: MemberListProps) {
  const queryClient = useQueryClient();

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: MemberRole }) => updateMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "members"] });
      toast.success("Role updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "members"] });
      toast.success("Member removed successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to remove member");
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const user = getUserInfo(member);
            const badge = roleBadge(member.role);
            const isMe = user.id === currentUserId;
            const isOwner = member.role === "owner";

            return (
              <TableRow key={member._id}>
                <TableCell className="font-medium">
                  {user.name}
                  {isMe && (
                    <span className="ml-2 text-muted-foreground text-xs">(you)</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <StatusBadge variant={badge.variant} label={badge.label} />
                </TableCell>
                <TableCell>
                  {!isMe && !isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            roleMutation.mutate({
                              id: member._id,
                              role: member.role === "admin" ? "developer" : "admin",
                            })
                          }
                        >
                          <Shield className="h-4 w-4" />
                          {member.role === "admin" ? "Demote to Developer" : "Promote to Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => removeMutation.mutate(member._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
