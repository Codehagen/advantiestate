import { Fragment, type ReactNode } from "react"

/**
 * Minimal, dependency-free markdown renderer for CRM-published listing bodies.
 * Listing prose is plain text — paragraphs, optional H2/H3, bullet lists, and
 * inline **bold** / *italic* / [links](url). We deliberately avoid runtime MDX
 * compilation (esbuild) here; the rich, structured data (facts, financials,
 * tenants, location) renders from dedicated profile fields, not the body.
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
  // Tokenize bold, italic and links in a single pass.
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const key = `${keyBase}-${i++}`
    if (match[2] !== undefined) {
      out.push(<strong key={key}>{match[2]}</strong>)
    } else if (match[3] !== undefined) {
      out.push(<em key={key}>{match[3]}</em>)
    } else if (match[4] !== undefined && match[5] !== undefined) {
      const href = match[5]
      const external = /^https?:\/\//.test(href)
      out.push(
        <a
          key={key}
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {match[4]}
        </a>,
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function ListingProse({ body }: { body: string }) {
  const blocks = body.trim().split(/\n{2,}/)
  return (
    <>
      {blocks.map((raw, bi) => {
        const block = raw.trim()
        if (!block) return null
        if (block.startsWith("### ")) {
          return <h3 key={bi}>{renderInline(block.slice(4), `h3-${bi}`)}</h3>
        }
        if (block.startsWith("## ")) {
          return <h2 key={bi}>{renderInline(block.slice(3), `h2-${bi}`)}</h2>
        }
        const lines = block.split("\n")
        if (lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>
                  {renderInline(l.trim().replace(/^[-*]\s+/, ""), `li-${bi}-${li}`)}
                </li>
              ))}
            </ul>
          )
        }
        // Paragraph — join soft-wrapped lines with spaces.
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 ? " " : null}
                {renderInline(l, `p-${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </>
  )
}

export default ListingProse
