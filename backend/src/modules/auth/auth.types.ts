import type { Session } from "@/generated/prisma/client";

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface AuthContext  {
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateSessionData {
  sessionCheck: Session,
  currentHashToken: string,
  now: Date,
  newTokenHash: string,
  sessionExpiry: Date
}