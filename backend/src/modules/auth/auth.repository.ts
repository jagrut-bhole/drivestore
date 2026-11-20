import { prisma } from "@/lib/prisma";
import type { CreateUserData, UpdateSessionData } from "./auth.types";

export const authRepositery = {
  createUserWithCredentials: async (data: CreateUserData) => {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          status: true,
          createdAt: true,
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credentials",
          providerAccountId: data.email,
          passwordHash: data.passwordHash,
        },
      });
      return user;
    });
  },

  findCredentialsAccount: async (email: string) => {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        status: true,
        accounts: {
          where: {
            providerId: "credentials",
          },
          select: {
            id: true,
            providerId: true,
            providerAccountId: true,
            passwordHash: true,
          },
        },
      },
    });
  },

  revokedSession: async (tokenHash: string) => {
    return prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  revokedAllSessions: async (userId: string) => {
    return prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  checkSession: async (token: string, date: Date) => {
    return prisma.session.findFirst({
      where: {
        tokenHash: token,
        revokedAt: null,
        expiresAt: {
          gt: date,
        },
      },
    });
  },

  updateSession: async (data: UpdateSessionData) => {
    return prisma.session.updateMany({
      where: {
        id: data.sessionCheck.id,
        tokenHash: data.currentHashToken,
        revokedAt: null,
        expiresAt: {
          gt: data.now,
        },
      },
      data: {
        tokenHash: data.newTokenHash,
        expiresAt: data.sessionExpiry,
        lastActivityAt: data.now,
      },
    });
  },
};
