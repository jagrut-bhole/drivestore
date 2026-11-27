import { prisma } from "@/lib/prisma";
import { DriveAccountStatus } from "@/generated/prisma/enums";
import type { DriveDetailsUpsertInput } from "./drive.types";

export const driveRepositery = {
  countDrivAccounts: async (userId: string) => {
    return prisma.driveAccount.count({
      where: {
        userId,
        status: {
          in: [
            DriveAccountStatus.ACTIVE,
            DriveAccountStatus.NEEDS_RECONNECT,
            DriveAccountStatus.DISCONNECT,
          ],
        },
      },
    });
  },

  findByGoogleSub: async (sub: string) => {
    return prisma.driveAccount.findFirst({
      where: {
        googleSub: sub,
      },
    });
  },

  driveDetailsUpsert: async (data: DriveDetailsUpsertInput) => {
    return prisma.driveAccount.upsert({
      where: {
        userId_googleSub: {
          userId: data.userId,
          googleSub: data.googleSub,
        },
      },
      create: {
        userId: data.userId,
        googleSub: data.googleSub,
        googleEmail: data.googleEmail,
        refreshTokenEnc: data.refreshToken,
        scopes: data.scopes,
        rootFolderId: data.folderId,
        quotaUsed: data.quotaUsed,
        quotaTotal: data.quotaTotal,
        lastCheckedAt: new Date(),
        status: data.status,
      },
      update: {
        googleSub: data.googleSub,
        googleEmail: data.googleEmail,
        refreshTokenEnc: data.refreshToken,
        scopes: data.scopes,
        rootFolderId: data.folderId,
        quotaUsed: data.quotaUsed,
        quotaTotal: data.quotaTotal,
        lastCheckedAt: new Date(),
        status: data.status,
      },
    });
  },

  getDriveAccount: async (userId: string, driveId: string) => {
    return prisma.driveAccount.findFirst({
      where: {
        id: driveId,
        userId,
      },
      select: {
        id: true,
        googleEmail: true,
        googleSub: true,
        status: true,
        scopes: true,
        rootFolderId: true,
        quotaTotal: true,
        quotaUsed: true,
        lastCheckedAt: true,
        createdAt: true,
      },
    });
  },

  getDriveAccountForSync: async (userId: string, driveId: string) => {
    return prisma.driveAccount.findFirst({
      where: {
        id: driveId,
        userId,
      },
    });
  },

  updateDriveQuota: async (data: {
    userId: string;
    driveId: string;
    quotaTotal: bigint | null;
    quotaUsed: bigint | null;
    lastCheckedAt: Date;
  }) => {
    return prisma.driveAccount.updateMany({
      where: {
        id: data.driveId,
        user: {
          id: data.userId
        },
        status: DriveAccountStatus.ACTIVE,
      },
      data: {
        quotaTotal: data.quotaTotal,
        quotaUsed: data.quotaUsed,
        lastCheckedAt: data.lastCheckedAt,
      },
    });
  },

  disconnectDriveAccount: async (userId: string, driveId: string) => {
    return prisma.driveAccount.updateMany({
      where: {
        id: driveId,
        userId,
        status: {
          not: DriveAccountStatus.DISCONNECT,
        },
      },
      data: {
        status: DriveAccountStatus.DISCONNECT,
        refreshTokenEnc: null,
        scopes: [],
      },
    });
  },

  findOwnedDriveAccount: async (userId: string, driveId: string) => {
    return prisma.driveAccount.findFirst({
      where: {
        id: driveId,
        user: {
          id: userId,
        },
      },
    });
  },
};
