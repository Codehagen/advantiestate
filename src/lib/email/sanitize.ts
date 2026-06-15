/**
 * Neutralize Discord-markdown metacharacters and newlines in a user-supplied
 * value before it is interpolated into embed markdown the team reads as trusted
 * (`**${k}:** ${v}`). Without this, a submitter can forge extra labelled lines,
 * masked links, or `@`-style noise inside a lead notification.
 *
 * Idempotent — safe to call on already-cleaned input. Shared by `discord.ts`
 * (the universal choke point for every lead source) and the per-form `clean()`
 * in `naringsmegler-lead.ts`.
 */
export function sanitizeDiscordValue(
  v: string | number | undefined | null,
  max = 500,
): string {
  return String(v ?? "")
    .replace(/[\r\n*_`~|[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max)
}
