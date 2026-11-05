import { apiClient } from "@/lib/apiClient";
import { LoginResponse, User } from "../types/auth.types";

export const authApi = {
  login: async (data: {
    email: string,
    password: string
  }) => {
    return apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    })
  },


  getMe: async (): Promise<User> => {
    return apiClient<User>("/auth/me", {
      method: "GET"
    })
  },

  logout: async () => {
    return apiClient<void>("/auth/logout", {
      method: "POST"
    })
  }
}

// https://chatgpt.com/s/t_6aeb80b238b08191b56892ccf6d0b608