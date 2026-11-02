import type {
  FastifyRequest,
  FastifyReply
} from "fastify";

type ResponseHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>

export const asyncHandler = (fn: ResponseHandler) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await fn(request, reply);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Boom!! Its an Internal Server Error!!";
      reply.status(500).send({
        success: false,
        message: "Internal Server Error!!",
        error: message,
        data: null
      })
    }
  }
}