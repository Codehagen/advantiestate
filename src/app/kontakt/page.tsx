import EarlyAccessCta from "@/components/ui/EarlyAccessCta"
import { constructMetadata } from "@/lib/utils"
import { RiLinkedinBoxLine, RiMailLine, RiPhoneLine } from "@remixicon/react"

export const metadata = constructMetadata({
  title: "Kontakt oss | Propdock",
  description:
    "Ta kontakt med oss for å lære mer om hvordan Propdock kan hjelpe deg med verdsettelse og analyse av næringseiendom.",
})

export default function KontaktPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Early Access CTA Section at the top */}
      <div className="mt-12">
        <EarlyAccessCta />
      </div>

      {/* Contact Information Section */}
      <div className="mx-auto w-full max-w-6xl px-3 pb-32">
        <div className="mt-20 text-center">
          <h1 className="text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl dark:from-warm-white dark:to-warm-grey-1">
            Kontakt Propdock
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-warm-grey-2 dark:text-warm-grey-1">
            Ta gjerne direkte kontakt med meg for en uforpliktende prat om
            hvordan Propdock kan hjelpe deg med verdsettelse av næringseiendom.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
          <a
            href="tel:+4798453571"
            className="group flex items-center gap-3 rounded-lg bg-warm-grey/5 px-6 py-4 ring-1 ring-warm-grey/5 transition-colors hover:bg-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/5 dark:hover:bg-warm-grey/20"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
              <RiPhoneLine className="size-5 text-warm-grey dark:text-warm-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-warm-grey dark:text-warm-white">
                Ring direkte
              </p>
              <p className="text-warm-grey-2 dark:text-warm-grey-1">
                +47 984 53 571
              </p>
            </div>
          </a>

          <a
            href="mailto:christer@propdock.no"
            className="group flex items-center gap-3 rounded-lg bg-warm-grey/5 px-6 py-4 ring-1 ring-warm-grey/5 transition-colors hover:bg-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/5 dark:hover:bg-warm-grey/20"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
              <RiMailLine className="size-5 text-warm-grey dark:text-warm-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-warm-grey dark:text-warm-white">
                Send e-post
              </p>
              <p className="text-warm-grey-2 dark:text-warm-grey-1">
                christer@codenord.no
              </p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/christerhagen/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg bg-warm-grey/5 px-6 py-4 ring-1 ring-warm-grey/5 transition-colors hover:bg-warm-grey/10 dark:bg-warm-grey/10 dark:ring-warm-white/5 dark:hover:bg-warm-grey/20"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warm-grey/5 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5">
              <RiLinkedinBoxLine className="size-5 text-warm-grey dark:text-warm-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-warm-grey dark:text-warm-white">
                LinkedIn
              </p>
              <p className="text-warm-grey-2 dark:text-warm-grey-1">
                Christer Hagen
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
