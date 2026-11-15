import type { FastifyRequest, FastifyReply } from "fastify";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { validateData } from "@/common/utils/validateData";

export async function createApiKey(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.auth?.id;
  const emailStatus = request.auth?.emailVerified;
}