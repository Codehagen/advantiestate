import { Button } from "@/components/Button"
import { ArrowAnimated } from "@/components/ui/ArrowAnimated"
import Link from "next/link"
import { DatabaseLogo } from "../../public/DatabaseLogo"
import { siteConfig } from "./siteConfig"

// The recovery links below are not decoration. A 404 is where both people and
// crawlers lose the thread, and an agent that lands here needs somewhere to go
// next — the sitemap and llms.txt are the two entry points that let it re-orient
// without guessing URLs. The markdown representation of this page (served on
// Accept: text/markdown via /api/md) lists the same set.
const RECOVERY_LINKS: { href: string; label: string }[] = [
  { href: "/help", label: "Kunnskapssenter" },
  { href: "/eiendommer", label: "Eiendommer til salgs og leie" },
  { href: "/kontakt", label: "Kontakt oss" },
  { href: "/sitemap.xml", label: "Sidekart (alle sider)" },
  { href: "/llms.txt", label: "Nettstedsguide for AI-agenter" },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link href={siteConfig.baseLinks.home}>
        <DatabaseLogo className="mt-6 h-10" />
      </Link>
      <p className="text-warm-grey mt-6 text-4xl font-semibold sm:text-5xl">
        404
      </p>
      <h1 className="text-warm-grey mt-4 text-2xl font-semibold">
        Siden ble ikke funnet
      </h1>
      <p className="text-warm-grey-2 mt-2 text-sm">
        Beklager, vi kunne ikke finne siden du leter etter.
      </p>
      <Button asChild className="group mt-8">
        <Link href={siteConfig.baseLinks.home}>
          Gå til forsiden
          <ArrowAnimated
            className="text-warm-white"
            aria-hidden="true"
          />
        </Link>
      </Button>

      <nav aria-label="Kom videre" className="mt-12 w-full max-w-sm">
        <h2 className="text-warm-grey-2 text-xs font-semibold tracking-wide uppercase">
          Kom videre
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {RECOVERY_LINKS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-warm-grey hover:text-warm-grey-2 underline underline-offset-4 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
