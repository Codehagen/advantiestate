"use client";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { RiArrowRightUpLine, RiPlayCircleLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { Balancer } from "react-wrap-balancer";

export default function CtaMiddle() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-40">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div>
            <Badge>Din ekspert innen næringseiendom i Nord-Norge</Badge>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="mb-2 pb-2 leading-normal text-balance bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-left text-4xl font-semibold tracking-tighter text-transparent md:text-6xl dark:from-warm-white dark:to-warm-grey-1">
              Strategisk innsikt
            </h2>
            <p className="text-grey-800 max-w-md text-left text-lg leading-relaxed tracking-tight dark:text-warm-grey-1">
              <Balancer>
                Advanti leverer verdivurdering, transaksjonsrådgivning og
                markedsanalyse basert på dybdekunnskap og de nyeste dataene. Vi
                hjelper deg å realisere potensialet i din eiendom og ta
                informerte beslutninger.
              </Balancer>
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Link
              href="/kontakt"
              data-track="cta-middle-verdivurdering"
              data-track-action="click"
            >
              <Button className="group gap-2">
                Få uforpliktende verdivurdering
                <RiArrowRightUpLine className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/tjenester">
              <Button variant="secondary" className="group gap-2">
                Utforsk våre tjenester
                <RiPlayCircleLine className="size-4 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:shadow-light-blue/10 dark:ring-warm-white/5">
            <Image
              src="/building/pexels-pixabay-248877.jpg"
              alt="Moderne næringseiendom"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative row-span-2 overflow-hidden rounded-xl shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:shadow-light-blue/10 dark:ring-warm-white/5">
            <Image
              src="/building/pexels-abshky-18566965.jpg"
              alt="Kontorbygg og næringslokaler"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:shadow-light-blue/10 dark:ring-warm-white/5">
            <Image
              src="/building/pexels-expect-best-79873-351262.jpg"
              alt="Næringseiendom i Nord-Norge"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
