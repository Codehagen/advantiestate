import Link from "next/link"

import { constructMetadata } from "@/lib/utils"
import { SubHero } from "@/components/site/SubHero"
import { CtaStrip } from "@/components/site/CtaStrip"
import { BreadcrumbStructuredData } from "@/components/StructuredData"
import { CITIES, LATEST_QUARTER } from "@/components/markedsinnsikt/marketData"
import { siteConfig } from "@/app/siteConfig"

export const metadata = constructMetadata({
  path: "/presserom",
  title: "Presserom — markedstall for media | Advanti Estate",
  description:
    "Markedstall for næringseiendom i Nord-Norge, fritt til bruk for media med kildehenvisning til Advanti Estate. Yield, leie og ledighet per by, sitat og pressekontakt.",
})

export default function PresseromPage() {
  const phone = siteConfig.contact.phone
  const email = siteConfig.contact.email

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Presserom", url: "/presserom" },
        ]}
      />

      <SubHero
        crumb={[{ label: "Hjem", href: "/" }, { label: "Presserom" }]}
        eyebrow="Presserom · For media"
        title={
          <>
            Markedstall <span className="italic">til fri bruk.</span>
          </>
        }
        lede="Skriver du om næringseiendom i Nord-Norge? Tallene under kan gjengis fritt med kildehenvisning til Advanti Estate. Oppdatert kvartalsvis — og vi stiller gjerne til kommentar eller intervju."
        actions={[
          { label: "Pressekontakt", href: "#kontakt" },
          { label: "Full markedsinnsikt", href: "/markedsinnsikt", variant: "outline" },
        ]}
        metaRow={[
          { value: String(CITIES.length), label: "Byer dekket" },
          { value: LATEST_QUARTER, label: "Sist oppdatert" },
          { value: "Kvartalsvis", label: "Oppdatering" },
        ]}
      />

      {/* 01 — NØKKELTALL */}
      <section className="section section-divider" id="tall">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">01 — Nøkkeltall · {LATEST_QUARTER}</span>
            <div>
              <h2>
                Tallene, <span className="italic">klare til sitering.</span>
              </h2>
              <p>
                Prime yield (kontor), markedsleie og kontorledighet per by i
                Nord-Norge. Indikative tall for prime kvalitet. Full segmentert
                databredde — kontor, handel og logistikk — ligger på{" "}
                <Link href="/markedsinnsikt">markedsinnsikt</Link>.
              </p>
            </div>
          </div>

          <div className="mi-kpis" style={{ marginBottom: 40 }}>
            <div className="mi-kpi">
              <div className="label">Byer dekket</div>
              <div className="val">{CITIES.length}</div>
              <div className="delta">Bodø til Hammerfest</div>
            </div>
            <div className="mi-kpi">
              <div className="label">Lavest ledighet</div>
              <div className="val">
                3,4<span className="unit">%</span>
              </div>
              <div className="delta">Tromsø — stramt marked</div>
            </div>
            <div className="mi-kpi">
              <div className="label">Transaksjonsvolum</div>
              <div className="val">
                4,8<span className="unit">mrd</span>
              </div>
              <div className="delta">Nord-Norge · 2025</div>
            </div>
            <div className="mi-kpi">
              <div className="label">Sist oppdatert</div>
              <div className="val">{LATEST_QUARTER}</div>
              <div className="delta">Kvartalsvis</div>
            </div>
          </div>

          <table className="mi-table">
            <caption className="sr-only">
              Prime yield, markedsleie og kontorledighet per by, {LATEST_QUARTER}
            </caption>
            <thead>
              <tr>
                <th>By</th>
                <th className="r">Prime yield (kontor)</th>
                <th className="r">Markedsleie kontor</th>
                <th className="r">Kontorledighet</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="r">{c.yield}</td>
                  <td className="r">{c.leie}</td>
                  <td className="r">{c.vac}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mi-footnote" style={{ marginTop: 24 }}>
            <span className="source">
              Tall er indikative og reflekterer prime kvalitet.
            </span>
            <span>Kilde: Advanti Estate · {LATEST_QUARTER}</span>
          </div>
        </div>
      </section>

      {/* 02 — SLIK SITERER DU */}
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
            <span className="eyebrow">02 — Bruk av tallene</span>
            <div>
              <h2>
                Slik <span className="italic">siterer du.</span>
              </h2>
              <p>
                Tallene kan gjengis fritt i redaksjonell sammenheng. Vi ber kun
                om kildehenvisning til «Advanti Estate» med lenke til
                advantiestate.no. Trenger du tall for en spesifikk by, segment
                eller periode — eller et sitat på sak — ta kontakt, så leverer vi
                raskt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — PRESSEKIT */}
      <section className="section section-divider" id="pressekit">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">03 — Pressekit</span>
            <div>
              <h2>
                Klar til <span className="italic">bruk.</span>
              </h2>
            </div>
          </div>

          <div className="press-boilerplate">
            <div className="label">Om Advanti Estate</div>
            <p>
              Advanti Estate er en kommersiell eiendomsrådgiver med kontor i
              Bodø, spesialisert på næringseiendom i Nord-Norge. Vi tilbyr
              megling, verdsettelse og markedsanalyse — og er regionens
              ledende kilde for data om prime yield, markedsleie og
              kontorledighet per by.
            </p>
          </div>

          <div className="press-terms" id="bruksvilkar">
            <div className="label">Bruksvilkår</div>
            <p>
              Tallene og sitatene på denne siden er fritt tilgjengelig for
              redaksjonell bruk. Vi ber om kreditering{" "}
              <strong>«Advanti Estate»</strong> med lenke til{" "}
              <a href="https://advantiestate.no">advantiestate.no</a>.
              Ta kontakt for originalfiler, høyoppløste portretter eller
              logofiler.
            </p>
          </div>

          <p className="press-assets-note">
            Logopakke og høyoppløste pressebilder sendes på forespørsel —
            pressekit for nedlasting kommer.{" "}
            <Link href="#kontakt">Kontakt oss.</Link>
          </p>
        </div>
      </section>

      {/* 04 — SITAT */}
      <section className="section">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">04 — Sitat fra senior partner</span>
            <div>
              <h2>
                Til <span className="italic">fri gjengivelse.</span>
              </h2>
            </div>
          </div>
          <blockquote className="press-quote">
            «Nord-Norge går inn i 2026 med rekordlav ledighet — Tromsø nede på
            3,4 % — og et yield-gap mot storbyene som gjør landsdelen attraktiv
            for investorer. Med forventede rentekutt tror vi på moderat
            yield-kompresjon og økt transaksjonsvolum gjennom året.»
            <span className="by">
              <Link href="/personer/christer-hagen">Christer Hagen</Link>
              <span>Partner / Næringsmegler MNEF · Advanti Estate</span>
            </span>
          </blockquote>
        </div>
      </section>

      {/* 05 — PRESSEKONTAKT */}
      <section className="section section-divider" id="kontakt">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">05 — Pressekontakt</span>
            <div>
              <h2>
                For kommentar <span className="italic">og intervju.</span>
              </h2>
              <p>
                Vi stiller gjerne til kommentar om næringseiendomsmarkedet i
                Nord-Norge, og leverer tall eller en full datapakke på
                forespørsel.
              </p>
            </div>
          </div>
          <div className="press-contact">
            <div>
              <div className="label">Kontakt</div>
              Christer Hagen
              <br />
              Partner / Næringsmegler MNEF
            </div>
            <div>
              <div className="label">Telefon</div>
              <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
            </div>
            <div>
              <div className="label">E-post</div>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Trenger du tall eller et sitat?"
        title={
          <>
            Vi svarer <span className="italic">raskt.</span>
          </>
        }
        sub="Send en henvendelse, så får du tall, kommentar eller en full datapakke tilpasset saken din."
        primary={{ label: "Ta kontakt", href: "/kontakt" }}
        secondary={{ label: "Se markedsinnsikt", href: "/markedsinnsikt" }}
      />
    </>
  )
}
