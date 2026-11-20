export interface User {
  id: string,
  name: string,
  email: string,
  emailVerified: boolean,
  permissions: string[]
}

export interface LoginResponse {
  message: string,
  user: User
}