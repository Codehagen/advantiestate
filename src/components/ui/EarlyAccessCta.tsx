"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { submitEarlyAccess } from "@/lib/actions";
import { useState } from "react";
import { Balancer } from "react-wrap-balancer";

export default function EarlyAccessCta() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitEarlyAccess(email);
      if (result.success) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        setError("Det oppstod en feil. Vennligst prøv igjen senere.");
      }
    } catch (err) {
      setError("Det oppstod en feil. Vennligst prøv igjen senere.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="cta-title"
      className="mx-auto mb-20 mt-32 max-w-6xl p-1 px-2 sm:mt-56"
    >
      <div className="relative flex items-center justify-center">
        <div
          className="mask pointer-events-none absolute -z-10 select-none opacity-70"
          aria-hidden="true"
        >
          <div className="flex size-full flex-col gap-2">
            {Array.from({ length: 20 }, (_, idx) => (
              <div key={`outer-${idx}`}>
                <div className="flex size-full gap-2">
                  {Array.from({ length: 41 }, (_, idx2) => (
                    <div key={`inner-${idx}-${idx2}`}>
                      <div className="size-5 rounded-md shadow shadow-light-blue/20 ring-1 ring-warm-grey/5 dark:shadow-light-blue/20 dark:ring-warm-white/5"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <h3
                id="cta-title"
                className="inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text p-2 text-4xl font-bold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
              >
                Hold Deg Oppdatert med Innsikt fra Advanti
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-warm-grey-2 sm:text-lg dark:text-warm-grey-1">
                <Balancer>
                  Meld deg på for å motta de siste markedsanalysene, nyheter og
                  innsikt om næringseiendom i Nord-Norge direkte fra våre
                  eksperter.
                </Balancer>
              </p>
            </div>
            <div className="mt-14 w-full rounded-[16px] bg-warm-grey/5 p-1.5 ring-1 ring-warm-grey/[3%] backdrop-blur dark:bg-warm-grey/10 dark:ring-warm-white/[3%]">
              <div className="rounded-xl bg-warm-white p-4 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey dark:shadow-light-blue/10 dark:ring-warm-white/5">
                {isSubmitted ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <svg
                      className="size-12 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-warm-grey dark:text-warm-white">
                      Takk for din interesse!
                    </p>
                    <p className="text-warm-grey-2 dark:text-warm-grey-1">
                      Du vil nå motta våre oppdateringer.
                    </p>
                  </div>
                ) : (
                  <form
                    className="flex flex-col items-center gap-3 sm:flex-row"
                    onSubmit={handleSubmit}
                  >
                    <label htmlFor="email" className="sr-only">
                      E-postadresse
                    </label>
                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      id="email"
                      className="h-10 w-full min-w-0 flex-auto"
                      inputClassName="h-full"
                      placeholder="Din e-postadresse"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <Button
                      className="h-10 w-full sm:w-fit sm:flex-none"
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sender..." : "Meld deg på"}
                    </Button>
                  </form>
                )}
                {error && (
                  <p className="mt-2 text-center text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
