import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";

export async function helmetPlugin(app: FastifyInstance) {
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });
}
