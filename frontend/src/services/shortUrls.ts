import { apiFetch } from './api'

export type CreateShortUrlRequest = {
  url: string
  validity?: number
  shortcode?: string
}

export type CreateShortUrlResponse = {
  shortLink: string
  expiry: string
}

export type ShortUrlStats = {
  shortcode: string
  originalUrl: string
  createdAt: string
  expiry: string
  totalClicks: number
  clicks: Array<{
    timestamp: string
    referer: string | null
    userAgent: string | null
    ip: string | null
    country: string | null
  }>
}

export function createShortUrl(body: CreateShortUrlRequest) {
  return apiFetch<CreateShortUrlResponse>('/shorturls', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getShortUrlStats(shortcode: string) {
  return apiFetch<ShortUrlStats>(`/shorturls/${encodeURIComponent(shortcode)}`)
} 