import { DriveAccountStatus } from "@/generated/prisma/enums";
import { DRIVE_SCOPES } from "@/lib/google";
import { z } from "zod";

export const driveCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  state: z.string().min(1, "State is required"),
  userId: z.string().min(1),
});

export const driveDetailsUpsertSchema = z.object({
  userId: z.uuid(),
  googleSub: z.string().min(1),
  googleEmail: z.email(),
  refreshToken: z.string().min(1),
  scopes: z.array(z.enum(DRIVE_SCOPES)),
  folderId: z.string().min(1),
  quotaUsed: z.bigint().nullable(),
  quotaTotal: z.bigint().nullable(),
  status: z.enum(DriveAccountStatus),
});

export const driveIdParamsSchema = z.object({
  driveId: z.uuid(),
});