import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { TrackingListener } from "@/components/analytics/TrackingListener";
import { Footer } from "@/components/site/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/site/Nav";
import { navGroups } from "@/lib/navigation";
import { baseMetadata } from "@/lib/utils";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

// D3: Inter for both body and display. The italic axis is mandatory — every
// editorial heading uses an italic-flourish span. var(--font-inter) is read by
// the design system's --font-display / --font-body tokens (advanti-design.css).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-inter",
});

// Site-wide metadata defaults. Every real page overrides these via
// constructMetadata(); the root layout deliberately carries NO canonical.
export const metadata = baseMetadata();

export const viewport: Viewport = {
  themeColor: "#2c2825",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={inter.variable}
      data-scroll-behavior="smooth"
    >
      <head>
        <StructuredData type="organization" />
        <StructuredData type="realEstateAgent" />
        <StructuredData type="website" />
      </head>
      <body className="min-h-screen antialiased selection:bg-light-blue selection:text-warm-grey">
        <GoogleTagManager />
        <TrackingListener />
        <Nav groups={navGroups} />
        <a href="#hovedinnhold" className="skip-link">
          Hopp til innhold
        </a>
        <main id="hovedinnhold" tabIndex={-1}>
          <MotionProvider>{children}</MotionProvider>
        </main>
        <Footer />
        {/* Only on real Vercel deploys — locally/CI the insights script 404s
            and trips the zero-console-error test assertions. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
