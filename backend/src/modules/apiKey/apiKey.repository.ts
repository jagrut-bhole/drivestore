import { prisma } from "@/lib/prisma";
import type { createInputApiKey, UpdateApiKeyInput } from "./apiKey.types";

export const apiKeyRepositery = {
  countActiveKeys: async (userId: string) => {
    return prisma.apiKeys.count({
      where: {
        userId,
        isActive: true,
        revokedAt: null,
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    });
  },

  findBucketById: async (bucketId: string, userId: string) => {
    return prisma.bucket.findFirst({
      where: {
        id: bucketId,
        userId,
      },
      select: {
        id: true,
      },
    });
  },

  createApiKey: async (data: createInputApiKey) => {
    return prisma.apiKeys.create({
      data: {
        userId: data.userId,
        name: data.name,
        keyPrefix: data.keyPrefix,
        keyHash: data.keyHash,
        permissions: data.permissions,
        bucketId: data.bucketId ?? null,
        expiresAt: data.expiresAt ?? null,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        bucketId: true,
        expiresAt: true,
        createdAt: true,
      },
    });
  },

  getAllApiKey: async (userId: string) => {
    return prisma.apiKeys.findMany({
      where: {
        userId,
        revokedAt: null
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        revokedAt: true,
        lastUsedAt: true,
        updatedAt: true,
        createdAt: true,
        bucket: {
          select: {
            name: true,
            driveAccount: {
              select: {
                googleEmail: true,
              },
            },
          },
        },
      },
    });
  },

  getApiDetailsById: async (userId: string, id: string) => {
    return await prisma.apiKeys.findUnique({
      where: {
        userId,
        id,
      },
      select: {
        id: true,
        keyPrefix: true,
        keyHash: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  },

  updateApiKey: async (data: {
    userId: string;
    apiId: string;
    keyPrefix: string;
    keyHash: string;
  }) => {
    return prisma.apiKeys.update({
      where: {
        id: data.apiId,
        userId: data.userId,
      },
      data: {
        keyPrefix: data.keyPrefix,
        keyHash: data.keyHash,
      },
    });
  },

  deleteApiKey: async (data: { userId: string; apiId: string }) => {
    return prisma.apiKeys.updateMany({
      where: {
        id: data.apiId,
        userId: data.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  detailedApiInfo: async (data: { userId: string; apiId: string }) => {
    return await prisma.apiKeys.findFirst({
      where: {
        id: data.apiId,
        userId: data.userId,
        revokedAt: null,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        expiresAt: true,
        permissions: true,
        createdAt: true,
        bucket: {
          select: {
            id: true,
            name: true,
            driveFolderId: true,
            driveAccount: {
              select: {
                id: true,
                googleEmail: true,
                status: true,
                quotaTotal: true,
                quotaUsed: true,
                lastCheckedAt: true,
              },
            },
          },
        },
      },
    });
  },

  updateApiKeyInfo: async (
    userId: string,
    apiId: string,
    data: UpdateApiKeyInput,
  ) => {
    return await prisma.apiKeys.update({
      where: {
        id: apiId,
        userId: userId,
        revokedAt: null,
      },
      data,
      select: {
        id: true,
        name: true,
        permissions: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        keyPrefix: true,
        createdAt: true,
      },
    });
  },
};
