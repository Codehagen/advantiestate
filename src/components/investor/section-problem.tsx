import Image from "next/image"
import Link from "next/link"
import reciept from "./reciept.png"

export function SectionProblem() {
  return (
    <section className="relative w-full bg-warm-grey py-24 text-warm-white md:py-32">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">02</span>
            <h2 className="text-xl font-medium tracking-tight">Problemet</h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        <div className="space-y-16">
          {/* Top Section: Problem Statement and Image */}
          <div className="grid gap-12 md:grid-cols-2">
            {/* Main Problem Statement */}
            <div className="space-y-6">
              <h3 className="text-3xl font-medium leading-tight md:text-4xl">
                Næringseiendomsaktører mangler presise, datadrevne verktøy for
                investeringsbeslutninger
              </h3>
              <p className="text-lg text-warm-grey-1">
                I dag baseres viktige investeringsbeslutninger ofte på
                ufullstendige data og manuelle analyser, noe som øker risikoen
                for feilinvesteringer og tapte muligheter.
              </p>
            </div>

            {/* Market Impact Visualization */}
            <div className="relative flex items-start justify-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-warm-grey-2/10">
                <Image
                  src={reciept}
                  alt="Visualization of current market inefficiencies"
                  fill
                  className="object-cover object-center"
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-grey via-warm-grey/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-2xl font-medium">
                    80% av næringseiendomsaktører bruker fortsatt regneark for
                    analyse
                  </p>
                  <p className="mt-2 text-warm-grey-1">
                    Dette fører til ineffektivitet og økt risiko for
                    feilinvesteringer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Three Cards */}
          {/* <div className="grid gap-8 md:grid-cols-3">
            <Card className="flex flex-col items-start gap-4 rounded-2xl bg-warm-grey-2/10 p-6 backdrop-blur-sm">
              <div className="rounded-full bg-warm-grey-2/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  className="text-warm-white"
                >
                  <path
                    fill="currentColor"
                    d="M0 21.333V.667l2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v20.666l-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2Z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Ufullstendige markedsdata</h4>
                <p className="text-sm text-warm-grey-1">
                  Mangel på pålitelige data om markedstrender, leiepriser og
                  sammenlignbare transaksjoner gjør det vanskelig å ta
                  informerte beslutninger.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col items-start gap-4 rounded-2xl bg-warm-grey-2/10 p-6 backdrop-blur-sm">
              <div className="rounded-full bg-warm-grey-2/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  className="text-warm-white"
                >
                  <path
                    fill="currentColor"
                    d="M18.667 22c-1.222 0-2.264-.434-3.125-1.303-.86-.869-1.292-1.916-1.292-3.14 0-1.223.431-2.27 1.292-3.14.861-.869 1.903-1.303 3.125-1.303 1.222 0 2.264.434 3.125 1.303.86.87 1.291 1.917 1.291 3.14 0 1.224-.43 2.271-1.291 3.14-.861.869-1.903 1.303-3.125 1.303Z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Tidkrevende manuelle prosesser</h4>
                <p className="text-sm text-warm-grey-1">
                  Dagens verktøy krever omfattende manuelt arbeid for analyse og
                  rapportering, noe som øker risikoen for feil og
                  ineffektivitet.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col items-start gap-4 rounded-2xl bg-warm-grey-2/10 p-6 backdrop-blur-sm">
              <div className="rounded-full bg-warm-grey-2/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  className="text-warm-white"
                >
                  <path
                    fill="currentColor"
                    d="M4.333 22c-.611 0-1.134-.217-1.569-.653C2.329 20.91 2.111 20.387 2.111 19.776V6.667c0-.611.218-1.134.653-1.57.435-.435.958-.652 1.57-.652h17.777c.611 0 1.134.217 1.57.653.435.435.652.958.652 1.57v13.11c0 .61-.217 1.133-.653 1.57-.435.435-.958.652-1.57.652H4.334Z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Fragmenterte løsninger</h4>
                <p className="text-sm text-warm-grey-1">
                  Eksisterende verktøy er ikke integrert, noe som fører til
                  duplisering av arbeid og manglende oversikt over porteføljen.
                </p>
              </div>
            </Card>
          </div> */}
        </div>
      </div>
    </section>
  )
}
