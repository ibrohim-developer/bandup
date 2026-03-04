import { cookies } from 'next/headers';
import { strapiGet, strapiPost, strapiPut, strapiFetch, STRAPI_URL } from './client';

export { STRAPI_URL };

const COOKIE_NAME = 'strapi_jwt';

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function clearToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Authenticated server-side fetchers
export async function authGet<T>(endpoint: string) {
  const token = await getToken();
  return strapiGet<T>(endpoint, token);
}

export async function authPost<T>(endpoint: string, data: unknown) {
  const token = await getToken();
  return strapiPost<T>(endpoint, data, token);
}

export async function authPut<T>(endpoint: string, data: unknown) {
  const token = await getToken();
  return strapiPut<T>(endpoint, data, token);
}

// Admin-level fetcher using API token (replaces Supabase service role)
export async function adminFetch<T>(endpoint: string, options: RequestInit = {}) {
  const apiToken = process.env.STRAPI_API_TOKEN;
  return strapiFetch<T>(endpoint, options, apiToken);
}

export async function adminGet<T>(endpoint: string) {
  return adminFetch<T>(endpoint, { method: 'GET' });
}

export async function adminPost<T>(endpoint: string, data: unknown) {
  return adminFetch<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}
