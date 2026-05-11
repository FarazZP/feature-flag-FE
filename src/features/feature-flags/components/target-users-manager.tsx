import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { addTargetUser, removeTargetUser } from "../api/target-users";
import type { Flag } from "../types/flag.types";

interface TargetUsersManagerProps {
  flag: Flag;
}

export function TargetUsersManager({ flag }: TargetUsersManagerProps) {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");

  const addMutation = useMutation({
    mutationFn: (id: string) => addTargetUser(flag._id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      toast.success("Target user added");
      setUserId("");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add target user");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeTargetUser(flag._id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      toast.success("Target user removed");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to remove target user");
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="target-user-id">Add target user</Label>
          <Input
            id="target-user-id"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && userId.trim()) {
                addMutation.mutate(userId.trim());
              }
            }}
          />
        </div>
        <Button
          size="sm"
          disabled={!userId.trim() || addMutation.isPending}
          onClick={() => addMutation.mutate(userId.trim())}
        >
          {addMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="ml-1">Add</span>
        </Button>
      </div>

      {flag.enabledUsers.length > 0 ? (
        <ul className="space-y-1">
          {flag.enabledUsers.map((id) => (
            <li
              key={id}
              className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-1.5 text-sm"
            >
              <code className="text-xs">{id}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">No target users added yet.</p>
      )}
    </div>
  );
}
