import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "~/components/ui/button";

function isNetworkError(error: unknown): boolean {
  if (!navigator.onLine) return true;
  if (error instanceof TypeError && error.message.includes("fetch")) return true;
  if (error instanceof Error && error.message.includes("NetworkError")) return true;
  return false;
}

interface ErrorInfo {
  title: string;
  message: string;
  icon: React.ReactNode;
  showRetry: boolean;
  showHome: boolean;
}

function getErrorInfo(error: unknown): ErrorInfo {
  if (isNetworkError(error)) {
    return {
      title: "Connection Issue",
      message: "Unable to connect. Please check your internet connection and try again.",
      icon: <WifiOff className="h-12 w-12 text-amber-500" />,
      showRetry: true,
      showHome: true,
    };
  }

  return {
    title: "Something Went Wrong",
    message:
      error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    icon: <AlertCircle className="h-12 w-12 text-destructive" />,
    showRetry: true,
    showHome: true,
  };
}

export function DefaultErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const { reset: resetQueryErrors } = useQueryErrorResetBoundary();

  const errorInfo = getErrorInfo(error);

  const handleRetry = () => {
    resetQueryErrors();
    reset();
  };

  const handleGoHome = () => {
    resetQueryErrors();
    router.navigate({ to: "/" });
  };

  return (
    <div className="my-8 flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="flex items-center justify-center">{errorInfo.icon}</div>
        <h1 className="mt-6 font-semibold text-2xl tracking-tight">{errorInfo.title}</h1>
        <p className="mt-2 text-muted-foreground">{errorInfo.message}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {errorInfo.showRetry && (
            <Button onClick={handleRetry} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {errorInfo.showHome && (
            <Button onClick={handleGoHome} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
        </div>
        {import.meta.env.DEV && error instanceof Error && (
          <details className="mt-8 rounded-lg border bg-muted/50 p-4 text-left">
            <summary className="cursor-pointer font-medium text-sm">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap text-muted-foreground text-xs">
              {error.stack ?? error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
