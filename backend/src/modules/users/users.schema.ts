import { z } from "zod";
import { EMAIL_REGEX } from "../auth/auth.constants";

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(100).trim().optional(),

    email: z.string().regex(EMAIL_REGEX).toLowerCase().trim().optional(),

    phone: z.string().min(10).max(15).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required!!",
  });

export type UpdateProfileInput =z.infer<typeof updateProfileSchema>