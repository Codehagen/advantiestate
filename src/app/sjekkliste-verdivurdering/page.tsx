"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { AnimatedGridPattern } from "@/components/ui/Animated-Grid-Background";
import { FadeContainer, FadeDiv, FadeSpan } from "@/components/ui/Fade";
import {
  RiCheckLine,
  RiCalculatorLine,
  RiDownloadLine,
  RiMailLine,
  RiArrowRightLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiBuildingLine,
  RiLightbulbLine,
} from "@remixicon/react";
import Link from "next/link";

const checklistItems = [
  {
    category: "Dokumentasjon",
    icon: RiFileTextLine,
    items: [
      "Eiendomstegninger og arealberegninger",
      "Leieavtaler (alle leietakere)",
      "Regnskap for de siste 3 årene",
      "Vedlikeholdsplaner og -rapporter",
      "Tekniske rapporter (byggteknisk, brann, etc.)",
      "Forsikringsdokumenter",
      "Skattemeldinger og eiendomsskatt",
    ],
  },
  {
    category: "Finansiell informasjon",
    icon: RiMoneyDollarCircleLine,
    items: [
      "Årlige leieinntekter (brutto)",
      "Årlige driftskostnader (vedlikehold, forsikring, etc.)",
      "Netto leieinntekt (beregnet)",
      "Gjeld og lån knyttet til eiendommen",
      "Fremtidige investeringsbehov",
    ],
  },
  {
    category: "Eiendomsinformasjon",
    icon: RiBuildingLine,
    items: [
      "Eiendomstype og bruksareal",
      "Antall leietakere og utleiegrad",
      "Standard og tilstand (nylige forbedringer?)",
      "Lokasjon og tilgjengelighet",
      "Spesielle karakteristikker eller utfordringer",
    ],
  },
  {
    category: "Forberedelse",
    icon: RiLightbulbLine,
    items: [
      "Tenk gjennom dine mål (hvorfor trenger du verdsettelsen?)",
      "Forbered spørsmål du har",
      "Vurder eventuelle forbedringer før verdsettelsen",
      "Sjekk at leieprisene er markedsjusterte",
      "Dokumenter nylige vedlikehold og forbedringer",
    ],
  },
];

export default function SjekklisteVerdiPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Vennligst oppgi en gyldig e-postadresse.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/discord-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pageUrl: window.location.href,
          formType: "Sjekkliste Verdivurdering",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsUnlocked(true);
      // Scroll to checklist
      setTimeout(() => {
        document.getElementById("checklist")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Noe gikk galt. Vennligst prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative mx-auto mt-20 max-w-4xl px-4 py-12 text-center sm:py-20">
        <FadeContainer className="relative flex flex-col items-center justify-center">
          <FadeDiv>
            <Badge>
              <RiCalculatorLine className="mr-1 h-4 w-4" />
              Gratis Ressurs
            </Badge>
          </FadeDiv>

          <h1 className="mt-8 text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl">
            <FadeSpan className="bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-transparent dark:from-warm-white dark:to-warm-grey-1">
              Sjekkliste: Forbered deg
            </FadeSpan>{" "}
            <FadeSpan className="bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-transparent dark:from-warm-white dark:to-warm-grey-1">
              for Verdivurdering
            </FadeSpan>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-center text-base text-warm-grey-2 sm:text-lg dark:text-warm-grey-1">
            <FadeSpan>Last ned vår gratis sjekkliste for å sikre at du er godt forberedt</FadeSpan>{" "}
            <FadeSpan>når du skal få en profesjonell verdivurdering av din næringseiendom.</FadeSpan>{" "}
            <FadeSpan>Få innsikt i hva du trenger og hvordan du maksimerer verdien.</FadeSpan>
          </p>
        </FadeContainer>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />
          <AnimatedGridPattern
            width={50}
            height={50}
            className="-mt-24 scale-125 text-light-blue/20"
            maxOpacity={0.3}
            numSquares={30}
            duration={3}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />
        </div>
      </section>

      {/* Email Gate */}
      {!isUnlocked && (
        <section className="mx-auto mb-20 max-w-2xl px-4">
          <FadeContainer>
            <FadeDiv>
              <div className="relative overflow-hidden rounded-2xl border border-warm-grey/10 bg-warm-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-warm-white/10 dark:bg-warm-grey/80">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-light-blue/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-light-blue/20 blur-3xl" />

                <div className="relative">
                  {/* Centered download icon */}
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-light-blue/20 dark:bg-light-blue/10">
                    <RiDownloadLine className="h-8 w-8 text-warm-grey dark:text-warm-white" />
                  </div>

                  <h2 className="mb-4 text-center text-2xl font-semibold text-warm-grey dark:text-warm-white">
                    Last ned sjekklisten
                  </h2>
                  <p className="mb-6 text-center text-warm-grey-2 dark:text-warm-grey-1">
                    Fyll ut e-postadressen din for å få tilgang til sjekklisten. Vi sender deg også
                    nyttige tips om verdivurdering direkte i innboksen.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <label htmlFor="email" className="sr-only">
                        E-postadresse
                      </label>
                      <RiMailLine className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-grey-2 dark:text-warm-grey-1" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="din@epost.no"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full pl-10"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      loadingText="Sender..."
                      className="w-full"
                    >
                      <RiDownloadLine className="mr-2 h-5 w-5" />
                      Last ned sjekklisten
                    </Button>
                    <p className="text-center text-xs text-warm-grey-2 dark:text-warm-grey-1">
                      Ved å laste ned godtar du at vi kontakter deg med relevante tips og informasjon om
                      verdivurdering. Du kan når som helst avmelde deg.
                    </p>
                  </form>
                </div>
              </div>
            </FadeDiv>
          </FadeContainer>
        </section>
      )}

      {/* Checklist Content */}
      {isUnlocked && (
        <section id="checklist" className="mx-auto mb-20 max-w-5xl px-4">
          <FadeContainer>
            <FadeDiv className="mb-10 text-center">
              <Badge className="mb-4">
                <RiCheckLine className="mr-1 h-4 w-4" />
                Sjekkliste Låst Opp
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                <span className="bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-transparent dark:from-warm-white dark:to-warm-grey-1">
                  Din sjekkliste for verdivurdering
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-warm-grey-2 dark:text-warm-grey-1">
                Bruk denne sjekklisten for å sikre at du er godt forberedt. Jo bedre forberedt du er,
                jo raskere og mer nøyaktig blir verdsettelsen.
              </p>
            </FadeDiv>

            <div className="grid gap-6 md:grid-cols-2">
              {checklistItems.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <FadeDiv key={categoryIndex}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-warm-grey/10 bg-warm-white p-6 transition-all duration-300 hover:border-light-blue/30 hover:shadow-lg hover:shadow-light-blue/10 dark:border-warm-white/10 dark:bg-warm-grey dark:hover:border-light-blue/30">
                      {/* Hover blob */}
                      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-light-blue/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative">
                        {/* Category header */}
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-light-blue/20 transition-transform duration-300 group-hover:scale-110 dark:bg-light-blue/10">
                              <IconComponent className="h-5 w-5 text-warm-grey dark:text-warm-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
                              {category.category}
                            </h3>
                          </div>
                          <RiArrowRightLine className="h-5 w-5 text-warm-grey-2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 dark:text-warm-grey-1" />
                        </div>

                        {/* Items list */}
                        <ul className="space-y-3">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-light-blue/20 dark:bg-light-blue/10">
                                <RiCheckLine className="h-4 w-4 text-warm-grey dark:text-warm-white" />
                              </div>
                              <span className="text-warm-grey-2 dark:text-warm-grey-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </FadeDiv>
                );
              })}
            </div>

            {/* CTA Section */}
            <FadeDiv className="mt-12">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-light-blue/20 via-warm-white to-light-blue/10 p-8 text-center ring-1 ring-warm-grey/10 sm:p-12 dark:from-light-blue/10 dark:via-warm-grey dark:to-light-blue/5 dark:ring-warm-white/10">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -left-20 top-0 h-60 w-60 rounded-full bg-light-blue/30 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-light-blue/20 blur-3xl" />

                <div className="relative">
                  <Badge className="mb-4">Neste Steg</Badge>

                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    <span className="bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-transparent dark:from-warm-white dark:to-warm-grey-1">
                      Klar for en profesjonell verdivurdering?
                    </span>
                  </h3>
                  <p className="mx-auto mt-4 max-w-2xl text-warm-grey-2 dark:text-warm-grey-1">
                    Vi hjelper deg med en uforpliktende verdivurdering basert på lokal markedsinnsikt i
                    Nord-Norge. Vi svarer innen 24 timer.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link href="/kontakt">
                      <Button className="group gap-2">
                        Få uforpliktende verdivurdering
                        <RiCalculatorLine className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      </Button>
                    </Link>
                    <Link href="/tjenester/verdivurdering">
                      <Button variant="secondary" className="group gap-2">
                        Les mer om våre tjenester
                        <RiArrowRightLine className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeDiv>
          </FadeContainer>
        </section>
      )}
    </div>
  );
}
