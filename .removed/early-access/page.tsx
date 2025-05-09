import EarlyAccessCta from "@/components/ui/EarlyAccessCta"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  title: "Få tidlig tilgang | Propdock",
  description:
    "Bli med i vår eksklusive tidlig tilgang og vær blant de første som får tilgang til Propdock - den intelligente plattformen for verdsettelse av næringseiendom.",
})

export default function EarlyAccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <EarlyAccessCta />
    </main>
  )
}
