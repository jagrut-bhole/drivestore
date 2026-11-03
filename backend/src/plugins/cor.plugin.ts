import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: ["http:/localhost:3000"],
    credentials: true,
    maxAge: 600,
    exposedHeaders: ["Content-Length"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "x-requested-with",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
}
