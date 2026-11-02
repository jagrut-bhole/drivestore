import type { FastifyRequest, FastifyReply } from "fastify";
import { responseHandler } from "@/common/utils/responseHandler";

export const globalErrorHandler = (
  err: Error & {
    statusCode: number;
  },
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(err);

  if (reply.sent) {
    return;
  }

  const statusCode = err.statusCode ?? 500;

  const message = statusCode >= 500 ? "Internal Server Error" : err.message;

  return responseHandler.sendError(reply, statusCode, message);
};
