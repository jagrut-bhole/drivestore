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

  if (!isHealthy) {
    return ResponseHandler.sendError(
      reply,
      503,
      "There seems to be a problem with the server!",
    );
  }

  return ResponseHandler.sendSuccess(reply, 200, "Healthy server!", health);
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

// https://chatgpt.com/s/t_6af36bee1e008191abc564dafc3a1b9b