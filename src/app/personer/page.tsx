import { Badge } from "@/components/Badge";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import FeatureDivider from "@/components/ui/FeatureDivider";
import { constructMetadata } from "@/lib/utils";
import { allPersonPosts } from "content-collections";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export const metadata = constructMetadata({
  title: "Vårt Team | Advanti",
  description:
    "Møt teamet bak Advanti - erfarne næringsmeglere og rådgivere med dyp kompetanse innen næringseiendom i Nord-Norge.",
});

export default function PersonerPage() {
  // Filter to show only Christer Hagen and Daniel Adamsen, in this specific order
  const displayedPeople = ['christer-hagen', 'daniel-adamsen']
    .map(slug => allPersonPosts.find(p => p.slug === slug))
    .filter(Boolean);

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      {/* Hero Section */}
      <section
        aria-labelledby="team-hero"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Vårt Team</Badge>
        <h1
          id="team-hero"
          className="mt-2 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-warm-white dark:to-warm-grey-1"
        >
          <Balancer>Erfarne Rådgivere for Din Suksess</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          Bak Advanti står et dedikert team av erfarne rådgivere med lidenskap
          for næringseiendom og et sterkt engasjement for å skape verdier for
          våre kunder i Nord-Norge.
        </p>
      </section>

      <FeatureDivider className="mt-16" />

      {/* Team Grid */}
      <section className="mt-24">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {displayedPeople.map((person, index) => (
            <Link
              key={person.slug}
              href={`/personer/${person.slug}`}
              className="group overflow-hidden"
            >
              <img
                className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                src={person.avatar}
                alt={`${person.name} - ${person.role}`}
                width="826"
                height="1239"
              />
              <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                <div className="flex justify-between">
                  <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                    {person.name}
                  </h3>
                  <span className="text-xs">_0{index + 1}</span>
                </div>
                <div className="mt-1 space-y-0.5 translate-y-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-muted-foreground text-sm">
                    {person.role}
                  </p>
                  <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                    {person.yearsExperience} års erfaring
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-700 hover:text-primary-600 hover:underline dark:text-gray-300 dark:hover:text-primary-400">
                      {person.email}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-700 hover:text-primary-600 hover:underline dark:text-gray-300 dark:hover:text-primary-400">
                      {person.phone}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24">
        <AnimatedCTA
          badge="Kontakt Oss"
          title="Klar til å Ta Kontakt?"
          description="Vårt team er her for å bistå deg med alle dine behov innen næringseiendom. Ta kontakt for en uforpliktende samtale."
          primaryAction={{
            label: "Send oss en henvendelse",
            href: "/kontakt",
          }}
          secondaryAction={{
            label: "Se våre tjenester",
            href: "/tjenester",
          }}
          size="default"
        />
      </section>
    </div>
  );
}
