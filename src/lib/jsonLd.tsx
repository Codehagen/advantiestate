/**
 * Helpers for safe JSON-LD script emission.
 *
 * JSON.stringify alone is insufficient — a hostile string that contains the
 * literal sequence `</script` would close the surrounding script tag before
 * the JSON ends, allowing script injection. Replacing `</` with `<\/`
 * prevents the breakout while producing semantically equivalent JSON.
 *
 * U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) are also escaped:
 * they are valid JSON but can terminate JS string literals in some parsers —
 * defence-in-depth per OWASP JSON-LD injection guidance.
 */

// Unicode line terminators must use escape sequences in regex literals; the
// raw codepoints are treated as line breaks by the JS parser (TS TS1161).
const LS = " "; // U+2028 LINE SEPARATOR
const PS = " "; // U+2029 PARAGRAPH SEPARATOR
const RE_LS = new RegExp(LS, "g");
const RE_PS = new RegExp(PS, "g");

/**
 * Returns props for a `<script type="application/ld+json">` element with
 * safely serialised JSON-LD data.
 *
 * Usage:
 *   <script {...jsonLdScriptProps(data)} />
 */
export function jsonLdScriptProps(data: object): {
  type: "application/ld+json";
  dangerouslySetInnerHTML: { __html: string };
} {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data)
        .replace(/<\//g, "<\\/")
        .replace(RE_LS, "\\u2028")
        .replace(RE_PS, "\\u2029"),
    },
  };
}

/**
 * Server component — emits a single JSON-LD script block.
 *
 * Usage:
 *   <JsonLd data={schemaData} />
 */
export function JsonLd({ data }: { data: object }) {
  return <script {...jsonLdScriptProps(data)} />;
}
