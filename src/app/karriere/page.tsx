import { CtaStrip } from "@/components/site/CtaStrip";
import { Faq } from "@/components/site/Faq";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const metadata = constructMetadata({
  path: "/karriere",
  title: "Karriere hos Advanti Estate | Bli næringsmegler i Nord-Norge",
  description:
    "Vi lyser sjelden ut — men leter alltid. Advanti Estate ansetter når vi møter riktig person, og ønsker å vokse i Mo i Rana, Narvik og Harstad. Send en åpen søknad.",
});

export default function KarrierePage() {
  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Karriere" }]}
        eyebrow="Karriere · Bli en av oss"
        title={
          <>
            Vi lyser sjelden ut — <br />
            <span className="italic">men leter alltid.</span>
          </>
        }
        lede="Akkurat nå har vi ingen utlyste stillinger. Men vi ansetter når vi møter riktig person — ikke for å fylle en stol — så vi er alltid på utkikk. Vi vil særlig gjerne bli kjent med folk i Mo i Rana, Narvik og Harstad, der vi ønsker å vokse."
        actions={[
          { label: "Send åpen søknad", href: "/kontakt", variant: "dark" },
          { label: "Se hvor vi vil vokse", href: "#steder", variant: "outline" },
        ]}
        metaRow={[
          { value: "Løpende", label: "Vi leter hele året" },
          { value: "3 nye byer", label: "Mo i Rana · Narvik · Harstad" },
          { value: "Ansvar", label: "Fra dag én" },
        ]}
        photo={{
          src: "/building/pexels-expect-best-79873-351262.jpg",
          alt: "Kontor hos Advanti Estate",
        }}
      />

      {/* 01 — HVORFOR ADVANTI */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Hvorfor Advanti</span>
            <div>
              <h2>
                Et lite hus <span className="italic">med store oppdrag.</span>
              </h2>
              <p>
                Vi er ikke et meglerhus med titalls juniorrådgivere. Hos oss er
                du ikke en ressurs i en stab — du er en av få som faktisk fører
                oppdragene. Det former hvordan vi jobber, og hvem vi ser etter.
              </p>
            </div>
          </div>

          <div className="principles">
            <div className="principle">
              <div className="pre">I.</div>
              <h3>Eierskap fra dag én</h3>
              <p>
                Ingen lang opplæring på sidelinjen. Du får egne oppdrag tidlig,
                med en erfaren partner ved siden — ikke over deg. Du møter
                klienten selv, hele veien fra første samtale til signering.
              </p>
            </div>
            <div className="principle">
              <div className="pre">II.</div>
              <h3>Data i ryggraden</h3>
              <p>
                Vi bygger egne databaser og lar tallene ha siste ord. Liker du å
                jobbe analytisk — verdivurdering, DCF, markedsdata — finner du et
                fagmiljø som tar metode på alvor.
              </p>
            </div>
            <div className="principle">
              <div className="pre">III.</div>
              <h3>Lokal forankring</h3>
              <p>
                Vi bor i Nord-Norge og kjenner markedet vi jobber i. Dette er
                ikke en satellitt — det er hovedscenen. Du blir kjent med
                aktørene, byene og eiendommene på ordentlig.
              </p>
            </div>
            <div className="principle">
              <div className="pre">IV.</div>
              <h3>Lange relasjoner</h3>
              <p>
                En stor andel av nye oppdrag kommer fra eksisterende relasjoner.
                Vi måler oss på tillit over tid — ikke på volum. Det krever folk
                som mener det de sier, og leverer på det.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — HVERDAGEN */}
      <section
        className="section"
        style={{
          background: "var(--accent-faint)",
          borderTop: "var(--hairline)",
          borderBottom: "var(--hairline)",
        }}
      >
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">02 — Hverdagen</span>
            <div>
              <h2>
                Hvordan det er <span className="italic">å jobbe her.</span>
              </h2>
              <p>
                Korte avstander, høyt under taket og reelle oppdrag på bordet fra
                starten. Vi tror på reelt ansvar, ryddige prosesser og tid til å
                gjøre arbeidet skikkelig.
              </p>
            </div>
          </div>

          <div className="tc" style={{ marginTop: 8 }}>
            <div>
              <h4>Tett på arbeidet</h4>
              <p>
                Du sitter sammen med dem som tar beslutningene. Fagdiskusjoner
                skjer over pulten, ikke i et ticket-system. Når du står fast, er
                en partner to meter unna — og når du lykkes, ser hele huset det.
              </p>
              <p>
                Vi takker nei til oppdrag vi ikke har kapasitet til å gjøre godt.
                Det betyr at du sjelden jobber med noe halvveis — og at
                kvaliteten på det du leverer faktisk betyr noe for huset.
              </p>
            </div>
            <div>
              <h4>Rom for fag</h4>
              <p>
                Vi investerer i analyseverktøy, kursing og fagsamlinger. Vil du
                fordype deg i verdivurdering, transaksjonsjus eller markedsdata,
                så legger vi til rette — det gjør oss bedre som hus.
              </p>
              <p>
                Fleksibel hverdag, to kontorer å velge mellom, og
                konkurransedyktige betingelser med resultatdeling. Men det
                viktigste er ærlig talt oppdragene — de er gode, og de er dine.
              </p>
            </div>
          </div>

          <div className="culture-split">
            <div className="culture-photo">
              <Image
                src="/building/pexels-abshky-18566965.jpg"
                alt="Næringsbygg i Nord-Norge"
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="culture-photo">
              <Image
                src="/building/pexels-abshky-18567185.jpg"
                alt="Kontorlandskap"
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 03 — HVOR VI VIL VOKSE */}
      <section className="section" id="steder">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">03 — Hvor vi vil vokse</span>
            <div>
              <h2>
                Vi utvider <span className="italic">i Nord-Norge.</span>
              </h2>
              <p>
                Vi har kontor i Bodø og Alta, men markedet vårt er hele
                landsdelen. Nå ønsker vi å bli sterkere lokalt — og ser særlig
                etter folk med forankring i disse byene.
              </p>
            </div>
          </div>

          <div className="places">
            <div className="place">
              <div className="pn">Sted _01</div>
              <h3>Mo i Rana</h3>
              <div className="reg">Helgeland</div>
              <p>
                Industri, logistikk og et voksende næringsliv. Vi vil ha en lokal
                stemme på Helgeland.
              </p>
            </div>
            <div className="place">
              <div className="pn">Sted _02</div>
              <h3>Narvik</h3>
              <div className="reg">Ofoten</div>
              <p>
                Transport, lager og næringspark i sterk utvikling. Kjenner du
                markedet her, vil vi snakke med deg.
              </p>
            </div>
            <div className="place">
              <div className="pn">Sted _03</div>
              <h3>Harstad</h3>
              <div className="reg">Sør-Troms</div>
              <p>
                Et solid og variert næringsmarked. Vi søker noen som kan bygge
                Advanti videre i regionen.
              </p>
            </div>
          </div>

          <p className="places-note">
            Vi er også åpne for dyktige folk i <strong>Bodø</strong>,{" "}
            <strong>Alta</strong> og <strong>Tromsø</strong> — og andre steder
            der vi har oppdrag. Bor du i Nord-Norge og kjenner ditt lokale
            marked, vil vi gjerne høre fra deg.
          </p>
        </div>
      </section>

      {/* 04 — ROLLER VI SER ETTER */}
      <section className="section section-divider" id="roller">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">04 — Roller vi ser etter</span>
            <div>
              <h2>
                Det vi alltid <span className="italic">er åpne for.</span>
              </h2>
              <p>
                Vi har ingen utlyste stillinger akkurat nå, men dette er rollene
                vi jevnlig søker etter. Kjenner du deg igjen, send en åpen
                søknad — så tar vi praten når det passer for begge.
              </p>
            </div>
          </div>

          <div className="jobs">
            <details className="job">
              <summary>
                <div className="j-title">
                  <span className="num">Rolle _01</span>Næringsmegler
                </div>
                <div className="j-cell">
                  <span className="k">Sted</span>
                  <span className="v">Der du bor</span>
                </div>
                <div className="j-cell">
                  <span className="k">Opptak</span>
                  <span className="v">Løpende</span>
                </div>
                <span className="j-plus">+</span>
              </summary>
              <div className="j-body">
                <div>
                  <p>
                    Vi vil gjerne snakke med næringsmeglere som vil føre egne
                    salgs- og utleieoppdrag i markedet for næringseiendom i
                    Nord-Norge. Du jobber tett med partnerne, men eier dine egne
                    prosesser — fra første verdivurdering til signert kontrakt.
                  </p>
                  <p>
                    Rollen passer deg som er relasjonssterk, strukturert og trygg
                    i forhandlinger. Erfaring fra eiendom, finans eller salg er
                    en fordel, men vi vekter holdning og vurderingsevne høyere
                    enn fartstid.
                  </p>
                  <Link href="/kontakt" className="btn btn-dark j-apply">
                    Send åpen søknad <span className="arrow">→</span>
                  </Link>
                </div>
                <div>
                  <h4>Vi ser etter</h4>
                  <ul>
                    <li>
                      Relevant utdanning eller erfaring fra eiendom, finans eller
                      salg
                    </li>
                    <li>Sterke relasjons- og forhandlingsegenskaper</li>
                    <li>
                      Strukturert arbeidsform og god forretningsforståelse
                    </li>
                    <li>Lokal forankring i Nord-Norge er en fordel</li>
                    <li>Førerkort klasse B</li>
                  </ul>
                </div>
              </div>
            </details>

            <details className="job">
              <summary>
                <div className="j-title">
                  <span className="num">Rolle _02</span>Analytiker ·
                  Verdivurdering
                </div>
                <div className="j-cell">
                  <span className="k">Sted</span>
                  <span className="v">Bodø</span>
                </div>
                <div className="j-cell">
                  <span className="k">Opptak</span>
                  <span className="v">Løpende</span>
                </div>
                <span className="j-plus">+</span>
              </summary>
              <div className="j-body">
                <div>
                  <p>
                    Vil du jobbe med tallene som ligger bak hvert oppdrag? Som
                    analytiker bygger du verdivurderinger, DCF-modeller og
                    markedsanalyser som danner beslutningsgrunnlaget for klientene
                    våre — og holder vår egen markedsdatabase skarp.
                  </p>
                  <p>
                    Du blir en sentral del av fagmiljøet og jobber tett med
                    partnerne på de mest krevende vurderingene. Dette er en rolle
                    for deg som trives med metode, presisjon og å gjøre
                    kompleksitet forståelig.
                  </p>
                  <Link href="/kontakt" className="btn btn-dark j-apply">
                    Send åpen søknad <span className="arrow">→</span>
                  </Link>
                </div>
                <div>
                  <h4>Vi ser etter</h4>
                  <ul>
                    <li>
                      Høyere utdanning innen økonomi, finans eller tilsvarende
                    </li>
                    <li>
                      Solid modelleringskompetanse — DCF, sensitivitet, scenarier
                    </li>
                    <li>
                      Erfaring med verdivurdering eller transaksjonsanalyse
                    </li>
                    <li>Strukturert, nøyaktig og selvstendig arbeidsform</li>
                    <li>Evne til å formidle tall klart, skriftlig og muntlig</li>
                  </ul>
                </div>
              </div>
            </details>

            <details className="job">
              <summary>
                <div className="j-title">
                  <span className="num">Rolle _03</span>Studenter &amp;
                  praktikanter
                </div>
                <div className="j-cell">
                  <span className="k">Sted</span>
                  <span className="v">Bodø / Alta</span>
                </div>
                <div className="j-cell">
                  <span className="k">Opptak</span>
                  <span className="v">Løpende</span>
                </div>
                <span className="j-plus">+</span>
              </summary>
              <div className="j-body">
                <div>
                  <p>
                    Er du student innen økonomi, eiendom eller finans? Vi tar
                    gjerne imot praktikanter og deltidshjelp som vil jobbe side om
                    side med analyseteamet på reelle oppdrag — markedsdata,
                    verdivurdering og oppdragsstøtte.
                  </p>
                  <p>
                    Fordi vi er små, får selv de yngste reelt ansvar og tett
                    oppfølging. Mange holder kontakten med oss etter studiene — og
                    noen kommer tilbake i fast rolle.
                  </p>
                  <Link href="/kontakt" className="btn btn-dark j-apply">
                    Send åpen søknad <span className="arrow">→</span>
                  </Link>
                </div>
                <div>
                  <h4>Vi ser etter</h4>
                  <ul>
                    <li>
                      Student på bachelor- eller masternivå innen relevant fag
                    </li>
                    <li>
                      Gode analytiske evner og nysgjerrighet på eiendomsmarkedet
                    </li>
                    <li>Stødig i Excel — modellering er et pluss</li>
                    <li>Forankring i Nord-Norge er en fordel</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* 05 — PROSESSEN */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">05 — Prosessen</span>
            <div>
              <h2>
                Slik går <span className="italic">en søknad.</span>
              </h2>
              <p>
                Ryddig, rask og respektfull. Du møter menneskene du faktisk skal
                jobbe med — ikke et rekrutteringsbyrå. Hele prosessen tar normalt
                to til tre uker.
              </p>
            </div>
          </div>

          <div className="method-grid">
            <div className="method">
              <div className="pre">01 · Steg</div>
              <h3>Søknad</h3>
              <p>
                Send CV og noen ord om hvorfor Advanti. Du trenger ikke et
                perfekt søknadsbrev — vi er mest opptatt av hvem du er og hva du
                vil. Vi svarer alle innen én uke.
              </p>
              <div className="meta">
                <span>Innen 1 uke</span>
                <span>Svar garantert</span>
              </div>
            </div>
            <div className="method">
              <div className="pre">02 · Steg</div>
              <h3>Første samtale</h3>
              <p>
                En uformell prat med en av partnerne — om bakgrunnen din,
                forventninger og hva rollen faktisk innebærer. Like mye en sjanse
                for deg til å bli kjent med oss.
              </p>
              <div className="meta">
                <span>45 min</span>
                <span>Med partner</span>
              </div>
            </div>
            <div className="method">
              <div className="pre">03 · Steg</div>
              <h3>Faglig case</h3>
              <p>
                En liten, realistisk oppgave knyttet til rollen — en
                verdivurdering, et oppdrag eller en markedsvurdering. Vi
                gjennomgår den sammen, mer som en samtale enn en eksamen.
              </p>
              <div className="meta">
                <span>Hjemme + møte</span>
                <span>Reell oppgave</span>
              </div>
            </div>
            <div className="method">
              <div className="pre">04 · Steg</div>
              <h3>Tilbud</h3>
              <p>
                Passer vi for hverandre, går vi raskt videre med betingelser og
                oppstart. Vi henter referanser, signerer — og ønsker deg
                velkommen til et lite hus med store oppdrag.
              </p>
              <div className="meta">
                <span>Innen få dager</span>
                <span>Velkommen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — HVA DU FÅR */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">06 — Hva du får</span>
            <div>
              <h2>
                Det vi tilbyr{" "}
                <span className="italic">utover oppdragene.</span>
              </h2>
              <p>
                Konkurransedyktige betingelser er en selvfølge. Det som virkelig
                teller, er rommet til å gjøre godt arbeid — og bli bedre mens du
                gjør det.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>Resultatdeling</h3>
              <p>
                Fast lønn med resultatbasert tillegg. Når huset leverer, deler vi
                — du ser direkte sammenheng mellom innsats og uttelling.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Faglig utvikling</h3>
              <p>
                Budsjett til kurs, sertifiseringer og fagsamlinger. Vi forventer
                at du vil vokse — og betaler for det.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Fleksibel hverdag</h3>
              <p>
                To kontorer i Bodø og Alta, fleksibilitet på sted og tid, og en
                arbeidsform basert på tillit fremfor kontroll.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE — Christer */}
      <section className="section section-divider">
        <div className="wrap">
          <div className="pullquote">
            <div>
              <div className="label">Partner &amp; daglig leder</div>
              <div className="attr" style={{ marginTop: 24 }}>
                <div
                  className="ph"
                  style={{
                    backgroundImage:
                      "url('https://kukzjreikqbgbolxvqaj.supabase.co/storage/v1/object/public/press/christer-hagen-web.jpg')",
                  }}
                />
                <div className="who">
                  <strong>Christer Hagen</strong>
                  <span>Partner &amp; daglig leder · Bodø</span>
                </div>
              </div>
            </div>
            <blockquote>
              Vi ansetter ikke for å bli store. Vi ansetter folk vi{" "}
              <span className="italic">vil jobbe ved siden av i ti år</span> — og
              gir dem oppdrag de kan eie fra første dag.
            </blockquote>
          </div>
        </div>
      </section>

      {/* TALL */}
      <section className="market">
        <div className="wrap">
          <div className="head-compact">
            <span
              className="eyebrow"
              style={{ color: "rgba(243,241,239,0.7)" }}
            >
              Advanti som arbeidsplass
            </span>
            <div>
              <h2 style={{ color: "var(--warm-white)" }}>
                Et hus du{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(243,241,239,0.7)",
                  }}
                >
                  blir værende i.
                </span>
              </h2>
              <p style={{ color: "rgba(243,241,239,0.7)" }}>
                Vi vokser sakte og bevisst. Det gir stabile team, lange
                relasjoner og en hverdag der hver enkelt faktisk teller.
              </p>
            </div>
          </div>
          <div className="market-stats market-stats--4up">
            <div className="stat">
              <div className="num-big">5</div>
              <p className="stat-label">Partnere i huset</p>
            </div>
            <div className="stat">
              <div className="num-big">
                60<span className="unit">år+</span>
              </div>
              <p className="stat-label">Samlet bransjeerfaring</p>
            </div>
            <div className="stat">
              <div className="num-big">3</div>
              <p className="stat-label">Nye byer vi vil vokse i</p>
            </div>
            <div className="stat">
              <div className="num-big">2</div>
              <p className="stat-label">Kontor — Bodø &amp; Alta</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Faq
        eyebrow="07 — Vanlige spørsmål"
        title={
          <>
            Før du <span className="italic">søker.</span>
          </>
        }
        lede="Litt om hvordan vi tenker rundt rekruttering. Står spørsmålet ditt ikke her, ta gjerne kontakt direkte."
        items={[
          {
            question: "Må jeg ha erfaring fra eiendom?",
            answer:
              "Ikke nødvendigvis. For meglerrollen vekter vi vurderingsevne, relasjonsforståelse og holdning høyere enn fartstid i bransjen. Vi har tatt inn folk fra finans, jus og salg og lært dem opp internt — så lenge grunnlaget og motivasjonen er der.",
          },
          {
            question:
              "Kan jeg sende en åpen søknad selv om dere ikke har ledig stilling?",
            answer:
              "Absolutt — og vi oppfordrer til det. Vi ansetter når vi møter riktig person, ikke bare når en stilling er utlyst. En god åpen søknad har flere ganger ført til en ny rolle. Send den via kontaktskjemaet og merk den «Åpen søknad».",
          },
          {
            question: "Hvor er kontorene, og er det mulig å jobbe fleksibelt?",
            answer:
              "Vi har kontor i Bodø og Alta. Hverdagen er fleksibel på både sted og tid — rollene innebærer møter, visninger og befaringer ute hos klienter, så en del av jobben skjer uansett utenfor kontoret. Vi styrer etter leveranse og tillit, ikke stemplingsur.",
          },
          {
            question: "Tar dere imot studenter og nyutdannede?",
            answer:
              "Ja. Vi har sommerpraktikant hver sommer, og tar gjerne en prat med dyktige nyutdannede med riktig innstilling. Fordi vi er små, får selv juniorroller reelt ansvar og tett oppfølging fra erfarne partnere.",
          },
          {
            question: "Hvor lang er prosessen, og hører jeg fra dere?",
            answer:
              "Normalt to til tre uker fra søknad til tilbud. Vi svarer alle søkere — også de vi ikke går videre med. Du skal aldri sitte og lure på hvor du står hos oss.",
          },
        ]}
      />

      <CtaStrip
        eyebrow="Fant du ikke din rolle?"
        title={
          <>
            Send oss en <span className="italic">åpen søknad.</span>
          </>
        }
        sub="Vi ansetter når vi møter riktig person. Fortell oss kort hvem du er, hva du brenner for og hvordan du tror du passer hos Advanti — så tar vi kontakt."
        primary={{ label: "Send åpen søknad", href: "/kontakt" }}
        secondary={{ label: "Møt teamet", href: "/personer" }}
      />
    </>
  );
}
