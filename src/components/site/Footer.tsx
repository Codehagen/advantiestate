import Link from "next/link";
import { footerColumns } from "@/lib/navigation";
import { getCities } from "@/lib/navigationServer";
import { FooterCityLinks } from "./FooterCityLinks";

/** Shared site footer with the large editorial wordmark. */
export async function Footer() {
  const cities = getCities();
  const tjenester = footerColumns.tjenester;
  const advanti = footerColumns.advanti;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link prefetch={false} href="/" className="nav-logo">
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
              {tjenester.map((l) => (
                <li key={l.path}>
                  <Link prefetch={false} href={l.path}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Advanti</h4>
            <ul>
              {advanti.map((l) => (
                <li key={l.path}>
                  <Link prefetch={false} href={l.path}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Byer vi dekker</h4>
            <FooterCityLinks cities={cities} />
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
            <Link prefetch={false} href="/privacy">Personvern</Link> ·{" "}
            <Link prefetch={false} href="/terms">Vilkår</Link>
          </span>
        </div>

        <div className="footer-wordmark">
          Advanti<span className="italic">.</span>Estate
        </div>
      </div>
    </footer>
  );
}
