export function SectionStart() {
  return (
    <section className="relative w-full bg-warm-grey py-24 text-warm-white md:py-32">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with pitch context */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">01</span>
            <h2 className="text-xl font-medium tracking-tight">Propdock</h2>
          </div>
          <span className="text-warm-grey-2">Investor</span>
        </div>

        {/* Main content centered in the page */}
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <h1 className="text-5xl font-medium tracking-tight text-warm-white md:text-6xl lg:text-7xl">
            Propdock
          </h1>
          <p className="mt-6 max-w-xl text-center text-xl text-warm-grey-1">
            Verdsettelse og analyse av næringseiendom
          </p>
        </div>
      </div>
    </section>
  )
}
