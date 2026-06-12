"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { CityLink } from "@/lib/navigationServer";

/** Client leaf so footer city link clicks fire the footer_by_click analytics event. */
export function FooterCityLinks({ cities }: { cities: CityLink[] }) {
  return (
    <ul>
      {cities.map((city) => (
        <li key={city.slug}>
          <Link
            prefetch={false}
            href={`/naringsmegler/${city.slug}`}
            onClick={() => trackEvent("footer_by_click", { city: city.name })}
          >
            {city.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
