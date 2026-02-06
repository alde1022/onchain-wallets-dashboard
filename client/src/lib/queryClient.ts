import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getIdToken } from "@/hooks/use-auth";

const API_BASE = import.meta.env.VITE_API_URL || "";

async function getAuthHeaders(): Promise<HeadersInit> {
  try {
    const token = await getIdToken();
    if (!token) {
      return {};
    }
    return {
      "Authorization": `Bearer ${token}`,
    };
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return {};
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = url.startsWith("/") ? `${API_BASE}${url}` : url;
  const authHeaders = await getAuthHeaders();
  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...authHeaders,
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const fullUrl = url.startsWith("/") ? `${API_BASE}${url}` : url;
    const authHeaders = await getAuthHeaders();
    const res = await fetch(fullUrl, {
      headers: authHeaders,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
