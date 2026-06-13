"use client";

import Link from "next/link";
import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

/**
 * Måling av verdivurderingsreisen (8A): CTA → kalkulator → kontakt.
 * Klient-løv etter FooterCityLinks-mønsteret — siden forblir server-rendret.
 *
 *   journey_step { step: "kalkulator" }  — ankomst på kalkulatorsiden (mount)
 *   journey_step { step: "sjekkliste" }  — klikk på den dempede støttelenken
 */
export function JourneyStepTracker() {
  useEffect(() => {
    trackEvent("journey_step", { step: "kalkulator" });
  }, []);
  return null;
}

export function SjekklisteJourneyLink() {
  return (
    <Link
      href="/sjekkliste-verdivurdering"
      className="text-warm-grey-85 underline decoration-warm-grey-75 underline-offset-4 hover:text-warm-grey"
      onClick={() => trackEvent("journey_step", { step: "sjekkliste" })}
    >
      Forbered deg: sjekkliste for verdivurdering →
    </Link>
  );
}
