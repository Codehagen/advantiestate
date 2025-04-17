import { Button } from "@/components/Button"
import { ArrowAnimated } from "@/components/ui/ArrowAnimated"
import Link from "next/link"
import { DatabaseLogo } from "../../public/DatabaseLogo"
import { siteConfig } from "./siteConfig"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Link href={siteConfig.baseLinks.home}>
        <DatabaseLogo className="mt-6 h-10" />
      </Link>
      <p className="text-warm-grey dark:text-warm-white mt-6 text-4xl font-semibold sm:text-5xl">
        404
      </p>
      <h1 className="text-warm-grey dark:text-warm-white mt-4 text-2xl font-semibold">
        Siden ble ikke funnet
      </h1>
      <p className="text-warm-grey-2 dark:text-warm-grey-1 mt-2 text-sm">
        Beklager, vi kunne ikke finne siden du leter etter.
      </p>
      <Button asChild className="group mt-8">
        <Link href={siteConfig.baseLinks.home}>
          Gå til forsiden
          <ArrowAnimated
            className="text-warm-white dark:text-warm-white"
            aria-hidden="true"
          />
        </Link>
      </Button>
    </div>
  )
}
