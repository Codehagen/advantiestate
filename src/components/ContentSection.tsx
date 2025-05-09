import { Button } from "@/components/ui/button";
import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <img
          className="rounded-(--radius) grayscale"
          src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Advanti - Næringseiendom i Nord-Norge"
          height=""
          width=""
          loading="lazy"
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            Advanti er din spesialist for næringseiendom i Nord-Norge
          </h2>
          <div className="space-y-6">
            <p>
              Advanti er din dedikerte rådgiver for alle aspekter ved
              næringseiendom i Nord-Norge. Vi tilbyr et helhetlig spekter av
              tjenester – fra verdivurdering og analyse, til kjøp, salg og
              utleie, samt strategisk rådgivning.
            </p>

            <Link href="/tjenester" passHref legacyBehavior>
              <Button variant="outline" className="group gap-2">
                Lær mer om våre tjenester
                <RiArrowRightUpLine className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
