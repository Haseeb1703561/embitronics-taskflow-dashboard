import { z } from "zod";

const optionalDescription = z
  .string()
  .trim()
  .max(300, "Description must be 300 characters or fewer.")
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required.")
    .max(80, "Project name must be 80 characters or fewer."),
  description: optionalDescription,
});

export const updateProjectSchema = createProjectSchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  {
    message: "At least one field is required.",
  },
);
