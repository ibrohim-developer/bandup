const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  error?: {
    status: number;
    name: string;
    message: string;
  };
}

interface StrapiItem<T> {
  id: number;
  documentId: string;
  attributes?: T;
  [key: string]: unknown;
}

export type StrapiData<T> = StrapiItem<T> & T;

export async function strapiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<StrapiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message || 'Strapi request failed');
  }

  return json;
}

export async function strapiGet<T>(
  endpoint: string,
  token?: string,
): Promise<StrapiResponse<T>> {
  return strapiFetch<T>(endpoint, { method: 'GET' }, token);
}

export async function strapiPost<T>(
  endpoint: string,
  data: unknown,
  token?: string,
): Promise<StrapiResponse<T>> {
  return strapiFetch<T>(
    endpoint,
    { method: 'POST', body: JSON.stringify({ data }) },
    token,
  );
}

export async function strapiPut<T>(
  endpoint: string,
  data: unknown,
  token?: string,
): Promise<StrapiResponse<T>> {
  return strapiFetch<T>(
    endpoint,
    { method: 'PUT', body: JSON.stringify({ data }) },
    token,
  );
}

export { STRAPI_URL };
