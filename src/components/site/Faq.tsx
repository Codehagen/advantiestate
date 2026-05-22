import type { ReactNode } from "react";
import StructuredData from "@/components/StructuredData";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  /** Eyebrow label, e.g. "05 — Ofte stilte spørsmål". */
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  items: FaqItem[];
}

/**
 * Visible FAQ accordion plus matching FAQPage structured data. The visible
 * questions and answers and the JSON-LD are driven by the same `items` array,
 * so the schema can never drift from what the page actually shows — which is
 * what Google's FAQ rich-result policy requires.
 */
export function Faq({ eyebrow, title, lede, items }: FaqProps) {
  if (items.length === 0) return null;
  return (
    <>
      <StructuredData type="faq" data={{ faqs: items }} />
      <section
        className="section"
        id="faq"
        style={{
          background: "var(--accent-faint)",
          borderTop: "var(--hairline)",
          borderBottom: "var(--hairline)",
        }}
      >
        <div className="wrap">
          <div className="head-compact">
            <span className="eyebrow">{eyebrow}</span>
            <div>
              <h2>{title}</h2>
              {lede && <p>{lede}</p>}
            </div>
          </div>
          <div className="faq" style={{ maxWidth: 920 }}>
            {items.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <div className="a">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
