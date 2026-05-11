import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { updateFlag } from "../api/update-flag";
import type { Flag } from "../types/flag.types";

interface EnvironmentToggleProps {
  flag: Flag;
  environment: "development" | "staging" | "production";
  label: string;
}

export function EnvironmentToggle({ flag, environment, label }: EnvironmentToggleProps) {
  const queryClient = useQueryClient();
  const enabled = flag.environments[environment];

  const { mutate, isPending } = useMutation({
    mutationFn: (checked: boolean) =>
      updateFlag(flag._id, {
        environments: { [environment]: checked },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      toast.success(`${label} ${enabled ? "disabled" : "enabled"}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update");
    },
  });

  return (
    <div className="flex items-center justify-between py-1">
      <Label htmlFor={`${flag._id}-${environment}`} className="cursor-pointer text-sm">
        {label}
      </Label>
      <Switch
        id={`${flag._id}-${environment}`}
        checked={enabled}
        disabled={isPending}
        onCheckedChange={mutate}
      />
    </div>
  );
}
