import { prisma } from "@/lib/prisma";
import type { UpdateProfileInput } from "./users.schema";

type UpdateUserData = UpdateProfileInput & {
  emailVerified?: boolean
}

export async function getUserDetailsById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      status: true,
      createdAt: true,
      session: {
        where: {
          userId,
        },
        select: {
          ipAddress: true,
          userAgent: true,
          revokedAt: true,
          createdAt: true,
        },
      },
    },
  });
}

export const userRepository = {
  findById: async (userId: string) => {
    return prisma.user.findUnique({
      where: {
        id: userId 
      },
    });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  },

  updateProfile: async (userId: string, data: UpdateUserData) => {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        status: true,
        updatedAt: true,
      },
    });
  },
};
