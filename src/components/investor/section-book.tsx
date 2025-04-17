import { CalEmbed } from "@/components/cal-embed"
import Link from "next/link"

export function SectionBook() {
  return (
    <section className="relative w-full bg-warm-white py-24 text-warm-grey md:py-32 dark:bg-warm-grey dark:text-warm-white">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">12</span>
            <h2 className="text-xl font-medium tracking-tight">Book møte</h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        {/* Main headline - clear and direct */}
        <div className="mb-16 text-center">
          <h3 className="text-3xl font-medium leading-tight md:text-4xl">
            Interessert i å høre mer?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
            Book et møte med oss for å diskutere hvordan vi kan hjelpe deg
          </p>
        </div>

        <div className="flex h-[400px] flex-col items-center justify-center px-4 md:h-[600px] md:px-0">
          <CalEmbed calLink="propdock/30min" />
        </div>
      </div>
    </section>
  )
}
