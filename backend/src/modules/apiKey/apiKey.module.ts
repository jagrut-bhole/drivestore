import type { FastifyInstance } from "fastify";
import apiKeyRoutes from "./apiKey.routes";

export async function apiKeyModule(app: FastifyInstance) {
  await app.register(apiKeyRoutes);
}