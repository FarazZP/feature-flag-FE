import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { Flag } from "../types/flag.types";
import { EnvironmentToggle } from "./environment-toggle";
import { TargetUsersManager } from "./target-users-manager";

interface FlagDetailSheetProps {
  open: boolean;
  onClose: () => void;
  flag: Flag | null;
  onEdit: () => void;
}

export function FlagDetailSheet({ open, onClose, flag, onEdit }: FlagDetailSheetProps) {
  if (!flag) return null;

  const envs = ["development", "staging", "production"] as const;

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{flag.name}</SheetTitle>
          <SheetDescription>Feature flag details and management.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <div>
              <Label className="text-muted-foreground text-xs">Key</Label>
              <p className="font-mono text-sm">{flag.key}</p>
            </div>
            {flag.description && (
              <div>
                <Label className="text-muted-foreground text-xs">Description</Label>
                <p className="text-sm">{flag.description}</p>
              </div>
            )}
            <div className="flex gap-6">
              <div>
                <Label className="text-muted-foreground text-xs">Created</Label>
                <p className="text-sm">{new Date(flag.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Updated</Label>
                <p className="text-sm">{new Date(flag.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="font-medium text-sm">Environments</Label>
            <div className="rounded-md border px-3 py-2">
              {envs.map((env) => (
                <EnvironmentToggle
                  key={env}
                  flag={flag}
                  environment={env}
                  label={env.charAt(0).toUpperCase() + env.slice(1)}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="font-medium text-sm">Target Users</Label>
            <TargetUsersManager flag={flag} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
