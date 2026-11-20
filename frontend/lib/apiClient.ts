import { ApiError, ApiErrorResponse } from "@/utils/apiError";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API_URL is not conrfigured!!");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({}));

    throw new ApiError(
      errorData.message || "API request failed!!",
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
