import { prisma } from "@/lib/prisma";
import type { createInputApiKey } from "./apiKey.types";

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

  getApiKey: async (userId: string) => {
    return prisma.apiKeys.findMany({
      where: {
        userId,
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
};
