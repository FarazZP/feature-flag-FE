import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url().optional(),
    VITE_APP_ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation: import.meta.env.DEV,
});

export type Env = typeof env;
