import { generateToken, hashToken } from "@/common/utils/crypto";
import { SESSION_DURATION } from "@/common/constants/auth.constants";
import type { CreateSessionInput } from "./session.types";
import { createSessionForUser } from "./session.repository";

export async function createSession(
  input: CreateSessionInput
) {
  const token = generateToken();

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION * 1000
  );

  const session = await createSessionForUser(input, {
    tokenHash,
    expiresAt
  });

  return {
    session,
    token
  }
}