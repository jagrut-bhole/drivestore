import { z } from "zod";
import { EMAIL_REGEX } from "./auth.constants";

export const registerInputSchema = z.object({
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
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(EMAIL_REGEX)
    .max(254)
    .transform((email) => email.toLowerCase()),

  password: z.string().min(1, "Password is required").max(128),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

// Swagger API Schema!!

export const userSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    name: {
      type: "string",
      example: "Jagrut",
    },
    email: {
      type: "string",
      format: "email",
    },
    emailVerified: {
      type: "boolean",
      example: false,
    },
    status: {
      type: "string",
      example: "ACTIVE",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
  },
  required: [
    "id",
    "name",
    "email",
    "emailVerified",
    "status",
    "createdAt",
  ],
};

export const sessionSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    userId: {
      type: "string",
      format: "uuid",
    },
    expiresAt: {
      type: "string",
      format: "date-time",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "userId", "expiresAt", "createdAt"],
};