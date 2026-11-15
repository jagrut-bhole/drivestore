import type { FastifyRequest, FastifyReply } from "fastify";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { userPofile } from "./users.service";

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.auth?.id;

  if (!userId) {
    return ResponseHandler.sendError(reply, 400, "UserID not found!!");
  }

  try {
    const result = await userPofile({
      userId
    });

    return ResponseHandler.sendSuccess(reply, 200, "UserProfile Fetched successfully!!", result);
  } catch (error: unknown) {
    console.error(error);
  }
}
