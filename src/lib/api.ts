const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://hng-stage3-backend-production.up.railway.app';

/**
 * Server-side API helper that forwards cookies for authentication.
 * In Next.js App Router, we use this in Server Components and Route Handlers.
 */
export async function apiServer(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'X-API-Version': '1',
    ...((options.headers as Record<string, string>) || {}),
  };

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: 'no-store', // Always fetch fresh data
  });
}

/**
 * Client-side API helper that includes credentials (cookies) automatically.
 */
export async function apiClient(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'X-API-Version': '1',
    ...((options.headers as Record<string, string>) || {}),
  };

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
}

export { API_BASE };
