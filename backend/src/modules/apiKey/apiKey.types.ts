import { z } from "zod";
import { createApiKeySchema } from "./apiKey.schema";
import type { ApiKeyPermission } from "@/generated/prisma/enums";

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

export interface createInputApiKey {
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  permissions: ApiKeyPermission[];
  bucketId?: string;
  expiresAt?: Date;
}
