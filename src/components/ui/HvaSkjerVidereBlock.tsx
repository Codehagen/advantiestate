"use client";

import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";

const steps = [
  {
    title: "Du sender inn henvendelsen",
    description: "Fyll ut skjemaet med dine opplysninger og ønsket tjeneste.",
  },
  {
    title: "Vi tar kontakt",
    description: "Innen 24 timer får du en uforpliktende avklaring.",
  },
  {
    title: "Vi lager et forslag",
    description: "Skreddersydd til din situasjon.",
  },
];

export function HvaSkjerVidereBlock() {
  return (
    <section
      aria-labelledby="hva-skjer-videre-title"
      className="mx-auto max-w-4xl px-4 py-10 sm:py-14"
    >
      <h2
        id="hva-skjer-videre-title"
        className="text-center text-lg font-semibold text-warm-grey dark:text-warm-white sm:text-xl"
      >
        Hva skjer videre?
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-xl bg-warm-grey/[3%] p-4 ring-1 ring-warm-grey/5 dark:bg-warm-grey/10 dark:ring-warm-white/5"
          >
            <span
              className="mb-2 inline-flex size-7 items-center justify-center rounded-full bg-warm-grey/10 text-xs font-semibold text-warm-grey dark:bg-warm-white/10 dark:text-warm-white"
              aria-hidden
            >
              {index + 1}
            </span>
            <h3 className="font-medium text-warm-grey dark:text-warm-white">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {step.description}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-warm-grey-2 dark:text-warm-grey-1">
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-1 font-medium text-warm-grey underline decoration-warm-grey/40 underline-offset-2 hover:decoration-warm-grey dark:text-warm-white dark:decoration-warm-white/40 dark:hover:decoration-warm-white"
          data-track="hva-skjer-videre-cta"
          data-track-action="click"
        >
          Ta kontakt for en uforpliktende samtale
          <RiArrowRightLine className="size-4" aria-hidden />
        </Link>
      </p>
    </section>
  );
}
