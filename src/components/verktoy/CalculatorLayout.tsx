import { Badge } from "@/components/Badge";
import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";
import { CalculatorCTA } from "./CalculatorCTA";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}

export function CalculatorLayout({
  title,
  description,
  badge = "Kalkulator",
  children,
}: CalculatorLayoutProps) {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      {/* Back Link */}
      <Link
        href="/verktoy"
        className="mb-6 inline-flex w-fit items-center text-sm text-warm-grey-2 transition-colors hover:text-warm-grey-3 dark:text-warm-grey-1 dark:hover:text-warm-white"
      >
        <RiArrowLeftLine className="mr-1 size-4" />
        Tilbake til verktøy
      </Link>

      {/* Header */}
      <section
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>{badge}</Badge>
        <h1 className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          {description}
        </p>
      </section>

      {/* Calculator Content */}
      <section className="mt-12">{children}</section>

      {/* CTA */}
      <CalculatorCTA />

      {/* Additional Info */}
      <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-warm-grey-1/10 bg-warm-grey/5 p-6 dark:border-warm-white/10 dark:bg-warm-grey-2/10">
        <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
          <strong>Viktig:</strong> Disse kalkulatorene gir estimater basert på
          de verdiene du oppgir. For nøyaktige beregninger og profesjonell
          rådgivning, kontakt våre eksperter. Alle beregninger er veiledende og
          må ikke anses som juridisk eller finansiell rådgivning.
        </p>
      </div>
    </div>
  );
}
