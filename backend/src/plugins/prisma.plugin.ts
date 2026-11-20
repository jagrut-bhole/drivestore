
import fp from "fastify-plugin";
import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";

const prismaPlugin = fp(async (app: FastifyInstance) => {

  await prisma.$connect();

  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}, {
  name: "prisma-plugin",
});

export default prismaPlugin;
