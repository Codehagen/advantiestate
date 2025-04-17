import Footer from "@/components/ui/Footer";
import { Navigation } from "@/components/ui/Navbar";
import { constructMetadata } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = constructMetadata({
  title: "Advanti | Næringsmegler i Nord-Norge",
  description:
    "Advanti tilbyr ekspertise innen kjøp, salg og utleie av næringseiendom i Nord-Norge. Profesjonell rådgivning for din virksomhet.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen scroll-auto antialiased selection:bg-light-blue selection:text-warm-grey dark:bg-warm-grey dark:selection:bg-light-blue dark:selection:text-warm-grey`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
