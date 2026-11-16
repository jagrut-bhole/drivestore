import type { CreateApiKeyInput } from "./apiKey.types";
import { apiKeyRepositery } from "./apiKey.repository";
import { API_KEY_CONFIG } from "./apiKey.constants";
import { generateApiKey } from "./apiKey.helper";

export const apiKeyService = {
  createApiKey: async (userId: string, input: CreateApiKeyInput) => {
    const existingKeys = await apiKeyRepositery.countActiveKeys(userId);

    if (existingKeys >= API_KEY_CONFIG.MAX_KEYS_PER_USER) {
      throw new Error("API_KEY_LIMIT_REACHED");
    }

    if (input.bucketId) {
      const bucket = await apiKeyRepositery.findBucketById(
        input.bucketId,
        userId,
      );

      if (!bucket) {
        throw new Error("BUCKET_NOT_FOUND");
      }
    }

    const generatedApiKey = generateApiKey();

    const apiKey = await apiKeyRepositery.createApiKey({
      userId,
      name: input.name,
      keyPrefix: generatedApiKey.keyPrefix,
      keyHash: generatedApiKey.keyHash,
      permissions: input.permission,
      bucketId: input.bucketId,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
    });
    
      return {
        ...apiKey,
        key: generatedApiKey.key,
      };
    
  },

  getApiKey: async (userId: string) => {
    return await apiKeyRepositery.getApiKey(userId);
  }
};
