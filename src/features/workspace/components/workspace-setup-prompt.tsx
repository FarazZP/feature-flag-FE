import { Building2, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface WorkspaceSetupPromptProps {
  onCreateWorkspace: () => void;
  onAcceptInvitation: () => void;
}

export function WorkspaceSetupPrompt({
  onCreateWorkspace,
  onAcceptInvitation,
}: WorkspaceSetupPromptProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <CardTitle>Welcome to FeatureFlag</CardTitle>
        <CardDescription>
          Set up your workspace to start managing feature flags and collaborating with your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button onClick={onCreateWorkspace} size="lg" className="w-full sm:w-auto">
          <Building2 className="mr-2 h-5 w-5" />
          Create Workspace
        </Button>
        <Button onClick={onAcceptInvitation} variant="outline" size="lg" className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-5 w-5" />
          Accept Invitation
        </Button>
      </CardContent>
    </Card>
  );
}
