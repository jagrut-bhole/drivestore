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
          googleSub: data.googleSub
        }
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
        status: data.status
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
        status: data.status
      }
    })
  }
};
