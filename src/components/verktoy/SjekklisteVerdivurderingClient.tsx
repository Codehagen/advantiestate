"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { subscribeNewsletter } from "@/app/actions/newsletter";

type Req = "must" | "nice";

interface ChecklistItem {
  id: string;
  title: string;
  hint: string;
  req: Req;
}

interface ChecklistGroup {
  num: string;
  /** Title split so the second half renders in the editorial italic. */
  titleLead: string;
  titleEm: string;
  items: ChecklistItem[];
}

const GROUPS: ChecklistGroup[] = [
  {
    num: "01",
    titleLead: "Eiendoms",
    titleEm: "informasjon",
    items: [
      {
        id: "matrikkel",
        title: "Matrikkelinformasjon",
        hint: "Gårds- og bruksnummer, kommune og eventuelt seksjonsnummer.",
        req: "must",
      },
      {
        id: "areal",
        title: "Arealoppgave",
        hint: "Utleibart areal (BTA/BRA), gjerne fordelt på etasjer og leietakere.",
        req: "must",
      },
      {
        id: "eierform",
        title: "Eierform og tomt",
        hint: "Selveier eller festetomt, tomtestørrelse og ev. festeavtale.",
        req: "must",
      },
      {
        id: "byggeaar",
        title: "Byggeår og historikk",
        hint: "Oppføringsår samt påbygg, seksjonering eller rehabilitering.",
        req: "nice",
      },
      {
        id: "tegninger",
        title: "Plan- og situasjonstegninger",
        hint: "Plantegninger pr. etasje og situasjonsplan for tomten.",
        req: "nice",
      },
    ],
  },
  {
    num: "02",
    titleLead: "Leie og ",
    titleEm: "kontrakter",
    items: [
      {
        id: "leiekontrakter",
        title: "Gjeldende leiekontrakter",
        hint: "Alle signerte leieavtaler som gjelder i dag, med vedlegg.",
        req: "must",
      },
      {
        id: "rentroll",
        title: "Leieoversikt (rent roll)",
        hint: "Leietaker, areal, årlig leie, løpetid og utløpsdato samlet i én oversikt.",
        req: "must",
      },
      {
        id: "indeks",
        title: "Indeksreguleringsvilkår",
        hint: "KPI-klausuler og hvor stor andel av leien som reguleres.",
        req: "nice",
      },
      {
        id: "opsjoner",
        title: "Opsjoner og oppsigelsesvilkår",
        hint: "Forlengelses- og exit-klausuler som påvirker kontantstrømmen.",
        req: "nice",
      },
      {
        id: "ledige",
        title: "Ledige arealer",
        hint: "Oversikt over ledige lokaler og forventet markedsleie.",
        req: "nice",
      },
    ],
  },
  {
    num: "03",
    titleLead: "Økonomi og ",
    titleEm: "regnskap",
    items: [
      {
        id: "driftsregnskap",
        title: "Driftsregnskap siste 2–3 år",
        hint: "Regnskap for eiendommen, eller selskapets dersom single-purpose.",
        req: "must",
      },
      {
        id: "eierkostnader",
        title: "Oversikt over eierkostnader",
        hint: "Drift, vedlikehold, forvaltning og forsikring — faktiske tall.",
        req: "must",
      },
      {
        id: "eiendomsskatt",
        title: "Eiendomsskatt og kommunale avgifter",
        hint: "Siste faktura/utskrift på eiendomsskatt, renovasjon, vann og avløp.",
        req: "nice",
      },
      {
        id: "felleskostnader",
        title: "Felleskostnader og avregning",
        hint: "Hvordan felleskostnader fordeles og avregnes mot leietakerne.",
        req: "nice",
      },
      {
        id: "capex",
        title: "Planlagte investeringer (capex)",
        hint: "Kjente, kommende investeringsbehov og budsjett for disse.",
        req: "nice",
      },
    ],
  },
  {
    num: "04",
    titleLead: "Teknisk ",
    titleEm: "tilstand",
    items: [
      {
        id: "tilstandsrapport",
        title: "Tilstandsrapport",
        hint: "Teknisk tilstandsvurdering eller due diligence, dersom utført.",
        req: "nice",
      },
      {
        id: "vedlikeholdsplan",
        title: "Vedlikeholdsplan og etterslep",
        hint: "Kjent vedlikeholdsbehov og plan for de neste årene.",
        req: "nice",
      },
      {
        id: "energiattest",
        title: "Energiattest",
        hint: "Gyldig energimerking (EPC) for bygget.",
        req: "nice",
      },
      {
        id: "oppgraderinger",
        title: "Dokumentasjon på oppgraderinger",
        hint: "Nylige arbeider på tak, fasade, ventilasjon eller tekniske anlegg.",
        req: "nice",
      },
    ],
  },
  {
    num: "05",
    titleLead: "Juridisk og ",
    titleEm: "offentlig",
    items: [
      {
        id: "grunnbok",
        title: "Grunnboksutskrift",
        hint: "Tinglyste heftelser, servitutter og pant på eiendommen.",
        req: "must",
      },
      {
        id: "regulering",
        title: "Reguleringsplan / arealformål",
        hint: "Gjeldende regulering og eventuelle utviklingsmuligheter.",
        req: "nice",
      },
      {
        id: "forsikring",
        title: "Forsikringsavtale",
        hint: "Gjeldende bygningsforsikring med forsikringssum og vilkår.",
        req: "nice",
      },
      {
        id: "paalegg",
        title: "Pålegg eller tvister",
        hint: "Eventuelle offentlige pålegg, nabosaker eller pågående tvister.",
        req: "nice",
      },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);
const TOTAL = ALL_ITEMS.length;
const MUST_TOTAL = ALL_ITEMS.filter((i) => i.req === "must").length;
const STORAGE_KEY = "advanti-vv-sjekkliste-v1";

type CheckedState = Record<string, boolean>;

type CaptureStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "ok"; alreadySubscribed: boolean }
  | { state: "error"; message: string };

export function SjekklisteVerdivurderingClient() {
  const [checked, setChecked] = useState<CheckedState>({});
  const [email, setEmail] = useState("");
  const [capture, setCapture] = useState<CaptureStatus>({ state: "idle" });

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (capture.state === "submitting") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCapture({ state: "error", message: "Oppgi en gyldig e-postadresse." });
      return;
    }
    setCapture({ state: "submitting" });
    try {
      // Reuse the shared subscribe action — lands the lead in Resend (audience
      // + welcome email), pings Discord, and records to Supabase, all keyed to
      // the "sjekkliste-verdivurdering" source.
      const fd = new FormData();
      fd.set("email", email);
      fd.set("source", "sjekkliste-verdivurdering");
      fd.set("pageUrl", window.location.href);
      const result = await subscribeNewsletter({ status: "idle" }, fd);
      if (result.status === "success") {
        setCapture({ state: "ok", alreadySubscribed: result.alreadySubscribed });
      } else {
        setCapture({
          state: "error",
          message:
            result.status === "error"
              ? result.message
              : "Noe gikk galt. Prøv igjen.",
        });
      }
    } catch {
      setCapture({ state: "error", message: "Noe gikk galt. Prøv igjen." });
    }
  }

  // Load saved state after mount — keeps the server render (all unchecked)
  // and the first client render identical, so there is no hydration mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as CheckedState);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [checked]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const reset = () => {
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const stats = useMemo(() => {
    const done = ALL_ITEMS.filter((i) => checked[i.id]).length;
    const mustDone = ALL_ITEMS.filter(
      (i) => i.req === "must" && checked[i.id],
    ).length;
    const pct = TOTAL ? Math.round((done / TOTAL) * 100) : 0;
    return { done, mustDone, pct };
  }, [checked]);

  return (
    <div className="chk-grid">
      {/* LIST */}
      <div className="chk-list">
        {GROUPS.map((group) => {
          const groupDone = group.items.filter((i) => checked[i.id]).length;
          return (
            <div className="chk-group" key={group.num}>
              <div className="g-head">
                <span className="g-num">{group.num}</span>
                <span className="g-title">
                  {group.titleLead}
                  <span className="italic">{group.titleEm}</span>
                </span>
                <span className="g-count">
                  {groupDone} / {group.items.length}
                </span>
              </div>

              {group.items.map((item) => (
                <label className="chk-item" key={item.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={() => toggle(item.id)}
                  />
                  <span className="box" aria-hidden="true" />
                  <span className="txt">
                    <span className="t">
                      {item.title}
                      <span className={`tag ${item.req}`}>
                        {item.req === "must" ? "Må ha" : "Bra å ha"}
                      </span>
                    </span>
                    <span className="h">{item.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          );
        })}
      </div>

      {/* PROGRESS */}
      <div className="chk-progress">
        <div className="p-lbl">Din forberedelse</div>
        <div className="p-pct">
          {stats.pct}
          <span className="u">%</span>
        </div>
        <div className="p-sub">
          {stats.done} av {TOTAL} punkter krysset av
        </div>

        <div className="p-bar">
          <div className="fill" style={{ "--fill": stats.pct / 100 } as CSSProperties} />
        </div>

        <div className="p-must">
          <span>Må ha-dokumenter</span>
          <span
            className={`v${stats.mustDone >= MUST_TOTAL ? " done" : ""}`}
          >
            {stats.mustDone} / {MUST_TOTAL}
          </span>
        </div>

        {capture.state === "ok" ? (
          <div className="p-capture">
            <p className="c-msg ok">
              {capture.alreadySubscribed
                ? "Du er allerede på listen vår — en av partnerne tar kontakt for å starte verdivurderingen."
                : "Takk! Vi har mottatt henvendelsen og tar kontakt for å starte verdivurderingen."}
            </p>
          </div>
        ) : (
          <form className="p-capture" onSubmit={submitEmail}>
            <p className="c-lbl">
              Klar til å gå videre? Legg igjen e-posten din, så tar en partner
              deg gjennom verdivurderingen — uforpliktende.
            </p>
            <div className="c-row">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="din@epost.no"
                aria-label="E-postadresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="p-cta"
                disabled={capture.state === "submitting"}
              >
                {capture.state === "submitting"
                  ? "Sender …"
                  : "Start verdivurdering"}
                <span className="arrow">→</span>
              </button>
            </div>
            {capture.state === "error" && (
              <p className="c-msg err">{capture.message}</p>
            )}
          </form>
        )}

        <div className="p-actions">
          <button type="button" onClick={() => window.print()}>
            Skriv ut listen
          </button>
          <button type="button" onClick={reset}>
            Nullstill
          </button>
        </div>
        <p className="p-foot">
          Listen lagres i nettleseren din. Du trenger ikke ha alt klart for å
          starte — vi hjelper deg med å hente inn det som mangler.
        </p>
      </div>
    </div>
  );
}
