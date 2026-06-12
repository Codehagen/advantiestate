import Link from "next/link";

const TJENESTER = [
  { href: "/tjenester/verdivurdering", label: "Verdivurdering" },
  { href: "/tjenester/salg", label: "Salg" },
  { href: "/tjenester/transaksjoner", label: "Transaksjonsrådgivning" },
  { href: "/tjenester/utleie", label: "Utleie" },
  { href: "/tjenester/radgivning", label: "Markedsdata" },
  { href: "/tjenester/strategisk-radgivning", label: "Strategisk rådgivning" },
];

const ADVANTI = [
  { href: "/om-oss", label: "Om oss" },
  { href: "/kunder", label: "Utvalgte oppdrag" },
  { href: "/markedsinnsikt", label: "Markedsinnsikt" },
  { href: "/analyseportal", label: "Analyseportal" },
  { href: "/investorportal", label: "Investorportal" },
  { href: "/blog", label: "Artikler" },
  { href: "/presserom", label: "Presserom" },
  { href: "/karriere", label: "Karriere" },
  { href: "/kontakt", label: "Kontakt" },
];

/** Shared site footer with the large editorial wordmark. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <span className="mark" />
              <span>
                Advanti
                <span style={{ fontStyle: "italic", fontWeight: 300 }}>.</span>
              </span>
              <span className="sub">Estate</span>
            </Link>
            <p>
              Advanti Estate er din lokale ekspert på næringseiendom i
              Nord-Norge. Vi leverer verdivurdering, transaksjonsrådgivning,
              utleie og markedsanalyse — basert på data og dyp lokal kunnskap.
            </p>
          </div>

          <div className="footer-col">
            <h4>Tjenester</h4>
            <ul>
              {TJENESTER.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Advanti</h4>
            <ul>
              {ADVANTI.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kontor</h4>
            <address className="addr">
              Bodø — Dronningens gate 18
              <br />
              8006 Bodø
              <br />
              <br />
              Alta — Markedsgata 3
              <br />
              9510 Alta
              <br />
              Kunnskapsparken 4. etg
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            {`© ${new Date().getFullYear()} Eiendomsmegler Nord AS · Org. nr. 927 102 234 MVA`}
          </span>
          <span>
            <Link href="/privacy">Personvern</Link> ·{" "}
            <Link href="/terms">Vilkår</Link>
          </span>
        </div>

        <div className="footer-wordmark">
          Advanti<span className="italic">.</span>Estate
        </div>
      </div>
    </footer>
  );
}
