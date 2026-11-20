import type { FastifyInstance } from "fastify";
import healthRoutes from "./health.routes";

export async function healthModule(app: FastifyInstance) {
  await app.register(healthRoutes);
}
