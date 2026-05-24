import { CTA, EditorialEmail, Eyebrow, H1, Lede, P } from "./_components"

/**
 * Drip #3 — sent ~7 days after signup.
 * Goal: trust signal via a concrete deal. Uses the Corponor case study by
 * default — swap in fresher case as portfolio grows.
 */
export function CaseStudyEmail({ firstName }: { firstName?: string }) {
  const greeting = firstName ? `Hei ${firstName},` : "Hei,"
  return (
    <EditorialEmail preview="Hvordan vi sikret optimalt salg for et av Corponors utviklingsprosjekter.">
      <Eyebrow>Kundehistorie</Eyebrow>
      <H1>
        Et konkret <span style={{ fontStyle: "italic", fontWeight: 300 }}>eksempel.</span>
      </H1>
      <Lede>
        Hvordan en strukturert salgsprosess på et utviklingsprosjekt i Bodø
        landet en bedre pris enn alle først trodde var realistisk.
      </Lede>
      <P>{greeting}</P>
      <P>
        Corponor hadde et utviklingsprosjekt i Bodø som hadde stått åpent en
        stund. Tre potensielle kjøpere hadde gått fra forhandlinger året før.
        Vi gjorde tre ting annerledes:
      </P>
      <P>
        <strong>Først — vi tok rapporteringen tilbake til null.</strong>
        Sjekklisten på eiendommen var ikke komplett. Reguleringsstatus,
        leiekontrakter, vedlikeholdslogg, energiklassifisering — alt manglet
        en autoritativ versjon. Vi brukte to uker på å samle og verifisere.
      </P>
      <P>
        <strong>Så — vi snevret kjøperuniverset.</strong> I stedet for å gå
        bredt med markedsføring til 30 mulige kjøpere, identifiserte vi 6 som
        hadde reell kapital, reelt mandat, og reelt tidsvindu. Halvparten av
        dem hadde aldri vurdert eiendommen før, men passet profilen.
      </P>
      <P>
        <strong>Til slutt — vi strukturerte budrunden.</strong> Tre runder med
        klare frister, transparente konkurranseregler. Salgsprisen ble 17 %
        høyere enn første megler hadde indikert, og vi lukket på 4,5 måneder
        fra mandat til oppgjør.
      </P>
      <P>
        Det er den samme prosessen vi kjører på alle mandater, justert for
        eiendomstype og marked. Hele caset ligger her hvis du vil se tallene:
      </P>
      <CTA
        href="https://www.advantiestate.no/kunder/corponor"
        label="Les kundehistorien"
      />
      <P>
        Vennlig hilsen,
        <br />
        Christer Hagen
        <br />
        Partner · Advanti Estate
      </P>
    </EditorialEmail>
  )
}

export default CaseStudyEmail
