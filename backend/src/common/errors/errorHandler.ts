import type { FastifyInstance } from "fastify";
import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCode";

export function registerErrorHandler(
  app: FastifyInstance
) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        message: error.message,
        error: {
          code: error.code
        },
        data: null
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      success: false,
      message: "Boom!! Its Internal Server Error",
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR
      },
      data: null
    })
  })
}