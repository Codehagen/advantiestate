/** @type {import('next').NextConfig} */
import { withContentCollections } from "@content-collections/next";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  typescript: { ignoreBuildErrors: false },
  experimental: {
    // @remixicon/react is a large icon barrel — transform bare imports into
    // direct ones so only the icons actually used are bundled.
    // See PERFORMANCE_PLAN.md Phase 2.3.
    optimizePackageImports: ["@remixicon/react"],
  },
  // acceptmarkdown.com content negotiation: the same URL serves HTML to browsers
  // and markdown to agents that ask for it. `beforeFiles` (not the default
  // `afterFiles`) is required — afterFiles rewrites only run when no route
  // matched, and every path we want to negotiate already has a page.
  //
  // The negative lookahead keeps the rewrite off /api, /_next and the
  // machine-readable files that already have their own content type
  // (sitemap.xml, robots.txt, llms.txt, markedstall.csv, images).
  async rewrites() {
    const acceptsMarkdown = {
      type: "header",
      key: "accept",
      value: "(.*)text/markdown(.*)",
    };
    const NOT_ASSET =
      "(?!api/|_next/|.*\\.(?:xml|txt|csv|json|ico|png|jpg|jpeg|webp|avif|svg|pdf|xsl)$)";

    return {
      beforeFiles: [
        { source: "/", has: [acceptsMarkdown], destination: "/api/md" },
        {
          source: `/:path(${NOT_ASSET}.*)`,
          has: [acceptsMarkdown],
          destination: "/api/md/:path",
        },
        // Explicit .md suffix — the convention agents reach for when they can't
        // set headers. No Accept condition; the suffix is the request.
        {
          source: "/:path((?!api/|_next/).*\\.md)",
          destination: "/api/md/:path",
        },
        // llmstxt.org publishes at /llms.txt; the well-known registry mirrors it
        // at /.well-known/llms.txt. Serve one document from both, so an agent
        // that only knows one convention still finds it.
        { source: "/.well-known/llms.txt", destination: "/llms.txt" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  // No `headers()` entry for `Vary: Accept` on the HTML side, and that is a
  // measured decision rather than an omission. Next.js sets `Vary` on every
  // App Router page response itself (rsc, next-router-state-tree, …) and that
  // write lands after custom headers, so a config-level `Vary` is silently
  // dropped — verified locally with a probe header, which *did* survive on the
  // same rule. The markdown representation sets `Vary: Accept` on its own
  // Response in src/app/api/md, which is the header an Accept-negotiating
  // client actually reads.
  //
  // Cache correctness does not depend on it either: the negotiation happens as
  // a `has`-conditioned rewrite, so the markdown variant resolves to a
  // different route (/api/md/*) and therefore a different CDN cache key than
  // the HTML. The two representations cannot collide the way they would with
  // same-URL negotiation.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "advantiestate.no",
          },
        ],
        destination: "https://www.advantiestate.no/:path*",
        permanent: true,
      },
      {
        // The production *.vercel.app alias serves the same content as the
        // custom domain — keep it out of the index by sending it to www.
        // Exact host match: per-commit preview deploys use a different host
        // (advantiestate-git-*.vercel.app) and are unaffected, so previews work.
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "advantiestate.vercel.app",
          },
        ],
        destination: "https://www.advantiestate.no/:path*",
        permanent: true,
      },
      // English trust-anchor aliases. The site is Norwegian, so /om-oss and
      // /kontakt stay canonical — but agents (and is-agentic's trust-anchor
      // check) probe /about and /contact by convention. A permanent redirect
      // answers them without creating a duplicate-content twin.
      // 301 rather than `permanent: true` (which emits 308) on purpose: these
      // two are probed by third-party agents and crawlers whose HTTP clients
      // handle 301 universally, while 308 support is patchier.
      {
        source: "/about",
        destination: "/om-oss",
        statusCode: 301,
      },
      {
        source: "/contact",
        destination: "/kontakt",
        statusCode: 301,
      },
      {
        source: "/tjenester/verdsettelse",
        destination: "/tjenester/verdivurdering",
        permanent: true,
      },
      {
        source: "/legal/terms",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/legal/privacy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/help/article/hva-er-næringseiendom-en-komplett-guide",
        destination: "/help/article/hva-er-naringseiendom",
        permanent: true,
      },
      {
        source: "/help/article/hva-er-naringseiendom-en-komplett-guide",
        destination: "/help/article/hva-er-naringseiendom",
        permanent: true,
      },
      {
        source: "/blog/handelslokaler-nord-norge",
        destination: "/markedsinnsikt",
        permanent: true,
      },
      {
        source: "/blog/naringseiendomsmarkedet-narvik",
        destination: "/markedsinnsikt",
        permanent: true,
      },
      {
        source: "/blog/naringseiendomsmarkedet-2025-nord-norge",
        destination: "/markedsinnsikt",
        permanent: true,
      },
      {
        source: "/blog/utleie-naringseiendom-nord-norge",
        destination: "/tjenester/utleie",
        permanent: true,
      },
      {
        source: "/blog/komplett-guide-verdivurdering-naringseiendom",
        destination: "/help/article/verdivurdering-av-naringseiendom",
        permanent: true,
      },
      {
        source: "/blog/yield-naringseiendom-hva-det-er",
        destination: "/help/article/hva-er-yield",
        permanent: true,
      },
      {
        // Legacy numeric blog pagination (/blog/2, /blog/3, …) → blog index.
        // Real posts use non-numeric slugs, so this never catches an article.
        source: "/blog/:page(\\d+)",
        destination: "/blog",
        permanent: true,
      },
      {
        source:
          "/kunder/hvordan-vi-hjalp-en-investor-realisere-25-høyere-avkastning",
        destination: "/kunder/investor-avkastning",
        permanent: true,
      },
      {
        source:
          "/kunder/hvordan-vi-hjalp-en-investor-realisere-25-h%C3%B8yere-avkastning",
        destination: "/kunder/investor-avkastning",
        permanent: true,
      },
      {
        source:
          "/kunder/hvordan-vi-hjalp-en-investor-realisere-25-hoyere-avkastning",
        destination: "/kunder/investor-avkastning",
        permanent: true,
      },
      {
        // Removed team member (no longer with the company). The page 404s but
        // Google still has the URL indexed — send it to the team listing.
        source: "/personer/thomas-knutsen-johansen",
        destination: "/personer",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: "",
        pathname: "/**",
      },
      {
        // Supabase Storage CDN — public `imagebank` bucket + render/resize
        // endpoint. Serves https://<ref>.supabase.co/storage/v1/...
        protocol: "https",
        hostname: "kukzjreikqbgbolxvqaj.supabase.co",
        port: "",
        pathname: "/storage/v1/**",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.finncdn.no",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config and Content Collections
export default withContentCollections(withMDX(nextConfig));
