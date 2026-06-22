import { allCustomersPosts } from "content-collections";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MDX } from "@/components/blog/mdx";
import { CtaStrip } from "@/components/site/CtaStrip";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getBlurDataURL } from "@/lib/blog/images";
import { constructMetadata } from "@/lib/utils";
import { getCustomerPost } from "@/lib/content";

// Editorial presentation extras for the case study layout. Optional — any
// customer not listed still renders fully from the content collection.
const PRESENTATION: Record<
  string,
  {
    eyebrow: string;
    heroImage: string;
    heroImageAlt: string;
    metaPeriod: string;
    metaService?: string;
    metaProperty?: string;
    metaLocation?: string;
    results?: { value: string; unit?: string; label: string }[];
    advisors?: { name: string; role: string; avatar: string; slug?: string }[];
  }
> = {
  "morkvedbadet-bodo": {
    eyebrow: "Case study · Salg",
    heroImage: "/building/pexels-abshky-18567185.jpg",
    heroImageAlt: "Mørkvedbadet, Bodø (illustrasjonsfoto)",
    metaPeriod: "2025 · ca. 5 måneder",
    metaService: "Salgsoppdrag",
    metaProperty: "Bade- og treningsanlegg · 3\u00A0005\u00A0m² BRA",
    metaLocation: "Mørkved, Bodø",
    results: [
      { value: ">60", unit: "MNOK", label: "Transaksjonsverdi" },
      { value: "3\u00A0005", unit: "m²", label: "BRA, to bygg" },
      { value: "5", unit: "mnd", label: "Fra mandat til salg" },
    ],
  },
  "naeringspark-helgeland": {
    eyebrow: "Case study · Salg",
    heroImage: "/building/pexels-expect-best-79873-351262.jpg",
    heroImageAlt: "Lager- og logistikkpark (illustrasjonsfoto)",
    metaPeriod: "2025",
    metaService: "Salgsoppdrag",
    metaProperty: "Lager- og logistikkpark",
    metaLocation: "Helgeland",
    results: [
      { value: "35–40", unit: "MNOK", label: "Transaksjonsverdi" },
      { value: "~8", unit: "%", label: "Yield" },
      { value: "100", unit: "%", label: "Utleiegrad ved gjennomføring" },
    ],
  },
  "reforhandling-kontor-bodo": {
    eyebrow: "Illustrasjonscase · Reforhandling",
    heroImage: "/building/pexels-pixabay-248877.jpg",
    heroImageAlt: "Kontorbygg (illustrasjonsfoto)",
    metaPeriod: "Eksempel",
    metaService: "Reforhandling av leiekontrakter",
    metaProperty: "Kontorbygg",
    metaLocation: "Bodø",
    results: [
      { value: "3\u00A0000", unit: "kr/m²", label: "Ny årsleie per m² — fra 1\u00A0500" },
      { value: "2×", label: "Leienivå etter reforhandling, med lengre bindingstid" },
    ],
  },
};

export async function generateStaticParams() {
  return allCustomersPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = getCustomerPost(slug);
  if (!post) {
    return;
  }

  const { title, seoTitle, summary, image } = post;

  return constructMetadata({
    title: `${seoTitle ?? title} – Advanti`,
    description: summary,
    image,
    path: `/kunder/${post.slug}`,
  });
}

export default async function CustomerStory({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  const data = getCustomerPost(slug);
  if (!data) {
    notFound();
  }

  // Blur placeholders for the MDX body images. (A previous getBlurDataURL(
  // data.image) call here was dead — its result was discarded by the leading
  // comma and data.image's blur is never used — so it has been removed.)
  const images = await Promise.all(
    data.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    })),
  );

  const pres = PRESENTATION[data.slug];
  const companyInitial = data.company.charAt(0).toUpperCase();
  const hasCompanyUrl =
    !!data.companyUrl && data.companyUrl.trim().length > 0;
  const companyUrlLabel = hasCompanyUrl
    ? data.companyUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <>
      <div className="page-pad" />

      {/* HERO */}
      <section className="subhero" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <Breadcrumbs
            path={`/kunder/${data.slug}`}
            leafLabel={data.company}
          />

          <div className="op-hero">
            <div>
              <div className="company">
                <div className="logo">{companyInitial}</div>
                <div className="text">
                  <strong>{data.company}</strong>
                  <div>
                    {data.companyIndustry}
                    {pres?.metaLocation ? ` · ${pres.metaLocation}` : ""}
                    {data.companyFounded
                      ? ` · Etablert ${data.companyFounded}`
                      : ""}
                  </div>
                </div>
              </div>

              {pres?.eyebrow && (
                <span
                  className="eyebrow"
                  style={{ marginBottom: 24, display: "inline-flex" }}
                >
                  {pres.eyebrow}
                </span>
              )}
              <h1>{data.title}</h1>
              <p className="lead">{data.summary}</p>

              <div
                className="meta-strip"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                <div>
                  <div className="key">Tjeneste</div>
                  <div className="val">{pres?.metaService ?? data.plan}</div>
                </div>
                {pres?.metaProperty && (
                  <div>
                    <div className="key">Eiendom</div>
                    <div className="val">{pres.metaProperty}</div>
                  </div>
                )}
                {pres?.metaLocation && (
                  <div>
                    <div className="key">Lokasjon</div>
                    <div className="val">{pres.metaLocation}</div>
                  </div>
                )}
                {pres?.metaPeriod && (
                  <div>
                    <div className="key">Periode</div>
                    <div className="val">{pres.metaPeriod}</div>
                  </div>
                )}
              </div>
            </div>

            {pres?.heroImage && (
              <div className="img">
                <Image
                  src={pres.heroImage}
                  alt={pres.heroImageAlt}
                  width={720}
                  height={900}
                  priority
                  sizes="(max-width: 980px) 100vw, 720px"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      {pres?.results && pres.results.length > 0 && (
        <section className="op-results">
          <div className="wrap">
            <div className="head">
              <div className="pre">Resultater</div>
              <h2>
                Oppnådd <span className="italic">resultat.</span>
              </h2>
            </div>
            <div className="kpis" data-count={pres.results.length}>
              {pres.results.map((result) => (
                <div className="k" key={result.label}>
                  <div className="v">
                    {result.value}
                    {result.unit && (
                      <span className="unit">{result.unit}</span>
                    )}
                  </div>
                  <div className="l">{result.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BODY */}
      <section className="section-tight" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="ks-article">
            <article className="ks-art-body" style={{ maxWidth: 760 }}>
              <MDX code={data.mdx} images={images} />
            </article>

            {/* SIDEBAR */}
            <aside className="ks-toc">
              <div className="toc-label">Klient</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  paddingBottom: 24,
                  borderBottom: "var(--hairline)",
                  marginBottom: 24,
                }}
              >
                <strong style={{ fontWeight: 500 }}>{data.company}</strong>
                <span
                  style={{
                    fontSize: 12.5,
                    color: "var(--warm-grey-85)",
                  }}
                >
                  {data.companyIndustry}
                </span>
                {hasCompanyUrl && (
                  <a
                    href={data.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: 8, fontSize: 12 }}
                  >
                    {companyUrlLabel} →
                  </a>
                )}
              </div>

              {data.companyFounded > 0 && (
                <>
                  <div className="toc-label">Etablert</div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 400,
                      letterSpacing: "-0.018em",
                      paddingBottom: 24,
                      borderBottom: "var(--hairline)",
                      marginBottom: 24,
                    }}
                  >
                    {data.companyFounded}
                  </p>
                </>
              )}

              {data.companySize && data.companySize !== "—" && (
                <>
                  <div className="toc-label">Selskapsstørrelse</div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 400,
                      letterSpacing: "-0.018em",
                      paddingBottom: 24,
                      borderBottom: "var(--hairline)",
                      marginBottom: 24,
                    }}
                  >
                    {data.companySize}
                  </p>
                </>
              )}

              <div className="toc-label">Tjeneste levert</div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--warm-grey-85)",
                  lineHeight: 1.55,
                  paddingBottom: 24,
                  borderBottom: "var(--hairline)",
                  marginBottom: 24,
                }}
              >
                {data.plan}
              </p>

              {pres?.advisors && pres.advisors.length > 0 && (
                <>
                  <div className="toc-label">Rådgivere</div>
                  <div className="cy-side-team">
                    {pres.advisors.map((advisor) => {
                      const card = (
                        <>
                          <div
                            className="av"
                            style={{
                              backgroundImage: `url('${advisor.avatar}')`,
                            }}
                          />
                          <div>
                            <div className="name">{advisor.name}</div>
                            <div className="role">{advisor.role}</div>
                          </div>
                        </>
                      );
                      return advisor.slug ? (
                        <Link
                          key={advisor.name}
                          className="member"
                          href={`/personer/${advisor.slug}`}
                        >
                          {card}
                        </Link>
                      ) : (
                        <div key={advisor.name} className="member">
                          {card}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="Har du et lignende oppdrag?"
        title={
          <>
            Snakk med en partner <br />
            <span className="italic">om ditt prosjekt.</span>
          </>
        }
        sub="Vi tar en konfidensiell samtale uten forpliktelser. Lever en kort beskrivelse av prosjektet, så foreslår vi neste steg."
        primary={{ label: "Send henvendelse", href: "/kontakt" }}
        secondary={{ label: "Se flere oppdrag", href: "/kunder" }}
      />
    </>
  );
}
