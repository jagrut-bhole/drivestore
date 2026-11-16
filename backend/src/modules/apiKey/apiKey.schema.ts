import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "API key name must be at least 3 characters")
    .max(50, "API key name cannot exceed 50 characters"),

  permission: z
    .array(z.enum(["READ", "WRITE", "DELETE"]))
    .min(1, "At least one permission is required")
    .refine(
      (permission) => new Set(permission).size === permission.length,
      "Duplicate permissions not allowed",
    ),

  bucketId: z.string().optional(),

  expiresAt: z
    .string()
    .optional()
    .refine(
      (value) => !value || new Date(value) > new Date(),
      "Expiration date must be in future",
    ),
});