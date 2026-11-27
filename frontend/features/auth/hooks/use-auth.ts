import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect } from 'next/navigation'

import { authApi } from "../api/auth.api";

export const AUTH_KEY = ["auth", "me"];

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: authApi.getMe,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: AUTH_KEY,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,

    onSuccess: async () => {
      queryClient.clear();

      redirect("/login");
    }
  })
}