import { useQuery } from "@tanstack/react-query";
import { Building2, Plus, UserPlus, Users } from "lucide-react";
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
import { StatusBadge } from "~/components/status-badge";
import { useDisclosure } from "~/hooks/use-disclosure";
import { getMyWorkspaceQueryOptions } from "../api/get-my-workspace";
import { AddMemberDialog } from "./add-member-dialog";
import { InviteMemberDialog } from "./invite-member-dialog";
import { AcceptInvitationDialog } from "./accept-invitation-dialog";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { WorkspaceSetupPrompt } from "./workspace-setup-prompt";

export function WorkspaceSettingsPage() {
  const { data: workspace, isLoading, isError, error, refetch } = useQuery(getMyWorkspaceQueryOptions());

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
            <Button variant="outline" size="sm" onClick={inviteMemberDisclosure.open}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
            <Button size="sm" onClick={addMemberDisclosure.open}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="mt-3 font-medium">Member list coming soon</h4>
            <p className="mt-1 text-muted-foreground text-sm text-center max-w-sm">
              A list endpoint is needed to display workspace members. For now, use the buttons above to add or invite members.
            </p>
            <div className="flex gap-2 mt-4">
              <StatusBadge variant="info" label="API pending" />
            </div>
          </CardContent>
        </Card>
      </div>

      <AddMemberDialog open={addMemberDisclosure.isOpen} onClose={addMemberDisclosure.close} />
      <InviteMemberDialog open={inviteMemberDisclosure.isOpen} onClose={inviteMemberDisclosure.close} />
      <AcceptInvitationDialog open={acceptInvitationDisclosure.isOpen} onClose={acceptInvitationDisclosure.close} />
    </div>
  );
}
