import "server-only"
import { headers } from "next/headers"

/**
 * Best-effort, per-instance sliding-window rate limiter for the public
 * lead-capture surfaces. In-memory by design: Vercel Fluid Compute reuses
 * function instances across requests, so this meaningfully blunts bursts
 * from a single IP, but it is NOT a hard guarantee (multiple instances =
 * multiple windows). Platform-level enforcement (Vercel WAF rate-limit
 * rule) is the ops-side complement — see plans/001 maintenance notes.
 */
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
const MAX_KEYS = 10_000

const buckets = new Map<string, number[]>()

export async function checkRateLimit(scope: string): Promise<boolean> {
  const h = await headers()
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0]!.trim()
  const key = `${scope}:${ip}`
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (hits.length >= MAX_PER_WINDOW) {
    buckets.set(key, hits)
    return false
  }
  hits.push(now)
  // Crude memory bound: reset the map rather than tracking LRU.
  if (!buckets.has(key) && buckets.size >= MAX_KEYS) buckets.clear()
  buckets.set(key, hits)
  return true
}
