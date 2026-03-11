import { z } from "zod";

import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";

const optionalDescription = z
  .string()
  .trim()
  .max(500, "Description must be 500 characters or fewer.")
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

const optionalDueDate = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value) {
      return true;
    }

    return !Number.isNaN(new Date(value).valueOf());
  }, "Please enter a valid due date.")
  .transform((value) => value || undefined);

export const createTaskSchema = z.object({
  projectId: z.string().trim().min(1, "Project is required."),
  title: z
    .string()
    .trim()
    .min(1, "Task title is required.")
    .max(120, "Task title must be 120 characters or fewer."),
  description: optionalDescription,
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: optionalDueDate,
});

export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field is required.",
  });
