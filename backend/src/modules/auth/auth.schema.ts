import { z } from "zod";
import { EMAIL_REGEX } from "./auth.constants";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain atleast 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .regex(EMAIL_REGEX)
    .trim()
    .max(254, "Email is too long")
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(2, "Password must contain at least 12 characters")
    .max(100, "Password cannot exceed 128 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(EMAIL_REGEX)
    .max(254)
    .transform((email) => email.toLowerCase()),

  password: z.string().min(1, "Password is required").max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;