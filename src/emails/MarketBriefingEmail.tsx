import { CTA, EditorialEmail, Eyebrow, H1, Lede, P } from "./_components"

/**
 * Drip #2 — sent ~3 days after signup.
 * Goal: establish Advanti as a trustworthy data source, not just another
 * brokerage. Tone: informed, specific to Nord-Norge, no jargon walls.
 */
export function MarketBriefingEmail({ firstName }: { firstName?: string }) {
  const greeting = firstName ? `Hei ${firstName},` : "Hei,"
  return (
    <EditorialEmail preview="Hva vi ser i Nord-Norge akkurat nå — kort markedsbriefing fra Christer.">
      <Eyebrow>Markedsbriefing</Eyebrow>
      <H1>
        Hva vi ser <span style={{ fontStyle: "italic", fontWeight: 300 }}>akkurat nå.</span>
      </H1>
      <Lede>
        Tre observasjoner fra Nord-Norge-markedet — så du har konteksten neste
        gang noen spør hvor renten egentlig står.
      </Lede>
      <P>{greeting}</P>
      <P>
        <strong>1. Yield-toppen ligger sannsynligvis bak oss.</strong> Spreaden
        mellom prime yield og 5-års SWAP er tilbake til historisk sunne nivåer.
        For kontor i Bodø sentrum landet vi på prime ~6,5 % i Q4 — opp fra
        ~5,5 % i 2021, men nedover-trenden har stoppet.
      </P>
      <P>
        <strong>2. Tromsø-kontormarkedet er fortsatt stramt.</strong> 38 %
        leievekst siden 2021 i Tromsø sentrum gjør at noen av de gode dealene
        sitter på 4,5 %-yield som blir 6,5 % på ny leiekontrakt om 18 måneder.
        Det er der vi ser mest aktive kjøpere akkurat nå.
      </P>
      <P>
        <strong>3. Logistikk i Mo i Rana / Bodø havn fortsatt under pris.</strong>
        Industriutbygging og dagligvare-vekst driver etterspørselen videre. Hvis
        du har en logistikkeiendom du har vurdert å selge, er timing rimelig.
      </P>
      <P>
        Vi publiserer en full markedsrapport hvert kvartal med tallene bak
        observasjonene. Du kan se den siste her:
      </P>
      <CTA
        href="https://www.advantiestate.no/markedsinnsikt"
        label="Se markedsinnsikt"
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

export default MarketBriefingEmail
