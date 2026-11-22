import type { FastifyInstance } from "fastify";
import driveRoutes from "./drive.routes";

export async function driveModule(app: FastifyInstance) {
  await app.register(driveRoutes);
}
