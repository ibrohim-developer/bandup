/**
 * Server-side Strapi API helpers for route handlers.
 * Uses API token for full access.
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const COOKIE_NAME = 'strapi_jwt'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Auth helper for route handlers ──────────────────────────────────────────

export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match ? match[1] : null
}

export async function getUserFromToken(token: string): Promise<any | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function getAuthUser(request: Request): Promise<any | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null
  return getUserFromToken(token)
}

// ── Query string builder ────────────────────────────────────────────────────

function flattenParams(obj: any, prefix = ''): string[] {
  const parts: string[] = []
  if (Array.isArray(obj)) {
    obj.forEach((val, i) => {
      parts.push(...flattenParams(val, `${prefix}[${i}]`))
    })
  } else if (obj !== null && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      parts.push(...flattenParams(obj[key], prefix ? `${prefix}[${key}]` : key))
    }
  } else {
    parts.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(obj))}`)
  }
  return parts
}

function buildQuery(params: Record<string, any>): string {
  const parts = flattenParams(params)
  return parts.length ? '?' + parts.join('&') : ''
}

// ── Strapi REST helpers ─────────────────────────────────────────────────────

function getHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

function getAdminToken(): string {
  return process.env.STRAPI_API_TOKEN || ''
}

/** Find multiple entries */
export async function find(
  collection: string,
  params: Record<string, any> = {},
  token?: string,
): Promise<any[]> {
  // Default to large page size to get all results
  if (!params.pagination) {
    params.pagination = { pageSize: 1000 }
  }
  const url = `${STRAPI_URL}/api/${collection}${buildQuery(params)}`
  const res = await fetch(url, {
    headers: getHeaders(token || getAdminToken()),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) {
    console.error(`[strapi] find(${collection}) ${res.status}:`, JSON.stringify(json))
  }
  return json.data || []
}

/** Find one entry by documentId */
export async function findOne(
  collection: string,
  documentId: string,
  params: Record<string, any> = {},
  token?: string,
): Promise<any | null> {
  const url = `${STRAPI_URL}/api/${collection}/${documentId}${buildQuery(params)}`
  const res = await fetch(url, {
    headers: getHeaders(token || getAdminToken()),
    cache: 'no-store',
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.data || null
}

/** Create a new entry */
export async function create(
  collection: string,
  data: Record<string, any>,
  token?: string,
): Promise<any> {
  const url = `${STRAPI_URL}/api/${collection}`
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(token || getAdminToken()),
    body: JSON.stringify({ data }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.data
}

/** Update an entry by documentId */
export async function update(
  collection: string,
  documentId: string,
  data: Record<string, any>,
  token?: string,
): Promise<any> {
  const url = `${STRAPI_URL}/api/${collection}/${documentId}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(token || getAdminToken()),
    body: JSON.stringify({ data }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.data
}

/**
 * Find a test by slug, falling back to documentId.
 * Lets callers transition to slug-based URLs without breaking legacy id links.
 */
export async function findTestBySlugOrId(
  slugOrDocId: string,
  params: Record<string, any> = {},
): Promise<any | null> {
  if (!slugOrDocId) return null
  const bySlug = await find("tests", {
    ...params,
    filters: { ...(params.filters ?? {}), slug: { $eq: slugOrDocId } },
    pagination: { pageSize: 1 },
  })
  if (bySlug?.[0]) return bySlug[0]
  return findOne("tests", slugOrDocId, params)
}

/**
 * Resolve a test slug or documentId to its documentId.
 * Returns null if no matching test is found.
 * Accepts the legacy documentId path so callers can keep passing either.
 */
export async function resolveTestId(slugOrDocId: string): Promise<string | null> {
  if (!slugOrDocId) return null
  // Try slug first — cheaper than a full document fetch
  const bySlug = await find("tests", {
    filters: { slug: { $eq: slugOrDocId } },
    fields: ["documentId"],
    pagination: { pageSize: 1 },
  })
  if (bySlug?.[0]?.documentId) return bySlug[0].documentId
  // Fall back: assume it's already a documentId
  const direct = await findOne("tests", slugOrDocId, { fields: ["documentId"] })
  return direct?.documentId ?? null
}

export { STRAPI_URL, COOKIE_NAME }
