import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { constructMetadata } from "@/lib/utils";
import { RiMailLine, RiTeamLine } from "@remixicon/react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Ledige stillinger hos Advanti | Karriere i Nord-Norge",
  description:
    "Vi er alltid på utkikk etter de rette menneskene. Ta kontakt med Advanti hvis du vil bli med og forme fremtidens næringseiendom i Nord-Norge.",
});

export default function KarrierePage() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-labelledby="careers-title" className="mx-auto w-full max-w-4xl">
        <Badge>Karriere</Badge>
        <h1
          id="careers-title"
          className="mt-3 inline-block bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl dark:from-warm-white dark:to-warm-grey-1"
        >
          Vi er alltid på jakt etter de rette menneskene
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-warm-grey-2 dark:text-warm-grey-1">
          Selv om vi ikke alltid har aktive utlysninger, ønsker vi å komme i
          kontakt med personer som brenner for næringseiendom, analyse og gode
          kundeopplevelser.
        </p>
      </section>
      <section className="mx-auto mt-14 grid w-full max-w-4xl gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-warm-grey/20 bg-warm-white/70 p-6 backdrop-blur dark:border-warm-white/10 dark:bg-warm-grey-3/30">
          <div className="mb-4 inline-flex rounded-full bg-warm-grey/10 p-2 dark:bg-warm-white/10">
            <RiTeamLine className="size-5 text-warm-grey dark:text-warm-white" />
          </div>
          <h2 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
            Hvem vi ser etter
          </h2>
          <p className="mt-3 text-warm-grey-2 dark:text-warm-grey-1">
            Du er faglig nysgjerrig, tar eierskap og ønsker å skape resultater
            sammen med kunder og kolleger.
          </p>
        </div>
        <div className="rounded-xl border border-warm-grey/20 bg-warm-white/70 p-6 backdrop-blur dark:border-warm-white/10 dark:bg-warm-grey-3/30">
          <div className="mb-4 inline-flex rounded-full bg-warm-grey/10 p-2 dark:bg-warm-white/10">
            <RiMailLine className="size-5 text-warm-grey dark:text-warm-white" />
          </div>
          <h2 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
            Ta kontakt
          </h2>
          <p className="mt-3 text-warm-grey-2 dark:text-warm-grey-1">
            Send en kort introduksjon til{" "}
            <a
              href="mailto:Christer@advanti.no"
              className="font-medium underline underline-offset-4 hover:text-warm-grey dark:hover:text-warm-white"
            >
              Christer@advanti.no
            </a>{" "}
            hvis du vil bli med på laget.
          </p>
        </div>
      </section>

      <section className="mx-auto mb-20 mt-10 w-full max-w-4xl rounded-xl border border-warm-grey/20 bg-warm-white/70 p-6 backdrop-blur dark:border-warm-white/10 dark:bg-warm-grey-3/30">
        <p className="text-warm-grey-2 dark:text-warm-grey-1">
          Vi vurderer åpne søknader fortløpende og tar kontakt når det er en
          relevant mulighet.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="mailto:Christer@advanti.no">Send åpen søknad</a>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/kontakt">Kontakt oss</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
