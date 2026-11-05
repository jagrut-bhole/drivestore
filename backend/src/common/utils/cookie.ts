import type { FastifyReply } from "fastify";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_DURATION,
} from "@/common/constants/auth.constants";


// sets authentication cookie
export function setSessionCookie(
  reply: FastifyReply,
  token: string
): void {
  reply.setCookie(
    SESSION_COOKIE_NAME,
    token,
    {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: SESSION_DURATION
    }
  )
}


// clears authentication session cookie
export function clearSessionCookie(
  reply: FastifyReply
): void {
  reply.clearCookie(
    SESSION_COOKIE_NAME,
    SESSION_COOKIE_OPTIONS
  )
}