"use client"

import ThemedImage from "./ThemedImage"

export default function HeroImage() {
  return (
    <section aria-label="Hero Image of the website" className="flow-root">
      <div className="bg-warm-white/40 ring-warm-grey-1/50 dark:bg-warm-grey/70 dark:ring-warm-white/10 rounded-2xl p-2 ring-1 ring-inset">
        <div className="bg-warm-white ring-warm-grey/5 dark:bg-warm-grey dark:ring-warm-white/15 rounded-xl ring-1">
          <ThemedImage
            lightSrc="/images/hero-light.webp"
            darkSrc="/images/hero-dark.webp"
            alt="A preview of the Database web app"
            width={2400}
            height={1600}
            className="dark:shadow-light-blue/10 rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
