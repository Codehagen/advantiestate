import { Button } from "@/components/Button";
import Link from "next/link";
import { RiMailLine, RiTeamLine } from "@remixicon/react";

interface CalculatorCTAProps {
  title?: string;
  description?: string;
}

export function CalculatorCTA({
  title = "Trenger du profesjonell rådgivning?",
  description = "Våre eksperter kan hjelpe deg med å tolke resultatene og gi deg skreddersydd rådgivning for din næringseiendom.",
}: CalculatorCTAProps) {
  return (
    <div className="mt-12 rounded-xl border border-warm-grey-1/20 bg-gradient-to-br from-warm-grey/5 to-light-blue/5 p-8 dark:border-warm-white/10 dark:from-warm-grey-2/20 dark:to-light-blue/10">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
          {title}
        </h3>
        <p className="mt-3 text-warm-grey-2 dark:text-warm-grey-1">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/kontakt">
            <Button className="h-10 w-full font-semibold sm:w-auto">
              <RiMailLine className="mr-2 size-4" />
              Kontakt oss
            </Button>
          </Link>
          <Link href="/personer">
            <Button
              variant="outline"
              className="h-10 w-full font-semibold sm:w-auto"
            >
              <RiTeamLine className="mr-2 size-4" />
              Snakk med en ekspert
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
