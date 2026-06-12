/**
 * Helpers for safe JSON-LD script emission.
 *
 * JSON.stringify alone is insufficient — a hostile string that contains the
 * literal sequence `</script` would close the surrounding script tag before
 * the JSON ends, allowing script injection. Replacing `</` with `<\/`
 * prevents the breakout while producing semantically equivalent JSON.
 */

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
      // Escape `</` so `</script>` in any string value cannot close the tag.
      __html: JSON.stringify(data).replace(/<\//g, "<\\/"),
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
