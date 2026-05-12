import { useQuery } from "@tanstack/react-query";
import { Building2, Plus, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { PageHeader } from "~/components/page-header";
import { Separator } from "~/components/ui/separator";
import { useDisclosure } from "~/hooks/use-disclosure";
import { useAuthContext } from "~/features/auth/components/auth-provider";
import { getMyWorkspaceQueryOptions } from "../api/get-my-workspace";
import { getMembersQueryOptions } from "../api/get-members";
import { AddMemberDialog } from "./add-member-dialog";
import { InviteMemberDialog } from "./invite-member-dialog";
import { AcceptInvitationDialog } from "./accept-invitation-dialog";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { WorkspaceSetupPrompt } from "./workspace-setup-prompt";
import { MemberList } from "./member-list";

export function WorkspaceSettingsPage() {
  const { user } = useAuthContext();
  const { data: workspace, isLoading, isError, error, refetch } = useQuery(getMyWorkspaceQueryOptions());
  const { data: members, isLoading: membersLoading } = useQuery(getMembersQueryOptions());

  const currentUserRole =
    members?.find((m) => {
      const userId = typeof m.userId === "object" ? m.userId._id : m.userId;
      return userId === user?._id;
    })?.role ?? null;
  const canManageMembers = currentUserRole === "owner" || currentUserRole === "admin";

  const createWorkspaceDisclosure = useDisclosure();
  const addMemberDisclosure = useDisclosure();
  const inviteMemberDisclosure = useDisclosure();
  const acceptInvitationDisclosure = useDisclosure();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Workspace Settings" description="Manage your workspace and team members." />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="space-y-6">
        <PageHeader title="Workspace Settings" description="Manage your workspace and team members." />

        <WorkspaceSetupPrompt
          onCreateWorkspace={createWorkspaceDisclosure.open}
          onAcceptInvitation={acceptInvitationDisclosure.open}
        />

        <CreateWorkspaceDialog
          open={createWorkspaceDisclosure.isOpen}
          onClose={createWorkspaceDisclosure.close}
        />
        <AcceptInvitationDialog
          open={acceptInvitationDisclosure.isOpen}
          onClose={acceptInvitationDisclosure.close}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Settings"
        description="Manage your workspace and team members."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            {workspace.name}
          </CardTitle>
          <CardDescription>
            Created {new Date(workspace.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Team Members</h3>
            <p className="text-muted-foreground text-sm">
              Invite colleagues or add members directly to collaborate.
            </p>
          </div>
          <div className="flex gap-2">
            {canManageMembers && (
              <>
                <Button variant="outline" size="sm" onClick={inviteMemberDisclosure.open}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
                <Button size="sm" onClick={addMemberDisclosure.open}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </>
            )}
          </div>
        </div>

        {membersLoading ? (
          <Card>
            <CardContent className="py-8">
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : members && members.length > 0 ? (
          <MemberList members={members} currentUserId={user?._id ?? ""} currentUserRole={currentUserRole} />
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">No members found.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AddMemberDialog open={addMemberDisclosure.isOpen} onClose={addMemberDisclosure.close} />
      <InviteMemberDialog open={inviteMemberDisclosure.isOpen} onClose={inviteMemberDisclosure.close} />
      <AcceptInvitationDialog open={acceptInvitationDisclosure.isOpen} onClose={acceptInvitationDisclosure.close} />
    </div>
  );
}
