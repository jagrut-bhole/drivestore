import type { FastifyInstance } from "fastify";
import userRoutes from "./users.routes";

export async function userModule(app: FastifyInstance) {
  await app.register(userRoutes);
}
