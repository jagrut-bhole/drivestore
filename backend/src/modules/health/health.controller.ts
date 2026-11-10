import type { FastifyReply, FastifyRequest } from "fastify";
import { checkReadiness } from "./health.service";
import { ResponseHandler } from "@/common/utils/responseHandler";

export async function getLiveness(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  };
  return ResponseHandler.sendSuccess(reply, 200, "Healthy!!", data);
}

export async function getReadiness(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const health = await checkReadiness();

  const isHealthy = health.status === "healthy";

  return ResponseHandler.sendSuccess(
    reply,
    isHealthy ? 200 : 503,
    isHealthy
      ? "Healthy Server!!"
      : "There seems somethingh problem with the server!!",
    health,
  );
}

export async function getHealth(request: FastifyRequest, reply: FastifyReply) {
  const health = await checkReadiness();

  const isHealthy = health.status === "healthy";

  return ResponseHandler.sendSuccess(
    reply,
    isHealthy ? 200 : 503,
    isHealthy ? "Healthy" : "UnHealthy",
    health,
  );
}
