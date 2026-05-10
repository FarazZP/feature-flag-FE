import { cn } from "~/lib/utils";

type StatusVariant = "success" | "warning" | "destructive" | "info" | "default";

interface StatusBadgeProps {
  variant?: StatusVariant;
  label: string;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-success-50 text-success border-success-200",
  warning: "bg-warning-50 text-warning border-warning-200",
  destructive: "bg-destructive-50 text-destructive border-destructive-200",
  info: "bg-info-50 text-info border-info-200",
  default: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  variant = "default",
  label,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium text-xs",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
