import Link from "next/link";
import type { ReactNode } from "react";

import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/verktoy",
  title: "Verktøy for næringseiendom i Nord-Norge | Advanti Estate",
  description:
    "Advanti Estates verktøykasse for næringseiendom i Nord-Norge: næringskalkulator, yield-kalkulator, gratis verdivurdering, sjekklister, markedsinnsikt og analyseportal — fritt tilgjengelig, uten innlogging.",
});

interface Tool {
  href: string;
  title: ReactNode;
  description: string;
  badge: string;
  cta: string;
  feature?: boolean;
}

interface Group {
  n: string;
  title: ReactNode;
  note: string;
  tools: Tool[];
}

const GROUPS: Group[] = [
  {
    n: "01",
    title: (
      <>
        Beregn &amp; <span className="italic">vurdér</span>
      </>
    ),
    note: "Kalkulatorer og sjekklister for raske, etterprøvbare overslag.",
    tools: [
      {
        href: "/verktoy/naringskalkulator",
        title: "Næringskalkulator",
        description:
          "Beregn verdi, direkteavkastning og kontantstrøm for et næringsbygg basert på leie, ledighet, eierkostnader og yield — med sensitivitet på de viktigste driverne.",
        badge: "Mest brukt",
        cta: "Åpne kalkulator",
        feature: true,
      },
      {
        href: "/verktoy/yield-kalkulator",
        title: (
          <>
            Yield-<span className="italic">kalkulator</span>
          </>
        ),
        description:
          "Regn deg fram til netto yield, brutto yield og implisitt verdi — og se hvordan små endringer i leie eller rente slår ut.",
        badge: "Kalkulator",
        cta: "Åpne",
      },
      {
        href: "/verdivurdering",
        title: (
          <>
            Gratis <span className="italic">verdivurdering</span>
          </>
        ),
        description:
          "Få et uforpliktende verdiestimat på din næringseiendom fra en seniorrådgiver. Du fyller inn nøkkeltall — vi tar resten.",
        badge: "Uforpliktende",
        cta: "Be om estimat",
      },
      {
        href: "/sjekkliste-verdivurdering",
        title: (
          <>
            Sjekkliste for <span className="italic">verdivurdering</span>
          </>
        ),
        description:
          "Alt du bør ha klart før en verdivurdering — leiekontrakter, tekniske forhold og økonomi. Huk av punktene før møtet.",
        badge: "Sjekkliste",
        cta: "Åpne",
      },
    ],
  },
  {
    n: "02",
    title: (
      <>
        Marked &amp; <span className="italic">analyse</span>
      </>
    ),
    note: "Yield, leie, ledighet og transaksjoner — by for by, kvartal for kvartal.",
    tools: [
      {
        href: "/markedsinnsikt",
        title: "Markedsinnsikt",
        description:
          "Interaktivt dashbord over næringseiendomsmarkedet i Nord-Norge. Følg yield, markedsleie, ledighet og transaksjonsvolum på tvers av kontor, handel og logistikk.",
        badge: "Live data",
        cta: "Åpne dashbord",
        feature: true,
      },
      {
        href: "/markedsinnsikt/kart",
        title: (
          <>
            Markedskart <span className="italic">Nord-Norge</span>
          </>
        ),
        description:
          "Sammenlign byene side om side på kart — Tromsø, Bodø, Alta, Narvik, Harstad og Mo i Rana — på yield, leie og volum.",
        badge: "Interaktivt kart",
        cta: "Åpne kart",
      },
      {
        href: "/analyseportal",
        title: (
          <>
            Analyse<span className="italic">portal</span>
          </>
        ),
        description:
          "Dypere snitt av markedsdataene — segmenter, tidsserier og eksport. For deg som vil grave i tallene selv.",
        badge: "Portal",
        cta: "Åpne",
      },
    ],
  },
  {
    n: "03",
    title: (
      <>
        Kunnskap &amp; <span className="italic">innsikt</span>
      </>
    ),
    note: "Begrepene og metodikken bak tallene — forklart enkelt.",
    tools: [
      {
        href: "/help",
        title: (
          <>
            Kunnskaps<span className="italic">senter</span>
          </>
        ),
        description:
          "Konkrete forklaringer av yield, DCF, leiekontrakter og verdivurdering — skrevet for eiere og investorer, ikke for fagfolk.",
        badge: "Gratis · åpent",
        cta: "Les mer",
      },
    ],
  },
  {
    n: "04",
    title: (
      <>
        For <span className="italic">investorer</span>
      </>
    ),
    note: "Tilgang til oppdrag og porteføljedata for aktive aktører.",
    tools: [
      {
        href: "/investorportal",
        title: (
          <>
            Investor<span className="italic">portal</span>
          </>
        ),
        description:
          "Samlet oversikt over aktuelle oppdrag, nøkkeltall og dokumenter — for investorer i nettverket vårt.",
        badge: "For nettverk",
        cta: "Åpne portal",
      },
      {
        href: "/off-market-tilgang",
        title: (
          <>
            Off-market <span className="italic">tilgang</span>
          </>
        ),
        description:
          "Registrer ditt mandat og få tilgang til oppdrag som ikke annonseres åpent. Diskré formidling mellom kjente parter.",
        badge: "Diskré",
        cta: "Be om tilgang",
      },
    ],
  },
];

const TOOL_COUNT = GROUPS.reduce((sum, g) => sum + g.tools.length, 0);

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <Link href={tool.href} className={`vk-tool${tool.feature ? " feature" : ""}`}>
      <div className="vk-top">
        <span className="vk-num">
          VERKTØY {String(index).padStart(2, "0")}
        </span>
        <h3>{tool.title}</h3>
        <p>{tool.description}</p>
      </div>
      <div className="vk-foot">
        <span className="vk-meta">
          <span className="badge">{tool.badge}</span>
        </span>
        <span className="vk-open">
          {tool.cta} <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

// Sequential VERKTØY NN label offset for the first tool in each group.
const GROUP_OFFSETS = GROUPS.reduce<number[]>((acc, _group, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + GROUPS[i - 1].tools.length);
  return acc;
}, []);

export default function VerktoyPage() {
  return (
    <>
      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Verktøy" }]}
        eyebrow="Verktøykassen"
        title={
          <>
            Beregn, vurdér og <br />
            forstå markedet{" "}
            <span className="italic">— på egen hånd.</span>
          </>
        }
        lede="Vi har samlet kalkulatorene, sjekklistene og markedsdataene vi bruker i det daglige — fritt tilgjengelig for eiere, investorer og utviklere i Nord-Norge. Et solid utgangspunkt før du tar kontakt."
        actions={[
          {
            label: "Prøv næringskalkulatoren",
            href: "/verktoy/naringskalkulator",
          },
          { label: "Se alle verktøy", href: "#verktoy", variant: "outline" },
        ]}
        metaRow={[
          { value: String(TOOL_COUNT), label: "Verktøy & ressurser" },
          { value: "1 400+", label: "Eiendommer i database" },
          { value: "Gratis", label: "Ingen innlogging" },
        ]}
        photo={{
          src: "/building/pexels-grayscale-buildings-10156133.jpg",
          alt: "Næringsbygg i Nord-Norge",
        }}
      />

      {/* OVERSIKT */}
      <section className="section-tight section-divider">
        <div className="wrap">
          <div className="vk-overview">
            <div className="ov">
              <div className="v">
                3<span className="unit">kalkulatorer</span>
              </div>
              <div className="l">
                Næring, yield og verdivurdering — beregn nøkkeltall på minutter.
              </div>
            </div>
            <div className="ov">
              <div className="v">
                Kvartal<span className="unit">vis</span>
              </div>
              <div className="l">
                Markedsdata og innsikt oppdatert for hele landsdelen.
              </div>
            </div>
            <div className="ov">
              <div className="v">
                Åpent<span className="unit">døgnet</span>
              </div>
              <div className="l">
                Alle verktøy er tilgjengelige uten konto — når det passer deg.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERKTØY */}
      <section className="section" id="verktoy">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Verktøy</span>
            <div>
              <h2>
                Alt på <span className="italic">ett sted.</span>
              </h2>
              <p>
                Fra raske overslag til dyptgående markedsanalyse. Verktøyene
                henter fra samme datagrunnlag som rådgiverne våre jobber med hver
                dag.
              </p>
            </div>
          </div>

          {GROUPS.map((group, gi) => (
            <div className="vk-group" key={group.n}>
              <div className="vk-group-head">
                <div className="gh-left">
                  <span className="gn">{group.n}</span>
                  <h2>{group.title}</h2>
                </div>
                <p className="gh-note">{group.note}</p>
              </div>
              <div className="vk-grid">
                {group.tools.map((tool, ti) => (
                  <ToolCard
                    key={tool.href}
                    tool={tool}
                    index={GROUP_OFFSETS[gi] + ti + 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaStrip
        eyebrow="Trenger du et menneske?"
        title={
          <>
            Verktøy tar deg langt. <br />
            <span className="italic">En rådgiver tar deg hele veien.</span>
          </>
        }
        sub="Når du har gjort overslagene, hjelper vi deg å lese tallene riktig — og legge en plan. Ta en uforpliktende prat med en av rådgiverne våre."
        primary={{ label: "Kontakt oss", href: "/kontakt" }}
        secondary={{ label: "+47 984 53 571", href: "tel:+4798453571" }}
      />
    </>
  );
}
