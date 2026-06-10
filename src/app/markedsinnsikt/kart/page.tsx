import { MarkedsKartClient } from "@/components/markedsinnsikt/maps/MarkedsKartClient"
import { SubHero } from "@/components/site/SubHero"
import { constructMetadata } from "@/lib/utils"

export const metadata = constructMetadata({
  path: "/markedsinnsikt/kart",
  title: "Markedskart — indikative prissoner i Bodø | Advanti Estate",
  description:
    "Interaktivt kart over indikative leieprissoner for næringseiendom i Bodø. Slå på offisielle eiendomsgrenser fra Kartverket.",
})

export default function MarkedskartPage() {
  return (
    <>
      <SubHero
        crumb={[
          { label: "Markedsinnsikt", href: "/markedsinnsikt" },
          { label: "Markedskart" },
        ]}
        eyebrow="Markedskart · Bodø"
        title={
          <>
            Indikative leieprissoner for{" "}
            <span className="italic">næringseiendom i Bodø.</span>
          </>
        }
        lede="Kartet deler Bodø inn i indikative prissoner for næringslokaler, basert på Advantis egne transaksjons- og leiedata. Det gir et raskt bilde av hvor i byen leienivået ligger høyest — segmentert på kontor, handel og logistikk."
      >
        <p>
          Kontorleie varierer fra rundt 1 500 kr/m²/år i sekundære soner til
          2 000–3 500 kr/m²/år i sentrumskjernen, mens handel og logistikk stort
          sett ligger på 1 500–2 000 kr/m²/år. Slå på laget med offisielle
          eiendomsgrenser fra Kartverket for å se sonene mot faktiske
          matrikkelenheter. Tallene er indikative estimater og erstatter ikke en
          konkret verdivurdering.
        </p>
      </SubHero>

      <div className="pr-4">
        <MarkedsKartClient />
      </div>
    </>
  )
}
