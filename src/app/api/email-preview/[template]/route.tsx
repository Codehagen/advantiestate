import { render } from "@react-email/render"
import { NextRequest } from "next/server"
import { WelcomeEmail } from "@/emails/WelcomeEmail"
import { MarketBriefingEmail } from "@/emails/MarketBriefingEmail"
import { SoftPitchEmail } from "@/emails/SoftPitchEmail"

// Dev-only preview surface — render each email template to HTML so Christer
// can paste it into Resend Broadcasts (until proper drip automation lands).
// Blocked outside dev to keep the templates off the public surface.

export const runtime = "nodejs"

const TEMPLATES = {
  welcome: WelcomeEmail,
  "market-briefing": MarketBriefingEmail,
  "soft-pitch": SoftPitchEmail,
} as const

type Slug = keyof typeof TEMPLATES

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ template: string }> },
) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not available in production.", { status: 404 })
  }

  const { template } = await params
  const Component = TEMPLATES[template as Slug]
  if (!Component) {
    return new Response(
      `Unknown template "${template}". Available: ${Object.keys(TEMPLATES).join(", ")}`,
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    )
  }

  const firstName = request.nextUrl.searchParams.get("firstName") || undefined
  const html = await render(Component({ firstName }))

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
