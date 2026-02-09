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
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config and Content Collections
export default withContentCollections(withMDX(nextConfig));

