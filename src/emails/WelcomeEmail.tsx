import { CTA, EditorialEmail, Eyebrow, H1, Lede, P } from "./_components"

export function WelcomeEmail({ firstName }: { firstName?: string }) {
  const greeting = firstName ? `Hei ${firstName},` : "Hei,"
  return (
    <EditorialEmail preview="Velkommen til Advanti Estate — månedlig markedsinnsikt fra Nord-Norge.">
      <Eyebrow>Velkommen</Eyebrow>
      <H1>
        Takk for at du <span style={{ fontStyle: "italic", fontWeight: 300 }}>melder deg på.</span>
      </H1>
      <Lede>
        Én månedlig e-post med markedsdata, yield-bevegelser og kommentarer fra
        Nord-Norge. Ingen filler, ingen salgsbomber.
      </Lede>
      <P>{greeting}</P>
      <P>
        Du har nettopp meldt deg på Advanti Estate sitt månedlige nyhetsbrev. Det
        betyr at du om noen dager får en kort introduksjon til hvordan vi leser
        markedet, en gjennomgang av siste kvartals tall, og deretter én e-post
        i måneden med det vi tenker er mest interessant for eiendomsbesittere
        og investorer i Nord-Norge.
      </P>
      <P>
        Mens du venter — om du har en konkret eiendom eller portefølje du
        vurderer, snakk gjerne med oss. Vi tilbyr en uforpliktende
        markedsanalyse innen to uker.
      </P>
      <CTA
        href="https://www.advantiestate.no/kontakt"
        label="Bestill markedsanalyse"
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

export default WelcomeEmail
