import Link from "next/link"

import StructuredData from "@/components/StructuredData"
import { HELP_FAQS } from "@/lib/blog/help-data"

/**
 * Hub "Hurtigsvar" FAQ. Server component — uses native <details> so it needs no
 * client JS. The visible answer text is also emitted verbatim as FAQPage JSON-LD
 * (Google/schema.org policy: structured data must mirror visible content). The
 * "Les mer" link is a separate visible affordance and is NOT part of the JSON-LD.
 */
export function HelpFaq() {
  return (
    <div className="hs-faq-grid">
      <StructuredData
        type="faq"
        data={{
          faqs: HELP_FAQS.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
        }}
      />
      <div className="hs-faq-aside">
        <span className="eyebrow">Hurtigsvar</span>
        <h2>
          Spørsmål vi <span className="italic">ofte får.</span>
        </h2>
        <p>
          De vanligste tingene folk lurer på — besvart med en gang, uten å
          forlate siden.
        </p>
        <Link className="askmore" href="/kontakt">
          Still ditt eget spørsmål <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="hs-acc">
        {HELP_FAQS.map((f, i) => (
          <details className="hs-qa" key={f.question} open={i === 0}>
            <summary>{f.question}</summary>
            <div className="a">
              <p>{f.answer}</p>
              {f.rel && (
                <Link className="related" href={f.rel.href}>
                  {f.rel.label} <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
