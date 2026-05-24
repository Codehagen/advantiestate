import { CTA, EditorialEmail, Eyebrow, H1, Lede, P } from "./_components"

/**
 * Drip #4 — sent ~14 days after signup.
 * Goal: convert warm subscriber to a booked conversation. Low pressure,
 * specific offer (uforpliktende markedsanalyse), short response window.
 */
export function SoftPitchEmail({ firstName }: { firstName?: string }) {
  const greeting = firstName ? `Hei ${firstName},` : "Hei,"
  return (
    <EditorialEmail preview="Skal vi ta en uforpliktende prat om eiendommen din?">
      <Eyebrow>En invitasjon</Eyebrow>
      <H1>
        Skal vi <span style={{ fontStyle: "italic", fontWeight: 300 }}>snakkes?</span>
      </H1>
      <Lede>
        Femten minutter på telefon. Du forteller om eiendommen din. Vi forteller
        hva vi ville gjort. Ingen oppfølgings-spam.
      </Lede>
      <P>{greeting}</P>
      <P>
        Du har vært med på listen et par uker nå. Jeg vil bare si — om du
        sitter med en eiendom du har lurt på, en portefølje du vurderer å
        endre, eller bare vil ha en oppdatering på markedet i ditt segment —
        send en mail tilbake, eller bestill en samtale direkte.
      </P>
      <P>
        Vi tar en uforpliktende markedsanalyse på en konkret eiendom innen to
        uker, helt uten kostnad. Det er ikke en salgsbom. Det er et inntak vi
        bruker for å bygge relasjoner med eiere vi kanskje jobber med først om
        to år.
      </P>
      <CTA
        href="https://www.advantiestate.no/kontakt"
        label="Bestill samtale"
      />
      <P>
        Eller bare svar på denne e-posten — den går rett til meg.
      </P>
      <P>
        Vennlig hilsen,
        <br />
        Christer Hagen
        <br />
        Partner · Advanti Estate
        <br />
        <a
          href="mailto:christer@advantiestate.no"
          style={{ color: "#57504a" }}
        >
          christer@advantiestate.no
        </a>
      </P>
    </EditorialEmail>
  )
}

export default SoftPitchEmail
