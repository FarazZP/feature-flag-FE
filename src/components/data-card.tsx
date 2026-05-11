import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface DataCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function DataCard({ title, icon, children, className, headerClassName }: DataCardProps) {
  return (
    <Card className={className}>
      <CardHeader className={cn("flex flex-row items-center gap-3", headerClassName)}>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
            {icon}
          </div>
        )}
        <CardTitle className="font-heading text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
