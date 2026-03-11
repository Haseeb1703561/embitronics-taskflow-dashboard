import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(64, "Password cannot be longer than 64 characters.");

export const registerSchema = z.object({
  email: z.email("Please enter a valid email address.").transform((value) =>
    value.trim().toLowerCase(),
  ),
  password: passwordSchema,
});

export const loginSchema = registerSchema;
