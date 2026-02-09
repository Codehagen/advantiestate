/** @type {import('next').NextConfig} */
import { withContentCollections } from "@content-collections/next";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  typescript: { ignoreBuildErrors: true },
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
        source: "/blog/markedspuls-nord-norge-2025-2026",
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
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config and Content Collections
export default withContentCollections(withMDX(nextConfig));
