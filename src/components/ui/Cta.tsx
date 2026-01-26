"use client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Balancer } from "react-wrap-balancer";
import { useState } from "react";

export default function Cta() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/discord-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setSubmitStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Ønsker du å vite mer?
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-warm-grey-2 sm:text-lg dark:text-warm-grey-1">
                <Balancer>
                  Ta kontakt med oss for å få mer informasjon om våre tjenester
                  og tilgang til markedsdata.
                </Balancer>
              </p>
            </div>
            <div className="mt-14 w-full rounded-[16px] bg-warm-grey/5 p-1.5 ring-1 ring-warm-grey/[3%] backdrop-blur dark:bg-warm-grey/10 dark:ring-warm-white/[3%]">
              <div className="rounded-xl bg-warm-white p-4 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey dark:shadow-light-blue/10 dark:ring-warm-white/5">
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
                    {isSubmitting ? "Sender..." : "Oppdater meg"}
                  </Button>
                </form>
                {submitStatus === "success" && (
                  <p className="mt-3 text-center text-sm text-green-600 dark:text-green-400">
                    Takk! Vi kontakter deg snart.
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
                    Noe gikk galt. Vennligst prøv igjen.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm">
              <span className="text-warm-grey-2 dark:text-warm-grey-1">
                Ønsker du rask respons?
              </span>
              <a
                href="tel:+4798453571"
                className="group inline-flex items-center gap-1 font-medium text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                data-track="cta-ring-oss"
                data-track-action="click"
              >
                Ring oss direkte
                <svg
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M6.75 3.25L10.25 8L6.75 12.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
