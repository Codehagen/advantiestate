import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Get the onboarding completion status from cookies
  const hasCompletedOnboarding = request.cookies.get("onboarding-completed")

  // Only protect /propdock routes
  if (path.startsWith("/propdock")) {
    // If trying to access propdock without completing onboarding
    if (!hasCompletedOnboarding?.value) {
      return NextResponse.redirect(new URL("/onboarding/", request.url))
    }
  }

  // If trying to access onboarding after completion
  if (hasCompletedOnboarding?.value && path.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/propdock", request.url))
  }

  return NextResponse.next()
}

// Update matcher to only include /propdock and /onboarding routes
export const config = {
  matcher: ["/propdock/:path*", "/onboarding/:path*"],
}
