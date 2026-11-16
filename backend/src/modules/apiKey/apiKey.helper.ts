import { randomBytes, createHash } from "node:crypto";
import { API_KEY_CONFIG } from "./apiKey.constants";

export function generateApiKey() {
  const prefix = randomBytes(API_KEY_CONFIG.PREFIX_BYTES).toString("hex");

  const secret = randomBytes(API_KEY_CONFIG.RANDOM_BYTES).toString("hex");

  const key = `${API_KEY_CONFIG.PREFIX}_${prefix}_${secret}`;

  const keyHash = createHash("sha256").update(key).digest("hex");

  return {
    key,
    keyPrefix: prefix,
    keyHash,
  };
}
