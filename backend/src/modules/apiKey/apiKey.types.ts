import { z } from "zod";
import { createApiKeySchema } from "./apiKey.schema";
import type { ApiKeyPermission } from "@/generated/prisma/enums";
import { updateApiSchema } from "./apiKey.schema";

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyInput = z.infer<typeof updateApiSchema>;

export interface createInputApiKey {
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  permissions: ApiKeyPermission[];
  bucketId?: string;
  expiresAt?: Date;
}
