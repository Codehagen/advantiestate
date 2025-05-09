import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";
import { DatabaseLogo } from "../../../public/DatabaseLogo";
import ThemeSwitch from "../ThemeSwitch";

const navigation = {
  produkter: [
    { name: "Verdsettelse", href: "/tjenester/verdsettelse", external: false },
    {
      name: "Transaksjon",
      href: "/tjenester/salg",
      external: false,
    },
    { name: "Utleie", href: "/tjenester/utleie", external: false },
    {
      name: "Strategisk Rådgivning",
      href: "/tjenester/strategisk-radgivning",
      external: false,
    },
  ],
  ressurser: [
    { name: "Investor", href: "#", external: false },
    { name: "Markedsrapporter", href: "/markedsinnsikt", external: false },
    { name: "Kunnskapssenter", href: "/help", external: false },
  ],
  selskap: [
    { name: "Om oss", href: "/om-oss", external: false },
    { name: "Kontakt", href: "/kontakt", external: false },
    { name: "Karriere", href: "#", external: false },
    { name: "Blogg", href: "/blog", external: false },
    { name: "Kunder", href: "/kunder", external: false },
  ],
  juridisk: [
    { name: "Personvern", href: "#", external: false },
    { name: "Brukervilkår", href: "#", external: false },
    { name: "Cookies", href: "#", external: false },
  ],
};

export default function Footer() {
  return (
    <footer id="footer">
      <div className="mx-auto max-w-6xl px-3 pb-8 pt-16 sm:pt-24 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-20">
          <div className="space-y-8">
            <DatabaseLogo className="w-32 sm:w-40" />
            <p className="text-sm leading-6 text-warm-grey-2 dark:text-warm-grey-1">
              Advanti er din erfarne næringsmegler i Nord-Norge, spesialisert på
              kjøp, salg og utleie av næringseiendom.
            </p>
            <div className="flex space-x-6">
              <ThemeSwitch />
            </div>
            <div></div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-warm-grey dark:text-warm-white">
                  Tjenester
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Hurtiglenker Produkter"
                >
                  {navigation.produkter.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-warm-grey-2 transition hover:text-warm-grey-3 dark:text-warm-grey-1 dark:hover:text-warm-white"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-warm-grey/5 p-px dark:bg-warm-grey-3/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-warm-grey dark:text-warm-white"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-warm-grey dark:text-warm-white">
                  Ressurser
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Hurtiglenker Ressurser"
                >
                  {navigation.ressurser.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-warm-grey-2 transition hover:text-warm-grey-3 dark:text-warm-grey-1 dark:hover:text-warm-white"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-0.5 aspect-square size-3 rounded-full bg-warm-grey/5 p-px dark:bg-warm-grey-3/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-warm-grey dark:text-warm-white"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-warm-grey dark:text-warm-white">
                  Selskap
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Hurtiglenker Selskap"
                >
                  {navigation.selskap.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-warm-grey-2 transition hover:text-warm-grey-3 dark:text-warm-grey-1 dark:hover:text-warm-white"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-warm-grey/5 p-px dark:bg-warm-grey-3/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-warm-grey dark:text-warm-white"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-warm-grey dark:text-warm-white">
                  Juridisk
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-4"
                  aria-label="Hurtiglenker Juridisk"
                >
                  {navigation.juridisk.map((item) => (
                    <li key={item.name} className="w-fit">
                      <Link
                        className="flex rounded-md text-sm text-warm-grey-2 transition hover:text-warm-grey-3 dark:text-warm-grey-1 dark:hover:text-warm-white"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        <span>{item.name}</span>
                        {item.external && (
                          <div className="ml-1 aspect-square size-3 rounded-full bg-warm-grey/5 p-px dark:bg-warm-grey-3/20">
                            <RiArrowRightUpLine
                              aria-hidden="true"
                              className="size-full shrink-0 text-warm-grey dark:text-warm-white"
                            />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-warm-grey/10 pt-8 sm:mt-20 sm:flex-row lg:mt-24 dark:border-warm-white/10">
          <p className="text-sm leading-5 text-warm-grey-2 dark:text-warm-grey-1">
            &copy; {new Date().getFullYear()} Advanti. Alle rettigheter
            reservert.
          </p>
          <div className="rounded-full border border-warm-grey/10 py-1 pl-1 pr-2.5 dark:border-warm-white/10">
            <div className="flex items-center gap-2">
              <div className="relative size-4 shrink-0">
                <div className="absolute inset-[1px] rounded-full bg-emerald-400/20" />
                <div className="absolute inset-1 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-warm-grey dark:text-warm-white">
                Alle systemer operasjonelle
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
