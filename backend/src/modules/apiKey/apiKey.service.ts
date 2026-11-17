import type { CreateApiKeyInput, UpdateApiKeyInput } from "./apiKey.types";
import { apiKeyRepositery } from "./apiKey.repository";
import { API_KEY_CONFIG } from "./apiKey.constants";
import { generateApiKey } from "./apiKey.helper";
import { Prisma } from "@/generated/prisma/client";

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

  getAllApiKey: async (userId: string) => {
    return await apiKeyRepositery.getAllApiKey(userId);
  },

  rotateApiKey: async (userId: string, apiId: string) => {
    const apiKey = await apiKeyRepositery.getApiDetailsById(userId, apiId);

    if (!apiKey) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    const newApiKey = generateApiKey();

    const apiKeyUpdate = await apiKeyRepositery.updateApiKey({
      userId,
      apiId,
      keyPrefix: newApiKey.keyPrefix,
      keyHash: newApiKey.keyHash,
    });

    return {
      ...apiKeyUpdate,
      key: newApiKey.key,
    };
  },

  deleteApiKey: async (userId: string, apiId: string) => {
    const deleteRequest = await apiKeyRepositery.deleteApiKey({
      userId,
      apiId,
    });

    if (deleteRequest.count === 0) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    return deleteRequest;
  },

  getDetailedApiInfo: async (userId: string, apiId: string) => {
    const result = await apiKeyRepositery.detailedApiInfo({
      userId,
      apiId,
    });

    if (!result) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    return result;
  },

  updateApiKey: async (
    userId: string,
    apiId: string,
    data: UpdateApiKeyInput,
  ) => {
    try {
      return await apiKeyRepositery.updateApiKeyInfo(userId, apiId, data);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("API_KEY_NOT_FOUND");
      }

      throw error;
    }
  },
};
