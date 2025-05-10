import { Customer } from "@/components/blog/customers";
import { AnimatedGridPattern } from "@/components/ui/Animated-Grid-Background";
import { FadeContainer, FadeSpan } from "@/components/ui/Fade";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Våre Kunder og Prosjekter - Advanti",
  description:
    "Se eksempler på vellykkede transaksjoner og prosjekter Advanti har gjennomført for våre kunder innen næringseiendom i Nord-Norge.",
});

export default function Customers() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section aria-label="hero">
        <FadeContainer className="relative mx-auto flex max-w-6xl flex-col items-center justify-center">
          <h1 className="mt-8 text-center text-5xl font-semibold tracking-tighter text-warm-grey sm:text-8xl sm:leading-[5.5rem] dark:text-warm-white">
            <FadeSpan>Våre fornøyde</FadeSpan> <FadeSpan>kunder og</FadeSpan>
            <br />
            <FadeSpan>vellykkede prosjekter</FadeSpan>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-center text-base text-warm-grey-2 sm:mt-8 sm:text-xl">
            <FadeSpan>
              Advanti har bistått en rekke aktører i Nord-Norge med å realisere
            </FadeSpan>{" "}
            <FadeSpan>deres mål innen næringseiendom. Se et utvalg av</FadeSpan>{" "}
            <FadeSpan>våre referanser og kundehistorier.</FadeSpan>
          </p>

          <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />

            <AnimatedGridPattern
              width={50}
              height={50}
              className="-mt-24 scale-125 text-light-blue/20"
              maxOpacity={0.3}
              numSquares={30}
              duration={3}
            />

            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-warm-white via-warm-white/80 to-transparent dark:from-warm-grey dark:via-warm-grey/80" />
          </div>
        </FadeContainer>
      </section>

      <section className="mx-auto mt-24 w-full max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {customers.map((customer) => (
            <Customer key={customer.slug} {...customer} />
          ))}
        </div>
      </section>
    </div>
  );
}

const customers = [
  // {
  //   slug: "vercel",
  //   site: "https://vercel.com",
  // },
  {
    slug: "corponor",
  },
  // {
  //   slug: "mcgrath-estate-agents",
  // },
  // {
  //   slug: "ray-white-brisbane",
  // },
  // {
  //   slug: "tinybird",
  //   site: "https://tinybird.co",
  // },
  // {
  //   slug: "hashnode",
  //   site: "https://hashnode.com",
  // },
  // {
  //   slug: "cal",
  //   site: "https://cal.com",
  // },
  // {
  //   slug: "perplexity",
  //   site: "https://perplexity.ai",
  // },
  // {
  //   slug: "replicate",
  //   site: "https://replicate.com",
  // },
  // {
  //   slug: "super",
  //   site: "https://super.so",
  // },
  // {
  //   slug: "chronicle",
  //   site: "https://chroniclehq.com",
  // },
  // {
  //   slug: "attio",
  //   site: "https://attio.com",
  // },
  // {
  //   slug: "crowd",
  //   site: "https://crowd.dev",
  // },
  // {
  //   slug: "checkly",
  //   site: "https://checklyhq.com",
  // },
  // {
  //   slug: "rovisys",
  //   site: "https://www.rovisys.com",
  // },
  // {
  //   slug: "chatwoot",
  //   site: "https://chatwoot.com",
  // },
  // {
  //   slug: "lugg",
  //   site: "https://lugg.com",
  // },
  // {
  //   slug: "vueschool",
  //   site: "https://vueschool.io",
  // },
  // {
  //   slug: "refine",
  //   site: "https://refine.dev",
  // },
  // {
  //   slug: "crowdin",
  //   site: "https://crowdin.com",
  // },
  // {
  //   slug: "peerlist",
  //   site: "https://peerlist.io",
  // },
  // {
  //   slug: "anja",
  //   site: "https://www.anjahealth.com/",
  // },
  // {
  //   slug: "inngest",
  //   site: "https://www.inngest.com/",
  // },
  // {
  //   slug: "ashore",
  //   site: "https://ashore.io/",
  // },
  // {
  //   slug: "galactic",
  //   site: "https://galacticrecords.com/",
  // },
  // {
  //   slug: "1komma5grad",
  //   site: "https://1komma5grad.com/",
  // },
  // { // Example structure for a new entry - replace with actual data
  //   slug: "firmanavn-eller-prosjektnavn", // used for linking or as an ID
  //   name: "Firmanavn AS", // Display name
  //   logoUrl: "/path/to/logo.png", // Path to the company/project logo
  //   description: "Kort beskrivelse av samarbeidet eller prosjektet.", // Optional short description
  //   caseStudyUrl: "/kunder/firmanavn-case-study" // Optional link to a detailed case study page
  // },
];
