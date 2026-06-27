import Image from "next/image";
import Link from "next/link";

import { CtaStrip } from "@/components/site/CtaStrip";
import { Faq } from "@/components/site/Faq";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/",
  title: "Næringsmegler Nord-Norge | Advanti Estate",
  description:
    "Din lokale ekspert på salg og verdivurdering av næringseiendom i Nord-Norge. Vi hjelper deg å oppnå best mulig pris og presise verdivurderinger.",
});

const italicMuted = {
  fontStyle: "italic",
  fontWeight: 300,
  color: "var(--warm-grey-85)",
} as const;

const SERVICES = [
  {
    num: "01",
    title: "Verdivurdering",
    titleItalic: "og analyse",
    href: "/tjenester/verdivurdering",
    body: "Dyptgående verdivurderinger basert på DCF, yield-analyse og sensitivitet — et solid beslutningsgrunnlag for investering, finansiering eller regnskapsrapportering.",
  },
  {
    num: "02",
    title: "Transaksjons-",
    titleItalic: "rådgivning",
    href: "/tjenester/transaksjoner",
    body: "Strategisk rådgivning gjennom hele kjøps- eller salgsprosessen — fra due diligence og verdidriver-analyse til forhandling og gjennomføring.",
  },
  {
    num: "03",
    title: "Kjøp og salg",
    titleItalic: "av eiendom",
    href: "/tjenester/salg",
    body: "Vi identifiserer muligheter og gjennomfører transaksjoner med nasjonalt og internasjonalt nettverk — for å sikre riktig kjøper til riktig pris.",
  },
  {
    num: "04",
    title: "Utleie",
    titleItalic: "av næringslokaler",
    href: "/tjenester/utleie",
    body: "Effektiv utleieformidling og reforhandling for kontor, handel, bevertning og logistikk. Vi kjenner aktørene som søker areal i Nord-Norge.",
  },
  {
    num: "05",
    title: "Markedsdata",
    titleItalic: "og innsikt",
    href: "/tjenester/radgivning",
    body: "Egne databaser med yield, leienivå, ledighet og transaksjoner. Vi systematiserer det andre overser, og gjør tall til strategiske beslutninger.",
  },
  {
    num: "06",
    title: "Strategisk",
    titleItalic: "rådgivning",
    href: "/tjenester/strategisk-radgivning",
    body: "Skreddersydd rådgivning for utvikling, akkvisisjon og optimalisering av eiendomsporteføljen — fra et enkelt bygg til komplekse posisjoner.",
  },
];

const TICKER = [
  { label: "Yield Kontor Tromsø", val: "6.10 %", delta: "▲ 0.15", up: true },
  { label: "Yield Logistikk Bodø", val: "6.85 %", delta: "▲ 0.20", up: true },
  { label: "Markedsleie kontor (kr/m²)", val: "2 950", delta: "▲ 4.2 %", up: true },
  { label: "Transaksjonsvolum 2025", val: "4.8 mrd", delta: "▲ 18 %", up: true },
  { label: "Ledighet kontor Tromsø", val: "3.4 %", delta: "▼ 0.6", up: false },
  { label: "5-års swap (NOK)", val: "3.82 %", delta: "▼ 0.08", up: false },
];

const STATS = [
  {
    big: "6,10",
    unit: "%",
    delta: "▲ 15 bps siden Q3",
    down: false,
    label: "Prime yield kontor, Tromsø sentrum",
  },
  {
    big: "2 950",
    unit: "kr/m²",
    delta: "▲ 4,2 % YoY",
    down: false,
    label: "Markedsleie kontor klasse A, Tromsø",
  },
  {
    big: "3,4",
    unit: "%",
    delta: "▼ 60 bps YoY",
    down: true,
    label: "Kontorledighet, Tromsø-regionen",
  },
  {
    big: "4,8",
    unit: "mrd",
    delta: "▲ 18 % YoY",
    down: false,
    label: "Transaksjonsvolum næringseiendom Nord-Norge, 2025",
  },
];

const PILLARS = [
  {
    n: "I.",
    title: "Lokal ekspertise, bredere perspektiv.",
    body: "Røtter i Nord-Norge, øye for de nasjonale og internasjonale strømningene som beveger markedet.",
  },
  {
    n: "II.",
    title: "Datadrevet metodikk.",
    body: "Egne databaser, kvantitativ analyse og en dedikert analyseavdeling som leverer faktagrunnlaget.",
  },
  {
    n: "III.",
    title: "Klientens beslutninger i sentrum.",
    body: "Vi gir deg det best mulige faktabaserte grunnlaget — ikke for å imponere, men for å gjøre deg trygg på neste steg.",
  },
  {
    n: "IV.",
    title: "Komplett livssyklus.",
    body: "Fra første verdivurdering til avhendelse — én partner gjennom alle faser av eiendommens livsløp.",
  },
];

const CASES = [
  {
    tag: "Salg",
    href: "/kunder/morkvedbadet-bodo",
    img: "/building/pexels-abshky-18567185.jpg",
    alt: "Mørkvedbadet, Bodø (illustrasjonsfoto)",
    meta: ["Kultur og idrett · Bodø", "2025"],
    title: "Salget av Mørkvedbadet — grundig verdsettelse løsnet en fastlåst prosess.",
    stats: [
      { v: ">60", unit: "mnok", l: "Transaksjonsverdi" },
      { v: "5", unit: "mnd", l: "Fra mandat til salg" },
    ],
  },
  {
    tag: "Salg",
    href: "/kunder/naeringspark-helgeland",
    img: "/building/pexels-expect-best-79873-351262.jpg",
    alt: "Lager- og logistikkpark (illustrasjonsfoto)",
    meta: ["Lager og logistikk · Helgeland", "2025"],
    title: "Næringspark på Helgeland — reforhandlet leie gjorde et spesialbygg salgbart.",
    stats: [
      { v: "35–40", unit: "mnok", l: "Transaksjonsverdi" },
      { v: "~8", unit: "%", l: "Yield" },
    ],
  },
  {
    tag: "Reforhandling",
    href: "/kunder/reforhandling-kontor-bodo",
    img: "/building/pexels-pixabay-248877.jpg",
    alt: "Kontorbygg (illustrasjonsfoto)",
    meta: ["Kontor · Bodø", "Eksempel"],
    title: "Reforhandlingen som doblet leien — fra 1\u00A0500 til 3\u00A0000 kr/m².",
    stats: [
      { v: "2", unit: "×", l: "Leienivå" },
      { v: "3\u00A0000", unit: "kr/m²", l: "Ny årsleie" },
    ],
  },
];

// Topp-funnel FAQ for forsiden — siterbare, frittstående svar (CORE-EEAT C02)
// som AI-motorer kan trekke ut. Ingen markedstall (proofStats-gate /
// synthetic-series-forbud); kun prosess, tjeneste og kategori. FAQPage-schema
// emittes automatisk av <Faq>.
const FAQ_ITEMS = [
  {
    question: "Hva er en næringsmegler, og hva gjør Advanti?",
    answer:
      "En næringsmegler bistår med kjøp, salg, utleie og verdivurdering av næringseiendom — som kontor, handel, lager og logistikk. Advanti er næringsmegler i Nord-Norge og kombinerer lokal markedskunnskap med datadrevet analyse gjennom hele eiendommens livssyklus.",
  },
  {
    question: "Hvilke områder i Nord-Norge dekker Advanti?",
    answer:
      "Vi er næringsmegler i hele Nord-Norge, med lokal tilstedeværelse i blant annet Bodø, Tromsø, Alta, Harstad, Narvik og Lofoten. Hovedkontoret ligger i Bodø.",
  },
  {
    question: "Hva koster en verdivurdering av næringseiendom?",
    answer:
      "Verdivurdering og utleieoppdrag har vanligvis et fast honorar, mens salgsoppdrag prises som en provisjon av oppnådd salgssum. Nivået avhenger av eiendomstype, størrelse og kompleksitet — du får et konkret, skriftlig tilbud før vi starter.",
  },
  {
    question: "Hvor lang tid tar et salg av næringseiendom?",
    answer:
      "En typisk salgsprosess tar fra to til seks måneder fra oppstart til signert kontrakt, avhengig av segment, prisnivå og marked. Kontoreiendom med solide leietakere går ofte raskere; mer spesialiserte objekter tar lengre tid.",
  },
  {
    question: "Hva er forskjellen på en verdivurdering og en takst?",
    answer:
      "En verdivurdering fra en næringsmegler estimerer markedsverdi basert på leieinntekter, sammenlignbare transaksjoner og DCF-analyse — et beslutningsgrunnlag for salg, finansiering eller strategi. En takst er en mer formell tilstands- og verdivurdering, ofte utført av en sertifisert takstmann.",
  },
  {
    question: "Jobber Advanti med både kjøpere, selgere og leietakere?",
    answer:
      "Ja. Vi bistår eiendomsbesittere med salg, utleie og verdivurdering, investorer og kjøpere med å finne og vurdere objekter, og leietakere med søk, reforhandling og rådgivning om leienivå.",
  },
];

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" id="top">
        <div className="hero-photo">
          <Image
            src="/building/pexels-pixabay-248877.jpg"
            alt="Næringseiendom i Nord-Norge"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
        </div>
        <div className="hero-content">
          <div className="hero-meta">
            <span className="left">
              <span>Næringseiendom</span>
              <span className="dot" />
              <span>Nord-Norge</span>
            </span>
            <span>Etablert 2024 · Bodø, Tromsø &amp; Alta</span>
          </div>
          <h1>
            Salg og verdivurdering
            <br />
            av næringseiendom{" "}
            <span className="italic">i Nord-Norge.</span>
          </h1>
          <p className="hero-sub">
            Vi leverer presise verdivurderinger og riktig salgsstrategi basert
            på dyp lokal markedsinnsikt — og et nasjonalt nettverk som åpner
            dørene for de rette kjøperne.
          </p>
          <div className="hero-cta-row">
            <Link href="/kontakt" className="btn btn-primary">
              Få uforpliktende verdivurdering
              <span className="arrow">→</span>
            </Link>
            <Link href="#tjenester" className="btn btn-ghost">
              Våre tjenester
            </Link>
          </div>
        </div>
      </section>
      {/* Nav sentinel: present only on pages with a dark hero */}
      <div id="hero-sentinel" aria-hidden="true" />

      {/* ===== TICKER ===== */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ display: "contents" }}>
              <div>
                <span className="label">{t.label}</span>
                <span className="val">{t.val}</span>
                <span className={t.up ? "delta-up" : "delta-down"}>
                  {t.delta}
                </span>
              </div>
              <span className="sep" />
            </span>
          ))}
        </div>
      </div>

      {/* ===== TJENESTER ===== */}
      <section className="section" id="tjenester">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">01 — Tjenester</span>
            </div>
            <div className="right">
              <h2>
                Et komplett spekter <br />
                innen næringseiendom{" "}
                <span className="italic">— levert med presisjon.</span>
              </h2>
              <p style={{ marginTop: 28 }}>
                Advanti tilbyr verdivurdering, transaksjonsrådgivning,
                utleieformidling og strategisk analyse. Vår tilnærming
                kombinerer dybdekunnskap fra Nord-Norge med metodikk og data fra
                det nasjonale markedet.
              </p>
            </div>
          </div>

          <div className="services reveal">
            {SERVICES.map((s) => (
              <Link href={s.href} className="service" key={s.num}>
                <span className="num">{s.num}</span>
                <div>
                  <h3>
                    {s.title}
                    <br />
                    <span style={italicMuted}>{s.titleItalic}</span>
                  </h3>
                  <p>{s.body}</p>
                  <span className="more">
                    Les mer <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARKEDSINNSIKT ===== */}
      <section className="market" id="markedsinnsikt">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">02 — Markedsinnsikt</span>
            </div>
            <div className="right">
              <h2>
                Tallene fra Nord-Norge, <br />
                <span className="italic">oppdatert kvartalsvis.</span>
              </h2>
              <p style={{ marginTop: 28 }}>
                Vi sporer over 1 400 næringseiendommer på tvers av Bodø, Tromsø,
                Harstad, Narvik, Alta og Kirkenes. Resultatet er det skarpeste bildet
                av markedet du finner nord for Trondheim.
              </p>
            </div>
          </div>

          <div className="market-grid reveal">
            <div className="market-stats">
              {STATS.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="num-big">
                    {s.big}
                    <span className="unit">{s.unit}</span>
                  </div>
                  <div className={s.down ? "delta down" : "delta"}>
                    {s.delta}
                  </div>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="market-photo">
              <div className="img">
                <Image
                  src="/building/pexels-abshky-18566965.jpg"
                  alt="Kontortårn i Tromsø"
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="caption">
                <span>FIG. 01 — KONTORTÅRN, TROMSØ</span>
                <span>Q4 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OM ADVANTI ===== */}
      <section className="section" id="om-advanti">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">03 — Om Advanti</span>
            </div>
            <div className="right">
              <h2>
                Strategisk innsikt,
                <br />
                <span className="italic">lokal forankring.</span>
              </h2>
            </div>
          </div>

          <div className="about reveal">
            <div className="about-text">
              <p>
                Advanti er et kompetansemiljø dedikert til næringseiendom i
                Nord-Norge. Vi kombinerer dyp lokal forankring med et nasjonalt
                nettverk og metodikk hentet fra de største transaksjonshusene i
                landet.
              </p>
              <p>
                Resultatet er rådgivning som er presis, faktabasert og
                strategisk — enten du eier ett bygg eller forvalter en
                portefølje. Vi tror at de beste beslutningene tas der lokal
                forståelse møter strukturert data.
              </p>

              <div className="pillars">
                {PILLARS.map((p) => (
                  <div className="pillar" key={p.n}>
                    <span className="pn">{p.n}</span>
                    <span className="pt">{p.title}</span>
                    <p className="pd">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-photo">
              <div className="frame" style={{ position: "relative" }}>
                <Image
                  src="/building/pexels-abshky-18566965.jpg"
                  alt="Næringsbygg i Nord-Norge"
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="photo-caption">
                <span>Næringsbygg · Tromsø</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== UTVALGTE OPPDRAG ===== */}
      <section
        className="section section-divider"
        id="oppdrag"
        style={{ background: "var(--accent-faint)" }}
      >
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">04 — Utvalgte oppdrag</span>
            </div>
            <div className="right">
              <h2>
                Et utvalg av{" "}
                <span className="italic">nylige transaksjoner</span> <br />
                og verdivurderinger.
              </h2>
              <p style={{ marginTop: 28 }}>
                Et lite knippe av oppdragene vi jobber med — fra salg av
                profilert spesialeiendom til reforhandling av leiekontrakter
                som dobler gårdeiers leienivå.
              </p>
            </div>
          </div>

          <div className="cases reveal">
            {CASES.map((c) => (
              <Link className="case" href={c.href} key={c.title}>
                <div className="case-img" style={{ position: "relative" }}>
                  <span className="tag">{c.tag}</span>
                  <Image
                    src={c.img}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="case-meta">
                  <span>{c.meta[0]}</span>
                  <span>{c.meta[1]}</span>
                </div>
                <h3>{c.title}</h3>
                <div className="case-stat">
                  {c.stats.map((st) => (
                    <div key={st.l}>
                      <span className="v">
                        {st.v}
                        <span className="unit">{st.unit}</span>
                      </span>
                      <span className="l">{st.l}</span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="cases-foot">
            <div className="count">
              <strong>+47 oppdrag</strong> levert i 2025 — på tvers av
              Nord-Norge.
            </div>
            <Link href="/kunder" className="btn btn-outline">
              Se alle oppdrag <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <Faq
        eyebrow="05 — Ofte stilte spørsmål"
        title={
          <>
            Spørsmål om <span className="italic">næringseiendom.</span>
          </>
        }
        lede="Korte svar på det folk oftest lurer på. Finner du ikke svaret? Ta kontakt for en uforpliktende samtale."
        items={FAQ_ITEMS}
      />

      {/* ===== CTA ===== */}
      <CtaStrip
        eyebrow="06 — Kontakt"
        title={
          <>
            Ta kontakt for en <br />
            <span className="italic">uforpliktende samtale.</span>
          </>
        }
        sub="Enten du vurderer å selge, kjøpe eller bare ønsker en oppdatert verdivurdering — vi tar en samtale uten forpliktelser."
        primary={{ label: "Send henvendelse", href: "/kontakt" }}
        secondary={{ label: "Ta kontakt med teamet", href: "/personer" }}
      />
    </>
  );
}
