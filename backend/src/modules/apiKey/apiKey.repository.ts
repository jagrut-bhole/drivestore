import { prisma } from "@/lib/prisma";

export const apiKeyRepositery = {
  findById: (userId: string) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },
};
