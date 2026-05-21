import { MarkedsKartClient } from "@/components/markedsinnsikt/maps/MarkedsKartClient"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  title: "Markedskart — indikative prissoner i Bodø | Advanti",
  description:
    "Interaktivt kart over indikative leieprissoner for næringseiendom i Bodø. Slå på offisielle eiendomsgrenser fra Kartverket.",
})

export default function MarkedskartPage() {
  return (
    <div className="pr-4 pt-32">
      <MarkedsKartClient />
    </div>
  )
}
