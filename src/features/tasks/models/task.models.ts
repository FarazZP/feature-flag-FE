import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assigneeId: z.string().optional(),
  parentId: z.string().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export const editTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assigneeId: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

export type EditTaskFormValues = z.infer<typeof editTaskSchema>;
