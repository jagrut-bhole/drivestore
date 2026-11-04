import { prisma } from "@/lib/prisma";
import type { CreateUserData } from "./auth.types";
export async function createUserWithCredential(data: CreateUserData) {
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
}
export async function findCredentialsAccount(email: string) {
  return await prisma.user.findUnique({
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
          providerId: "credential",
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
}

export async function revokedSession(
  tokenHash: string
) {
  return await prisma.session.updateMany({
    where: {
      tokenHash,
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  })
}

export async function revokedAllSessions(
  userId: string
) {
  return await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    }, 
    data: {
      revokedAt: new Date()
    }
  })
}