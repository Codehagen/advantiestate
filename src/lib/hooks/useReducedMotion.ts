import { useSyncExternalStore } from "react"

// SSR-safe `prefers-reduced-motion: reduce` subscription. The server snapshot
// returns `true` (motion reduced) so the first client paint never animates
// before hydration settles — charts then opt back into animation once the
// real media query resolves. Mirrors the local hook in
// analyseportal/charts/PortalCharts.tsx; shared here so the markedsinnsikt
// charts respect the same setting.
const MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(callback: () => void) {
  const mq = window.matchMedia(MOTION_QUERY)
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => true,
  )
}
