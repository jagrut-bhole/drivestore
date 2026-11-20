import {
  createHash,
  randomBytes
} from "node:crypto";

// generating cryptographic secure random token
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

// creates a SHA_256 hash of a token : used for session verification tokens
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}