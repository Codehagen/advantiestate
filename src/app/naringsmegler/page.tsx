import { allLocationPosts } from "content-collections";
import Link from "next/link";
import Image from "next/image";

import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { CtaStrip } from "@/components/site/CtaStrip";
import { SubHero } from "@/components/site/SubHero";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Næringsmegler i Nord-Norge | Advanti Estate",
  description:
    "Næringsmegler i Nord-Norge med lokal tilstedeværelse. Advanti bistår med salg, utleie og verdivurdering av næringseiendom i sentrale byer.",
  path: "/naringsmegler",
});

/** Picks the value of the first marketStat whose label matches a keyword. */
function findStat(
  stats: { label: string; value: string }[],
  keyword: string,
) {
  return stats.find((s) =>
    s.label.toLowerCase().includes(keyword.toLowerCase()),
  )?.value;
}

export default function NaringsmeglerHubPage() {
  // Data-driven city grid — ordered by the `order` field from the content
  // collection.
  const locations = [...allLocationPosts].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Næringsmegler", url: "/naringsmegler" },
        ]}
      />
      <StructuredData type="realEstateAgent" />

      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Næringsmegler" }]}
        eyebrow={`Næringsmegler · ${locations.length} markeder`}
        title={
          <>
            Lokal næringsmegler <br />
            <span className="italic">i hele Nord-Norge.</span>
          </>
        }
        lede="Advanti kombinerer lokal tilstedeværelse med datadrevet markedskompetanse. Vi bistår eiendomsbesittere, investorer og utviklere med salg, utleie og verdivurdering — i de viktigste byene fra Bodø til Alta."
        actions={[
          { label: "Få lokal vurdering", href: "/kontakt" },
          { label: "Velg din by", href: "#byer", variant: "outline" },
        ]}
        metaRow={[
          { value: String(locations.length), label: "Markeder dekket" },
          { value: "2", label: "Kontorer · Bodø & Alta" },
          { value: "+1 400", label: "Eiendommer i database" },
        ]}
        photo={{
          src: "/building/pexels-pixabay-248877.jpg",
          alt: "Næringseiendom Nord-Norge",
        }}
      />

      {/* BY-GRID */}
      <section className="section section-divider" id="byer">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Velg din by</span>
            <div>
              <h2>
                Lokal markedsinnsikt, <br />
                <span className="italic">by for by.</span>
              </h2>
              <p>
                Hver by har sin egen markedsdynamikk, sine leietakere og sine
                yield-nivåer. Klikk på en by for å se lokale markedsdata,
                hvilket Advanti-team du møter, og hvordan vi jobber lokalt.
              </p>
            </div>
          </div>

          <div className="cy-grid">
            {locations.map((location, index) => {
              const num = `_0${index + 1}`;
              const primeYield = findStat(
                location.marketStats,
                "prime yield",
              );
              const vacancy = findStat(location.marketStats, "ledighet");
              return (
                <Link
                  key={location.slug}
                  className="cy-card"
                  href={`/naringsmegler/${location.slug}`}
                >
                  <div className="cy-image">
                    <Image
                      src={location.hero.image}
                      alt={`${location.name} næringseiendom`}
                      fill
                      sizes="(max-width: 980px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="label">
                      {num} · {location.region}
                    </span>
                  </div>
                  <div>
                    <span className="reg">
                      {location.serviceArea === "Region"
                        ? "Region"
                        : location.region}
                    </span>
                    <h3>{location.name}</h3>
                  </div>
                  <p className="summary">{location.hero.description}</p>
                  {(primeYield || vacancy) && (
                    <div className="stats">
                      {primeYield && (
                        <div>
                          <span className="v">{primeYield}</span>
                          <span className="l">Prime yield</span>
                        </div>
                      )}
                      {vacancy && (
                        <div>
                          <span className="v">{vacancy}</span>
                          <span className="l">Ledighet</span>
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HVORDAN VI JOBBER */}
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
            <span className="eyebrow">02 — Lokal tilnærming</span>
            <div>
              <h2>
                Lokal kunnskap. <br />
                <span className="italic">Nasjonal metodikk.</span>
              </h2>
              <p>
                Vi bor i regionen. Det betyr at vi forstår nyansene mellom
                kontormarkedet i Bodø og Tromsø, og hvorfor en
                logistikkeiendom i Narvik ikke prises som én i Harstad.
                Samtidig bringer vi metodikk fra de største transaksjonshusene.
              </p>
            </div>
          </div>

          <div className="feat-3">
            <div className="feat">
              <div className="num">I</div>
              <h3>To kontorer · flere byer</h3>
              <p>
                Hovedkontor i Bodø og lokalkontor i Alta gir oss permanent
                tilstedeværelse i landsdelen — og vi dekker resten av byene
                digitalt og gjennom regelmessige reiser.
              </p>
            </div>
            <div className="feat">
              <div className="num">II</div>
              <h3>Lokal data, kvartalsvis</h3>
              <p>
                Vi sporer over 1 400 eiendommer på tvers av landsdelen,
                oppdatert hvert kvartal. Det gjør at hver verdivurdering er
                fundert i reelle tall — ikke nasjonale gjennomsnitt.
              </p>
            </div>
            <div className="feat">
              <div className="num">III</div>
              <h3>Senior partner på hver sak</h3>
              <p>
                Du møter aldri en juniorkonsulent. Senior partner som starter
                oppdraget er den samme som lukker det — uavhengig av hvilken by
                eiendommen ligger i.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Vil du ha lokal vurdering?"
        title={
          <>
            Få profesjonell vurdering <br />
            <span className="italic">basert på lokale data.</span>
          </>
        }
        sub="Ta kontakt for en lokal vurdering av eiendommen din. Vi setter sammen et team som dekker byen og segmentet ditt."
        primary={{ label: "Få uforpliktende vurdering", href: "/kontakt" }}
        secondary={{ label: "Se våre tjenester", href: "/tjenester" }}
      />
    </>
  );
}
