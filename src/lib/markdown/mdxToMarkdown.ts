// MDX → plain CommonMark, for the Accept: text/markdown representation of a page.
//
// Our article bodies are MDX: standard markdown plus the editorial `.ae-*`
// components documented in src/content/blog/AUTHORING.md (<Summary>, <Fact>,
// <Note>, <Compare>, …). MDX is a markdown superset, so shipping it raw would
// technically parse — but the JSX tags are noise to a consumer that only wants
// the prose, and self-closing components like <Fact label="Yield" value="7,5 %" />
// carry real information that would be silently dropped by a naive tag strip.
//
// So: unwrap paired components (keep their children), flatten self-closing ones
// into a labelled list, and drop the import/export lines that only matter to the
// MDX compiler.

/** Tags whose children are layout-only and carry no prose worth serving. */
const DROP_WITH_CHILDREN = new Set(["Figure", "DcfChart", "HelpArticles"]);

/** Parse `key="value"` / `key={"value"}` pairs off a JSX open tag. */
function parseAttrs(raw: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const re = /([A-Za-z][A-Za-z0-9_]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{"([^"]*)"\})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const value = m[2] ?? m[3] ?? m[4] ?? m[5] ?? "";
    if (value.trim()) out.push([m[1], value.trim()]);
  }
  return out;
}

/** `<Fact label="Yield" value="7,5 %" />` → `- **Yield:** 7,5 %` */
function selfClosingToMarkdown(raw: string): string {
  const attrs = parseAttrs(raw).filter(([k]) => !/^(class|className|id|src|href|icon|variant|tone|size)$/i.test(k));
  if (attrs.length === 0) return "";
  // A single text-bearing attribute reads better as a plain line than a list.
  if (attrs.length === 1) return `- ${attrs[0][1]}`;
  return attrs.map(([k, v]) => `- **${k}:** ${v}`).join("\n");
}

export function mdxToMarkdown(source: string): string {
  if (!source) return "";
  let out = source;

  // 1. Drop MDX-only statements. Anchored to line start so prose mentioning
  //    "import" mid-sentence survives.
  out = out.replace(/^(?:import|export)\s+[^\n]*(?:\n(?![A-Za-z#\-*>|\n])[^\n]*)*\n?/gm, "");

  // 2. Remove layout-only blocks entirely, children included.
  for (const tag of DROP_WITH_CHILDREN) {
    out = out.replace(new RegExp(`<${tag}\\b[^>]*?/>`, "g"), "");
    out = out.replace(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`, "g"), "");
  }

  // 3. Self-closing components → labelled markdown lines.
  out = out.replace(/<([A-Z][A-Za-z0-9]*)\b([^>]*?)\/>/g, (_full, _tag: string, attrs: string) =>
    selfClosingToMarkdown(attrs),
  );

  // 4. Paired components → unwrap, keep the children. Done as a tag-level strip
  //    rather than a balanced parse because these components nest predictably
  //    and any stray tag is dropped by the same pass.
  out = out.replace(/<\/?[A-Z][A-Za-z0-9]*\b[^>]*>/g, "");

  // 5. JSX expression leftovers on their own line (`{" "}`, `{/* … */}`).
  out = out.replace(/^\s*\{\s*(?:\/\*[\s\S]*?\*\/|"[^"]*"|'[^']*')\s*\}\s*$/gm, "");

  // 6. Collapse the blank-line runs the strips leave behind.
  out = out.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");

  return out.trim();
}
