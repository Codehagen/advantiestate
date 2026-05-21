import StructuredData, {
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { CtaStrip } from "@/components/site/CtaStrip";
import { constructMetadata } from "@/lib/utils";
import { allPersonPosts } from "content-collections";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PersonMDX } from "./person-mdx";

interface PersonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Per-person office label used by the editorial portrait badge. Falls back to
// "Nord-Norge" for any person not listed here.
const OFFICE: Record<string, string> = {
  "christer-hagen": "Bodø",
  "daniel-adamsen": "Bodø",
  "ole-ostensen": "Bergen",
  "havard-nome": "Alta",
  "tobias-bronder": "Bodø",
};

const MONTHS = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

function formatStarted(startedAt: string) {
  const date = new Date(startedAt);
  if (Number.isNaN(date.getTime())) return startedAt;
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export async function generateStaticParams() {
  return allPersonPosts.map((person) => ({
    slug: person.slug,
  }));
}

export async function generateMetadata({ params }: PersonPageProps) {
  const { slug } = await params;
  const person = allPersonPosts.find((p) => p.slug === slug);

  if (!person) {
    return {};
  }

  return constructMetadata({
    title: `${person.name} - ${person.role} | Advanti`,
    description: `${person.name} er ${person.role} i Advanti med ${person.yearsExperience} års erfaring. Spesialiseringer: ${person.specializations.join(", ")}.`,
    canonical: `/personer/${slug}`,
  });
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params;
  const person = allPersonPosts.find((p) => p.slug === slug);

  if (!person) {
    notFound();
  }

  const office = OFFICE[person.slug ?? ""] ?? "Nord-Norge";
  const firstName = person.name.split(" ")[0];

  // Other team members for the "resten av teamet" rail.
  const others = allPersonPosts.filter((p) => p.slug !== person.slug);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Hjem", url: "/" },
          { name: "Team", url: "/personer" },
          { name: person.name, url: `/personer/${person.slug}` },
        ]}
      />
      <StructuredData
        type="person"
        data={{
          name: person.name,
          role: person.role,
          avatar: person.avatar,
          email: person.email,
          phone: person.phone,
          slug: person.slug,
          description: `${person.name} er ${person.role} i Advanti med ${person.yearsExperience} års erfaring.`,
        }}
      />

      <div className="page-pad" />

      {/* HERO */}
      <section className="subhero" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <nav className="crumb" aria-label="Brødsmuler">
            <Link href="/">Hjem</Link>
            <span className="sep">/</span>
            <Link href="/personer">Vårt team</Link>
            <span className="sep">/</span>
            <span className="here">{person.name}</span>
          </nav>

          <div className="pe-hero">
            <div className="portrait">
              <span className="badge">{office}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={person.avatar} alt={person.name} />
            </div>

            <div>
              <span
                className="eyebrow"
                style={{ marginBottom: 24, display: "inline-flex" }}
              >
                {person.yearsExperience}+ års erfaring
              </span>
              <h1>{person.name}</h1>
              <div className="role">{person.role}</div>

              <div className="meta-strip">
                <div>
                  <div className="key">Telefon</div>
                  <div className="val">
                    <a href={`tel:${person.phone.replace(/\s/g, "")}`}>
                      {person.phone}
                    </a>
                  </div>
                </div>
                {person.email && (
                  <div>
                    <div className="key">E-post</div>
                    <div className="val">
                      <a href={`mailto:${person.email}`}>{person.email}</a>
                    </div>
                  </div>
                )}
                <div>
                  <div className="key">Kontor</div>
                  <div className="val">{office}</div>
                </div>
                <div>
                  <div className="key">Erfaring</div>
                  <div className="val">{person.yearsExperience}+ år</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="pe-body">
            {/* MAIN */}
            <article className="pe-main">
              <PersonMDX code={person.mdx} />

              {person.specializations.length > 0 && (
                <>
                  <h2>Fagområder.</h2>
                  <ul className="pe-spec">
                    {person.specializations.map((spec, index) => (
                      <li key={spec}>
                        <span className="sn">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="st">{spec}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {person.notableProjects &&
                person.notableProjects.length > 0 && (
                  <>
                    <h2>
                      Utvalgte <span className="italic">oppdrag.</span>
                    </h2>
                    <div className="pe-projects">
                      {person.notableProjects.map((project) => (
                        <article className="pe-project" key={project.title}>
                          <div className="year">{project.year}</div>
                          <div>
                            <h4>{project.title}</h4>
                            <p>{project.description}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                )}

              {/* Inline CTA */}
              <div
                style={{
                  marginTop: 56,
                  padding: 32,
                  border: "var(--hairline)",
                  background: "var(--accent-faint)",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 24,
                      fontWeight: 400,
                      letterSpacing: "-0.015em",
                      marginBottom: 8,
                    }}
                  >
                    Snakke direkte med {firstName}?
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--warm-grey-85)",
                      margin: 0,
                    }}
                  >
                    Han svarer telefonen selv. Ingen sentralbord.
                  </p>
                </div>
                <a
                  href={`tel:${person.phone.replace(/\s/g, "")}`}
                  className="btn btn-dark"
                  style={{ fontSize: 13, padding: "14px 24px" }}
                >
                  Ring {person.phone} <span className="arrow">→</span>
                </a>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="pe-side">
              {person.education.length > 0 && (
                <div className="block">
                  <div className="label">Utdanning</div>
                  <div className="ed">
                    {person.education.map((edu) => (
                      <div key={`${edu.degree}-${edu.year}`}>
                        <div className="degree">{edu.degree}</div>
                        <div className="school">
                          {edu.school} · {edu.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {person.certifications &&
                person.certifications.length > 0 && (
                  <div className="block">
                    <div className="label">Sertifiseringer</div>
                    <ul>
                      {person.certifications.map((cert) => (
                        <li key={cert}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {person.specializations.length > 0 && (
                <div className="block">
                  <div className="label">Spesialiseringer</div>
                  <ul>
                    {person.specializations.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="block" style={{ borderBottom: 0 }}>
                <div className="label">I bransjen siden</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 400,
                    letterSpacing: "-0.018em",
                    color: "var(--warm-grey)",
                  }}
                >
                  {formatStarted(person.startedAt)}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* OTHER TEAM */}
      {others.length > 0 && (
        <section className="section-tight" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <div className="head-compact">
              <span className="eyebrow">Resten av teamet</span>
              <div>
                <h2>
                  Møt de andre <span className="italic">partnerne.</span>
                </h2>
              </div>
            </div>

            <div className="pe-others">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  className="pe-other"
                  href={`/personer/${other.slug}`}
                >
                  <div className="ip">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={other.avatar} alt={other.name} />
                  </div>
                  <div>
                    <h4>{other.name}</h4>
                    <div className="r">{other.role}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaStrip
        eyebrow="Klar for en samtale?"
        title={
          <>
            Få konkret rådgivning <br />
            <span className="italic">på din eiendom.</span>
          </>
        }
        sub={`${firstName} setter av tid til en uforpliktende samtale. Du beskriver kort hva det gjelder, så foreslår vi neste steg.`}
        primary={{ label: "Send henvendelse", href: "/kontakt" }}
        secondary={{
          label: "Bestill verdivurdering",
          href: "/tjenester/verdivurdering",
        }}
      />
    </>
  );
}
