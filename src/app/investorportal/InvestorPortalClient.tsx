"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";

import {
  notifyPortalDemoLogin,
  requestInvestorAccess,
  type InvestorAccessFormState,
} from "@/app/actions/investorportal";

const STORAGE_KEY = "advanti_portal_demo_v1";
const INITIAL_FORM: InvestorAccessFormState = { status: "idle" };

type Megler = {
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
};

/**
 * Investorportalen — demo. Gateway (utlogget) viser innlogging + «be om
 * tilgang»; hub (innlogget) viser en realistisk «min side» med datarom,
 * off-market-treff og megler. Innloggingen er åpen for alle (demo), men
 * hver innlogging og tilgangsforespørsel varsler teamet via Discord-leads.
 */
export function InvestorPortalClient({ megler }: { megler: Megler }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Demo-tilstanden lever kun i localStorage; leses etter mount så
  // server- og klient-HTML er identiske.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setLoggedIn(true);
    } catch {
      /* localStorage utilgjengelig — demoen starter utlogget */
    }
  }, []);

  function logIn(email: string) {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignorer */
    }
    // Stille kjøpssignal til teamet — blokkerer aldri demoen.
    if (email) startTransition(() => notifyPortalDemoLogin(email));
    setLoggedIn(true);
    setToast(null);
    window.scrollTo(0, 0);
  }

  function logOut(anchor?: string) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignorer */
    }
    setLoggedIn(false);
    setToast(null);
    if (anchor) {
      // Gateway-en må rendres før ankeret finnes i DOM.
      requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  return (
    <>
      {loggedIn ? (
        <Hub megler={megler} onLogout={() => logOut()} onDemo={setToast} />
      ) : (
        <Gateway onLogin={logIn} />
      )}

      {toast && (
        <div className="ip-toast" role="status">
          <p>
            <strong>Demovisning.</strong> {toast}
          </p>
          <button
            type="button"
            className="cta"
            onClick={() => logOut("be-om-tilgang")}
          >
            Be om tilgang →
          </button>
          <button
            type="button"
            className="close"
            aria-label="Lukk"
            onClick={() => setToast(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

/* ============================================================
   GATEWAY — utlogget
   ============================================================ */

function Gateway({ onLogin }: { onLogin: (email: string) => void }) {
  return (
    <div>
      {/* HERO */}
      <section className="ip-hero">
        <div className="wrap">
          <nav className="crumb" aria-label="Brødsmulesti">
            <Link href="/">Hjem</Link>
            <span className="sep">/</span>
            <span className="here">Investorportal</span>
          </nav>
          <div className="ip-hero-grid">
            <div>
              <span className="pre">For kvalifiserte kjøpere</span>
              <h1>
                Én sikker inngang til{" "}
                <span className="italic">alle dine prosesser.</span>
              </h1>
            </div>
            <p className="lede">
              Investorportalen samler dine datarom, NDA-er, dokumenter og
              off-market-treff på ett sted.{" "}
              <strong>Logg inn for å fortsette</strong> der du slapp — eller be
              om tilgang om du er ny.
            </p>
          </div>
        </div>
      </section>

      {/* ACCESS: innlogging + be om tilgang */}
      <section className="ip-access" id="logg-inn">
        <div className="wrap">
          <div className="ip-access-grid">
            <LoginCard onLogin={onLogin} />
            <RequestAccessCard />
          </div>
        </div>
      </section>

      {/* HVA DU FÅR TILGANG TIL */}
      <section className="ip-inside">
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">Innhold</span>
            <div>
              <h2>
                Hva du får tilgang <span className="italic">til.</span>
              </h2>
              <p>
                Alt du trenger for å vurdere et oppdrag — fra første teaser til
                signert bud — i ett kryptert miljø.
              </p>
            </div>
          </div>
          <div className="ip-inside-grid">
            <div className="ip-in">
              <div className="num">01</div>
              <h3>Datarom (DD)</h3>
              <p>
                Strukturerte due diligence-rom med leiekontrakter, teknisk
                dokumentasjon, økonomi og Q&amp;A — per oppdrag.
              </p>
            </div>
            <div className="ip-in">
              <div className="num">02</div>
              <h3>Off-market-treff</h3>
              <p>
                Konfidensielle oppdrag kuratert mot ditt mandat — ofte uker før
                de annonseres åpent.
              </p>
            </div>
            <div className="ip-in">
              <div className="num">03</div>
              <h3>Digital signering</h3>
              <p>
                NDA og budskjema signeres digitalt i portalen. Full oversikt
                over status og historikk.
              </p>
            </div>
            <div className="ip-in">
              <div className="num">04</div>
              <h3>Din megler</h3>
              <p>
                Direkte linje til senior megler på hvert oppdrag — spørsmål
                besvares uten omveier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST-STRIPE */}
      <section className="ip-trust">
        <div className="wrap">
          <div className="ip-trust-inner">
            <div className="t">
              Bygget for <span className="italic">diskresjon</span> og
              kontroll.
            </div>
            <div className="ip-trust-points">
              <div className="pt">
                <span className="k">Tilgang</span>
                <span className="v">Invitasjon + verifisering</span>
              </div>
              <div className="pt">
                <span className="k">Konfidensialitet</span>
                <span className="v">NDA før detaljer deles</span>
              </div>
              <div className="pt">
                <span className="k">Sporbarhet</span>
                <span className="v">Logg på all dokumenttilgang</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginCard({ onLogin }: { onLogin: (email: string) => void }) {
  return (
    <form
      className="ip-card"
      onSubmit={(event) => {
        event.preventDefault();
        const email = String(
          new FormData(event.currentTarget).get("epost") ?? "",
        ).trim();
        onLogin(email);
      }}
    >
      <span className="pre">Logg inn</span>
      <h2>
        Velkommen <span className="italic">tilbake.</span>
      </h2>
      <p className="sub">
        Bruk e-posten du registrerte mandatet med. Førstegangstilgang får du
        via lenken i invitasjonen fra megler.
      </p>

      <div className="ip-field">
        <label htmlFor="ipEpost">E-post</label>
        <input
          id="ipEpost"
          name="epost"
          type="email"
          placeholder="ola.nordmann@firma.no"
          autoComplete="email"
        />
      </div>
      <div className="ip-field">
        <label htmlFor="ipKode">Passord / engangskode</label>
        <input
          id="ipKode"
          name="kode"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <div className="ip-login-row">
        <label className="ip-remember">
          <input type="checkbox" defaultChecked /> Husk meg
        </label>
        <a
          href="mailto:Christer@advantiestate.no?subject=Glemt%20tilgang%20investorportal"
          className="ip-forgot"
        >
          Glemt tilgang?
        </a>
      </div>

      <button type="submit" className="ip-btn">
        Logg inn <span className="arrow">→</span>
      </button>
      <p className="ip-demo-note">
        Demo — fyll inn hva som helst for å se portalen.
      </p>
    </form>
  );
}

function RequestAccessCard() {
  const [state, formAction, pending] = useActionState(
    requestInvestorAccess,
    INITIAL_FORM,
  );

  return (
    <aside className="ip-card ip-request" id="be-om-tilgang">
      <span className="pre">Ny her?</span>
      <h2>Be om tilgang.</h2>
      <p className="sub">
        Tilgang gis til kvalifiserte kjøpere etter en kort vurdering av senior
        megler.
      </p>
      <ul>
        <li>
          <span className="ico">✓</span>
          <span>Registrer kjøpsmandat på under tre minutter.</span>
        </li>
        <li>
          <span className="ico">✓</span>
          <span>Manuell vurdering og verifisering innen 48 timer.</span>
        </li>
        <li>
          <span className="ico">✓</span>
          <span>Invitasjon med personlig tilgang til portalen.</span>
        </li>
      </ul>

      {state.status === "success" ? (
        <p role="status" className="ip-form-ok">
          Takk — forespørselen er mottatt. Senior megler vurderer den og tar
          kontakt innen 48 timer.
        </p>
      ) : (
        <form action={formAction} style={{ marginTop: "auto" }}>
          <div className="ip-field">
            <label htmlFor="ipNavn">Navn</label>
            <input
              id="ipNavn"
              name="name"
              type="text"
              placeholder="Ola Nordmann"
              autoComplete="name"
              required
            />
          </div>
          <div className="ip-field">
            <label htmlFor="ipReqEpost">E-post</label>
            <input
              id="ipReqEpost"
              name="email"
              type="email"
              placeholder="ola.nordmann@firma.no"
              autoComplete="email"
              required
            />
          </div>
          <div className="ip-field">
            <label htmlFor="ipSelskap">Selskap (valgfritt)</label>
            <input
              id="ipSelskap"
              name="company"
              type="text"
              placeholder="Firma AS"
              autoComplete="organization"
            />
          </div>
          <button type="submit" className="ghost" disabled={pending}>
            {pending ? "Sender …" : "Be om tilgang"}{" "}
            <span className="arrow">→</span>
          </button>
          {state.status === "error" && (
            <p role="alert" className="ip-form-err">
              {state.message}
            </p>
          )}
        </form>
      )}
    </aside>
  );
}

/* ============================================================
   HUB — innlogget (demo-innhold)
   ============================================================ */

function Hub({
  megler,
  onLogout,
  onDemo,
}: {
  megler: Megler;
  onLogout: () => void;
  onDemo: (message: string) => void;
}) {
  return (
    <div>
      <section className="ip-hub-head">
        <div className="wrap">
          <div className="row">
            <div>
              <div className="pre">Investorportal · Min side</div>
              <h1>
                Velkommen tilbake, <span className="italic">Ola.</span>
              </h1>
              <div className="mandate">
                <span className="chip">
                  <strong>Mandat:</strong> Kontor · Logistikk
                </span>
                <span className="chip">
                  <strong>Geografi:</strong> Tromsø · Bodø
                </span>
                <span className="chip">
                  <strong>Ticket:</strong> 100–250 mnok
                </span>
                <span className="chip">
                  <strong>Yield:</strong> 6,5–7,5 %
                </span>
              </div>
            </div>
            <button type="button" className="ip-logout" onClick={onLogout}>
              Logg ut <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="ip-hub-body">
        <div className="wrap">
          <div className="ip-hub-grid">
            {/* HOVEDKOLONNE */}
            <div>
              <div className="ip-sec-head">
                <h2>Dine aktive prosesser</h2>
                <span className="count">2 oppdrag</span>
              </div>
              <div className="ip-proc">
                {/* Ekte oppdrag — lenker til faktisk prospektside */}
                <Link
                  href="/eiendommer/bodo-byport-stormyra"
                  className="ip-proc-card"
                >
                  <div className="thumb">
                    <Image
                      src="/building/pexels-building-10156174.jpg"
                      alt="Bodø Byport — utviklingsområde på Stormyra"
                      fill
                      sizes="132px"
                    />
                  </div>
                  <div className="info">
                    <div className="addr">Stormyrveien 49–61 · 8008 Bodø</div>
                    <h3>Bodø Byport — utviklingstomt på Stormyra</h3>
                    <div className="meta">
                      <span>18&nbsp;700 m²</span>
                      <span>
                        Type <b>Utvikling · Handel</b>
                      </span>
                      <span>
                        Status <b>Til salgs</b>
                      </span>
                    </div>
                  </div>
                  <div className="right">
                    <span className="ip-status open">
                      <span className="dot" />
                      Datarom åpent
                    </span>
                    <span className="go">
                      Åpne prospekt <span className="arrow">→</span>
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  className="ip-proc-card"
                  onClick={() =>
                    onDemo(
                      "I den fulle portalen signerer du NDA-er digitalt rett i nettleseren.",
                    )
                  }
                >
                  <div className="thumb">
                    <Image
                      src="/building/pexels-pixabay-248877.jpg"
                      alt="Sjøgata 7, Tromsø"
                      fill
                      sizes="132px"
                    />
                  </div>
                  <div className="info">
                    <div className="addr">Sjøgata 7 · 9008 Tromsø</div>
                    <h3>Kontortårn med fri sjøutsikt</h3>
                    <div className="meta">
                      <span>11&nbsp;400 m²</span>
                      <span>
                        Yield <b>6,8 %</b>
                      </span>
                      <span>Off-market</span>
                    </div>
                  </div>
                  <div className="right">
                    <span className="ip-status pending">
                      <span className="dot" />
                      NDA venter signering
                    </span>
                    <span className="go">
                      Signer NDA <span className="arrow">→</span>
                    </span>
                  </div>
                </button>
              </div>

              <div className="ip-sec-head">
                <h2>Nye off-market-treff</h2>
                <span className="count">3 mot ditt mandat</span>
              </div>
              <div className="ip-match">
                {[
                  {
                    title: "Logistikkanlegg, Bodø lufthavn",
                    areal: "14 200",
                    yield: "7,1",
                  },
                  {
                    title: "Handelspark, Tromsdalen",
                    areal: "9 800",
                    yield: "6,9",
                  },
                  {
                    title: "Kontorbygg, Harstad sentrum",
                    areal: "5 400",
                    yield: "7,3",
                  },
                ].map((m) => (
                  <div key={m.title} className="ip-match-card">
                    <span className="lock">Teaser · krever NDA</span>
                    <h4>{m.title}</h4>
                    <div className="stats">
                      <div>
                        <span className="v">
                          {m.areal}
                          <span className="u">m²</span>
                        </span>
                        <span className="l">Areal</span>
                      </div>
                      <div>
                        <span className="v">
                          {m.yield}
                          <span className="u">%</span>
                        </span>
                        <span className="l">Yield</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ask"
                      onClick={() =>
                        onDemo(
                          "Teasere deles med verifiserte kjøpere etter signert NDA.",
                        )
                      }
                    >
                      Be om teaser →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDEKOLONNE */}
            <aside className="ip-aside">
              <div className="ip-aside-card dark">
                <div className="pre">Din megler</div>
                <div className="ip-meg">
                  <div className="pic">
                    {megler.avatar && (
                      <Image
                        src={megler.avatar}
                        alt={megler.name}
                        fill
                        sizes="54px"
                      />
                    )}
                  </div>
                  <div>
                    <h4>{megler.name}</h4>
                    <div className="role">{megler.role}</div>
                  </div>
                </div>
                <div className="ip-meg-ch">
                  <a href={`tel:${megler.phone.replace(/\s/g, "")}`}>
                    <span className="key">Telefon</span>
                    <span>{megler.phone}</span>
                  </a>
                  <a href={`mailto:${megler.email}`}>
                    <span className="key">E-post</span>
                    <span>{megler.email}</span>
                  </a>
                </div>
              </div>

              <div className="ip-aside-card">
                <div className="pre">Dine dokumenter</div>
                <div className="ip-doc">
                  <button
                    type="button"
                    onClick={() =>
                      onDemo(
                        "Signerte dokumenter lagres med full historikk i portalen.",
                      )
                    }
                  >
                    <span>NDA — Sjøgata 7 (signert)</span>
                    <span className="ext">PDF</span>
                  </button>
                  <Link href="/eiendommer/bodo-byport-stormyra">
                    <span>Prospekt — Bodø Byport</span>
                    <span className="ext">WEB</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      onDemo(
                        "Tekniske DD-rapporter deles per oppdrag i datarommet.",
                      )
                    }
                  >
                    <span>Teknisk DD-rapport</span>
                    <span className="ext">PDF</span>
                  </button>
                  <Link href="/markedsrapport">
                    <span>Markedsrapport Q4 2025</span>
                    <span className="ext">PDF</span>
                  </Link>
                </div>
              </div>

              <div className="ip-aside-card">
                <div className="pre">Ditt mandat</div>
                <div className="ip-mandate-mini">
                  <div className="ln">
                    <span>Type</span>
                    <b>Kontor · Logistikk</b>
                  </div>
                  <div className="ln">
                    <span>Geografi</span>
                    <b>Tromsø · Bodø</b>
                  </div>
                  <div className="ln">
                    <span>Ticket-size</span>
                    <b>100–250 mnok</b>
                  </div>
                  <div className="ln">
                    <span>Yield-krav</span>
                    <b>6,5–7,5 %</b>
                  </div>
                </div>
                <button
                  type="button"
                  className="edit"
                  onClick={() =>
                    onDemo(
                      "Mandatet ditt styrer hvilke off-market-treff du får — det oppdaterer du sammen med megler.",
                    )
                  }
                >
                  Oppdater mandat →
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
