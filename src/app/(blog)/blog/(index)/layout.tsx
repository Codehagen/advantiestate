import type { ReactNode } from "react"

export default async function BlogLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
