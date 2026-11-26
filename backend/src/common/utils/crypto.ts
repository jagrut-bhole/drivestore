import { env } from "@/config/env";
import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHmac,
  timingSafeEqual,
} from "node:crypto";

// generating cryptographic secure random token
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

// creates a SHA_256 hash of a token : used for session verification tokens
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// google Crypto
const googleTokenKey = Buffer.from(env.TOKEN_ENC_KEY, "base64");
if (googleTokenKey.length !== 32) {
  throw new Error("TOKEN_ENC_KEY must be exactly 32 bytes (Base64 encoded)");
}

export function googleEncrypt(plain: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", googleTokenKey, iv);
  const enc = Buffer.concat([c.update(plain, "utf-8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64")).join(".");
}

export function googleDecrypt(payload: string): string {
  const parts = payload.split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error("Invalid encrypted Google token payload");
  }

  const [ivEncoded, tagEncoded, encryptedEncoded] = parts;

  if (!ivEncoded || !tagEncoded || !encryptedEncoded) {
    throw new Error("Invalid encrypted payload");
  }

  const iv = Buffer.from(ivEncoded, "base64");
  const authTag = Buffer.from(tagEncoded, "base64");
  const encrypted = Buffer.from(encryptedEncoded, "base64");

  if (iv.length !== 12 || authTag.length !== 16) {
    throw new Error("Invalid encrypted Google token format");
  }

  const decipher = createDecipheriv("aes-256-gcm", googleTokenKey, iv);

  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
}

export function signState(userId: string) {
  const body = Buffer.from(
    JSON.stringify({
      userId,
      exp: Date.now() + 10 * 60_000,
      n: randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");

  const signature = createHmac("sha256", env.G_DRIVE_OAUTH_STATE_SECRET)
    .update(body)
    .digest("base64url");

  return `${body}.${signature}`;
}

export function verifyState(state: string): { userId: string } | null {
  try {
    const parts = state.split(".");

    if (parts.length !== 2) return null;

    const [body, signature] = parts;

    if (!body || !signature) return null;

    const expected = createHmac("sha256", env.G_DRIVE_OAUTH_STATE_SECRET)
      .update(body)
      .digest("base64url");

    const a = Buffer.from(signature);
    const b = Buffer.from(expected);

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return null;
    }

    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));

    if (
      typeof data.userId !== "string" ||
      !data.userId ||
      typeof data.exp !== "number" ||
      data.exp <= Date.now()
    ) {
      return null;
    }

    return {
      userId: data.userId,
    };
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}
