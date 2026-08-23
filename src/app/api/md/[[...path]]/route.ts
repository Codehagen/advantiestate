import { notFoundMarkdown, resolveMarkdown } from "@/lib/markdown/resolveMarkdown";
import { siteConfig } from "@/app/siteConfig";

// The markdown representation of every public page.
//
// Reached two ways, both wired in next.config.mjs:
//   1. `Accept: text/markdown` on any page URL (acceptmarkdown.com negotiation)
//   2. an explicit `.md` suffix, e.g. /blog/some-post.md
//
// `Vary: Accept` is mandatory on this response, not cosmetic: the HTML and the
// markdown share a URL, so a CDN that caches one without keying on Accept will
// hand the wrong representation to the next caller.

export const revalidate = 600;

const CACHE_CONTROL = "public, max-age=0, s-maxage=600, stale-while-revalidate=86400";

function markdownHeaders(canonicalPath?: string): Headers {
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    "Cache-Control": CACHE_CONTROL,
    "X-Robots-Tag": "noindex",
  });
  if (canonicalPath) {
    headers.set("Link", `<${siteConfig.url}${canonicalPath}>; rel="canonical"`);
  }
  return headers;
}

/**
 * Rewrite root-relative markdown links to absolute ones. The HTML page can
 * afford relative hrefs because the browser knows what page it is on; a
 * markdown document gets copied into a context window and read detached from
 * its URL, where `](/help/article/x)` resolves to nothing.
 * Protocol-relative `//host` links are left alone.
 */
function absolutiseLinks(markdown: string): string {
  return markdown.replace(/\]\((\/(?!\/)[^)\s]*)\)/g, `](${siteConfig.url}$1)`);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
): Promise<Response> {
  const { path } = await params;
  const pathname = `/${(path ?? []).join("/")}`;

  const doc = await resolveMarkdown(pathname);

  if (!doc) {
    return new Response(notFoundMarkdown(pathname), {
      status: 404,
      headers: markdownHeaders(),
    });
  }

  const body = [
    `# ${doc.title}`,
    "",
    `> Kilde: ${siteConfig.url}${doc.path}`,
    "",
    absolutiseLinks(doc.body),
    "",
  ].join("\n");

  return new Response(body, { status: 200, headers: markdownHeaders(doc.path) });
}

export async function HEAD(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
): Promise<Response> {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
