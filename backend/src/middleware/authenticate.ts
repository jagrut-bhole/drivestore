import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { ResponseHandler } from "@/common/utils/responseHandler";
import { SESSION_COOKIE_NAME } from "@/common/constants/auth.constants";
import { hashToken } from "@/common/utils/crypto";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token = request.cookies[SESSION_COOKIE_NAME];

    if (!token) {
      return ResponseHandler.sendError(reply, 401, "Authentication Required!!");
    }

    const tokenHash = hashToken(token);

    const session = await prisma.session.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            email: true,
            emailVerified: true
          }
        }
      }
    });

    if (!session) {
      return ResponseHandler.sendError(reply, 401, "Session expired or revoked!!");
    }

    request.auth = {
      id: session?.user.id,
      email: session?.user.email,
      emailVerified: session?.user.emailVerified,
    };
  } catch (error: unknown) {
    request.log.error(error);
    return ResponseHandler.sendError(
      reply,
      401,
      "Unauthorized. Invalid or expired access token",
    );
  }
}
