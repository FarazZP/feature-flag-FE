import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { History } from "lucide-react";
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
import { getAuditLogsQueryOptions } from "../api/get-audit-logs";
import { AuditLogTable } from "./audit-log-table";

export function AuditLogsPage() {
  const { data: logs, isLoading, isError, error, refetch } = useQuery(getAuditLogsQueryOptions());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Log" description="Track all changes made to feature flags in your workspace." />
        <div className="rounded-md border">
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Audit Log" description="Track all changes made to feature flags in your workspace." />
        <Card>
          <CardHeader>
            <CardTitle>Failed to load audit logs</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "An unexpected error occurred."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
            <Link to="/dashboard">
              <Button variant="ghost">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="Track all changes made to feature flags in your workspace." />

      {logs && logs.length > 0 ? (
        <AuditLogTable logs={logs} />
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">No audit entries yet</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Activity from creating and managing feature flags will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
