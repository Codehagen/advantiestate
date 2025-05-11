import { InstaxImage } from "./InstaxImage";

export default function TeamGallery() {
  return (
    <section
      aria-labelledby="teamwork-title"
      className="mx-auto mt-5 max-w-4xl animate-slide-up-fade"
      style={{
        animationDuration: "600ms",
        animationDelay: "200ms",
        animationFillMode: "backwards",
      }}
    >
      <div className="mt-20">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            className="w-[25rem] -rotate-6 sm:-ml-10"
            src="/images/working.webp"
            alt="Advanti-teamet i samarbeid om en analyse"
            width={640}
            height={427}
            caption="Grundige analyser legger grunnlaget"
          />
          <InstaxImage
            className="w-[15rem] rotate-3"
            src="/images/workplace.webp"
            alt="Moderne og funksjonelle kontorlokaler"
            width={640}
            height={853}
            caption="Et inspirerende arbeidsmiljø"
          />
          <InstaxImage
            className="-mr-10 w-[15rem] rotate-1"
            src="/images/home.webp"
            alt="Advanti sitt hovedkontor i Nord-Norge"
            width={640}
            height={960}
            caption="Strategisk plassert for våre kunder"
          />
        </div>
        <div className="mt-8 hidden w-full justify-between gap-4 md:flex">
          <InstaxImage
            className="-ml-16 w-[25rem] rotate-1"
            src="/images/break.webp"
            alt="Advanti-teamet diskuterer markedstrender"
            width={640}
            height={360}
            caption="Kunnskapsdeling og faglig utvikling"
          />
          <InstaxImage
            className="-mt-10 w-[15rem] -rotate-3"
            src="/images/cool.webp"
            alt="En Advanti-rådgiver i dyp konsentrasjon"
            width={640}
            height={965}
            caption="Dedikert til våre klienters suksess"
          />
          <InstaxImage
            className="-mr-20 -mt-2 w-[30rem] rotate-[8deg]"
            src="/images/release.webp"
            alt="Feiring av en vellykket transaksjon for Advanti"
            width={1920}
            height={1281}
            caption="Milepæler feires – alltid med fokus på neste mål"
          />
        </div>
      </div>
      <div className="mt-28">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            className="w-full rotate-1"
            src="/images/founders.webp"
            alt="Hele Advanti-teamet samlet"
            width={1819}
            height={998}
            caption="Sammen skaper vi verdier i Nord-Norge"
          />
        </div>
      </div>
    </section>
  );
}
