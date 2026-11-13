export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface AuthContext  {
  ipAddress?: string;
  userAgent?: string;
}