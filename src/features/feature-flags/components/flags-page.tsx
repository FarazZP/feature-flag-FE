import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Flag, Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useDisclosure } from "~/hooks/use-disclosure";
import { useAuthContext } from "~/features/auth/components/auth-provider";
import { getFlagsQueryOptions } from "../api/get-flags";
import type { Flag as FlagType } from "../types/flag.types";
import { CreateFlagSheet } from "./create-flag-sheet";
import { DeleteFlagDialog } from "./delete-flag-dialog";
import { EditFlagSheet } from "./edit-flag-sheet";
import { FlagDetailSheet } from "./flag-detail-sheet";
import { FlagsTable } from "./flags-table";

export function FlagsPage() {
  const { user } = useAuthContext();
  const { data: flags, isLoading, isError, error, refetch } = useQuery(getFlagsQueryOptions());
  const canCreate = user?.role !== "viewer";
  const userRole = user?.role;

  const [selectedFlag, setSelectedFlag] = useState<FlagType | null>(null);

  const createDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const detailDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  function handleEdit(flag: FlagType) {
    setSelectedFlag(flag);
    editDisclosure.open();
  }

  function handleViewDetail(flag: FlagType) {
    setSelectedFlag(flag);
    detailDisclosure.open();
  }

  function handleDelete(flag: FlagType) {
    setSelectedFlag(flag);
    deleteDisclosure.open();
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Feature Flags"
          description="Manage and control your feature flags across environments."
        >
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> New Flag
          </Button>
        </PageHeader>
        <div className="rounded-md border">
          <div className="p-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Feature Flags"
          description="Manage and control your feature flags across environments."
        >
          {canCreate && (
            <Button onClick={createDisclosure.open}>
              <Plus className="mr-2 h-4 w-4" /> New Flag
            </Button>
          )}
        </PageHeader>
        <Card>
          <CardHeader>
            <CardTitle>Failed to load flags</CardTitle>
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
      <PageHeader
        title="Feature Flags"
        description="Manage and control your feature flags across environments."
      >
        {canCreate && (
          <Button onClick={createDisclosure.open}>
            <Plus className="mr-2 h-4 w-4" /> New Flag
          </Button>
        )}
      </PageHeader>

      {flags && flags.length > 0 ? (
        <FlagsTable
          flags={flags}
          userRole={userRole}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
        />
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Flag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">No feature flags yet</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              {canCreate
                ? "Create your first feature flag to start managing rollouts."
                : "No flags have been created in this workspace yet."}
            </p>
            {canCreate && (
              <Button className="mt-6" onClick={createDisclosure.open}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Flag
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateFlagSheet open={createDisclosure.isOpen} onClose={createDisclosure.close} />
      <EditFlagSheet
        open={editDisclosure.isOpen}
        onClose={editDisclosure.close}
        flag={selectedFlag}
      />
      <FlagDetailSheet
        open={detailDisclosure.isOpen}
        onClose={detailDisclosure.close}
        flag={selectedFlag}
        onEdit={() => {
          detailDisclosure.close();
          editDisclosure.open();
        }}
      />
      <DeleteFlagDialog
        open={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.close}
        flag={selectedFlag}
      />
    </div>
  );
}
