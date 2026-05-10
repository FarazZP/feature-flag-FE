import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import { Button } from "~/components/ui/button";

export function NotFoundComponent() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  const handleGoHome = () => {
    router.navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-semibold text-4xl tracking-tight">404</h1>
        <h2 className="mt-2 font-medium text-xl">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={handleGoHome} variant="default">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
