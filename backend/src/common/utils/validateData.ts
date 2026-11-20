import { z } from "zod";
import type { FastifyReply } from "fastify";
import { ResponseHandler } from "./responseHandler";
import { ERROR_CODES } from "../errors/errorCode";

export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown,
  reply: FastifyReply
): z.infer<T> | null {
  const validation = schema.safeParse(data);

  if (!validation.success) {
    ResponseHandler.sendValidationError(reply, validation.error, ERROR_CODES.VALIDATION_ERROR);

    return null;
  }

  return validation.data;

}