import { RouterProvider, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "~/components/ui/sonner";
import { createAppRouter } from "./router";

export function App() {
  const queryClient = useQueryClient();

  const [router] = useState(() => createAppRouter(queryClient));

  return (
    <>
      <RouterProvider
        context={{ queryClient }}
        router={router}
      />
      <Toaster richColors />
    </>
  );
}
