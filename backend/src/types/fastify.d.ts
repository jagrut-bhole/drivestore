import "fastify";
import type { PrismaClient } from "@/generated/prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {
    auth: {
      id: string;
      email: string;
      emailVerified: boolean
    } | null;
  }
}
