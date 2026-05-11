import { z } from "zod";

export const createFlagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Key must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
});

export const updateFlagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  environments: z
    .object({
      development: z.boolean().optional(),
      staging: z.boolean().optional(),
      production: z.boolean().optional(),
    })
    .optional(),
});

export type CreateFlagFormValues = z.infer<typeof createFlagSchema>;
export type UpdateFlagFormValues = z.infer<typeof updateFlagSchema>;
