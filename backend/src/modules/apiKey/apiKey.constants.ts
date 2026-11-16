export const API_KEY_CONFIG = {
  PREFIX: "ds",
  MAX_KEYS_PER_USER: 10,
  RANDOM_BYTES: 32,
  PREFIX_BYTES: 4,
} as const;

export const API_KEY_MESSAGES = {
  CREATED: "API key created successfully",
  LIMIT_REACHED: "Maximum API key limit reached",
  BUCKET_NOT_FOUND: "Bucket not found",
} as const;
