import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  path: "/presentasjon",
  noIndex: true, // internal sales deck — not for the organic index
  title: "Advanti Estate — Presentasjon | Næringsmegling Nord-Norge",
  description:
    "Advanti Estate er din partner for kjøp, salg og utleie av næringseiendom i Nord-Norge.",
});

const slides = [
  {
    title: "Advanti Estate",
    subtitle: "Næringsmegling i Nord-Norge",
    content: [
      "Din partner for kjøp, salg og utleie av næringseiendom",
      "Lokal tilstedeværelse i Bodø og Alta — hele Nord-Norge",
      "Off-market salg, mulighetsstudier og strategisk rådgivning",
    ],
    accent: "from-blue-500 to-indigo-600",
  },
  {
    title: "Våre tjenester",
    content: [
      "Salg av næringseiendom — åpent og off-market",
      "Kjøpsmegling — vi finner riktig eiendom for deg",
      "Utleieformidling — ledige lokaler til rett leietaker",
      "Verdivurdering — markedstilpassede takster",
      "Strategisk rådgivning — mulighetsstudier og utvikling",
    ],
    accent: "from-emerald-500 to-teal-600",
  },
  {
    title: "Vår tilstedeværelse",
    content: [
      "Christer Hagen — Bodø / Salten",
      "Mathias Nilssen — Bodø / Salten",
      "Håvard Nome — Alta / Vest-Finnmark",
      "Daniel Adamsen — Alta / Vest-Finnmark",
      "Viktor (AI) — alltid pålogget",
    ],
    accent: "from-amber-500 to-orange-600",
  },
  {
    title: "Hvorfor advanti?",
    content: [
      "Lokal kunnskap — vi kjenner markedet, aktørene og mulighetene",
      "Off-market — tilgang til objekter før de når det åpne markedet",
      "Moderne markedsføring — 3D-visualisering, mulighetsstudier",
      "Nettverk — tette relasjoner til kjøpere, selgere og investorer",
      "Effektiv prosess — fra verdivurdering til signering",
    ],
    accent: "from-purple-500 to-pink-600",
  },
  {
    title: "Kontakt oss",
    content: [
      "Christer Hagen — christer@advantiestate.no",
      "Mathias Nilssen — mathias@advantiestate.no",
      "Håvard Nome — havard@advantiestate.no",
      "Daniel Adamsen — daniel@advantiestate.no",
      "",
      "www.advantiestate.no",
    ],
    accent: "from-sky-500 to-cyan-600",
  },
];

export default function PresentationPage() {
  return (
    <div className="relative flex flex-col">
      {/* Full-screen slides */}
      {slides.map((slide, idx) => (
        <section
          key={idx}
          className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-20"
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-[0.03]`}
          />

          {/* Animated background circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="animate-slide-up-fade absolute -left-32 -top-32 h-96 w-96 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
                animationDuration: "1.5s",
                animationFillMode: "backwards",
                animationDelay: `${idx * 0.2}s`,
              }}
            />
            <div
              className="animate-slide-up-fade absolute -bottom-32 -right-32 h-96 w-96 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
                animationDuration: "1.5s",
                animationFillMode: "backwards",
                animationDelay: `${idx * 0.2 + 0.3}s`,
              }}
            />
          </div>

          {/* Slide number */}
          <div
            className="animate-slide-up-fade absolute left-8 top-8 text-sm font-mono text-warm-grey-2"
            style={{
              animationDuration: "0.6s",
              animationFillMode: "backwards",
              animationDelay: `${idx * 0.2}s`,
            }}
          >
            {String(idx + 1).padStart(2, "0")}
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto w-full max-w-4xl">
            {/* Title */}
            <h1
              className="animate-slide-up-fade text-4xl font-bold tracking-tight text-warm-grey sm:text-6xl lg:text-7xl"
              style={{
                animationDuration: "0.8s",
                animationFillMode: "backwards",
                animationDelay: `${idx * 0.2 + 0.1}s`,
              }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            {slide.subtitle && (
              <p
                className="animate-slide-up-fade mt-4 max-w-2xl text-lg text-warm-grey-2 sm:text-xl"
                style={{
                  animationDuration: "0.8s",
                  animationFillMode: "backwards",
                  animationDelay: `${idx * 0.2 + 0.2}s`,
                }}
              >
                {slide.subtitle}
              </p>
            )}

            {/* Bullet points */}
            <ul className="mt-10 space-y-4">
              {slide.content.map((item, i) =>
                item ? (
                  <li
                    key={i}
                    className="animate-slide-up-fade flex items-start gap-4 text-lg sm:text-xl"
                    style={{
                      animationDuration: "0.6s",
                      animationFillMode: "backwards",
                      animationDelay: `${idx * 0.2 + 0.3 + i * 0.1}s`,
                    }}
                  >
                    <span
                      className={`mt-1.5 block h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${slide.accent}`}
                    />
                    <span className="text-warm-grey">
                      {item}
                    </span>
                  </li>
                ) : (
                  <li key={i} className="h-4" />
                )
              )}
            </ul>
          </div>

          {/* Scroll indicator */}
          {idx < slides.length - 1 && (
            <div
              className="animate-slide-up-fade absolute bottom-8 left-1/2 -translate-x-1/2"
              style={{
                animationDuration: "1s",
                animationFillMode: "backwards",
                animationDelay: `${idx * 0.2 + 1}s`,
              }}
            >
              <div className="flex flex-col items-center gap-2 text-xs text-warm-grey-2">
                <svg
                  className="h-5 w-5 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  Scroll
                </span>
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
