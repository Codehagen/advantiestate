import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Singleton Supabase server client. Uses the service-role key — never expose
// this on the client. Reading the env lazily lets the rest of the app boot
// fine in CI / local-without-secrets; subscribe() handles the missing-env
// case gracefully and skips the lead-insert (Resend + Discord still fire).

let cached: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return null
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
