import { prisma } from "@/lib/prisma";
import type { CreateSessionInput } from "./session.types";

export async function createSessionForUser(
  data: CreateSessionInput,
  calData: {
    tokenHash: string,
    expiresAt: Date
  }
) {
  return await prisma.session.create({
    data: {
      userId: data.userId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      tokenHash: calData.tokenHash,
      expiresAt: calData.expiresAt
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      createdAt: true
    }
  });
}