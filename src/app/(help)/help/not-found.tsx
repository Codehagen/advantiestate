import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="font-display text-6xl font-bold">404</h1>
      <p className="text-2xl font-medium">
        Page not found. Back to{" "}
        <Link
          href="/help"
          className="text-gray-600 underline underline-offset-4 transition-colors hover:text-black"
        >
          Help Center
        </Link>
        .
      </p>
    </div>
  )
}
