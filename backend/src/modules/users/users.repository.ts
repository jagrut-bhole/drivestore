import { prisma } from "@/lib/prisma";

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
