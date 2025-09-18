export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export type JsonHeaders = Record<string, string>

export async function apiFetch<TResponse>(path: string, init?: RequestInit & { headers?: JsonHeaders }) {
  const url = path.startsWith('http') ? path : `${apiBaseUrl}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  let data: unknown = undefined
  try {
    data = text ? JSON.parse(text) : undefined
  } catch {
    // ignore JSON parse errors; leave data undefined
  }
  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (data as any)?.message || res.statusText || 'Request failed'
    throw new Error(message)
  }
  return data as TResponse
} 