"use client";

import { siteConfig } from "@/app/siteConfig";
import useScroll from "@/lib/use-scroll";
import { cx } from "@/lib/utils";
import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import React from "react";
import { DatabaseLogo } from "../../../public/DatabaseLogo";
import { Button } from "../Button";

export function Navigation() {
  const scrolled = useScroll(15);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 1024px)");
    const handleMediaQueryChange = () => {
      setOpen(false);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <header
      className={cx(
        "fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu animate-slide-down-fade justify-center overflow-hidden rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
        open === true ? "h-52" : "h-16",
        scrolled || open === true
          ? "backdrop-blur-nav max-w-4xl border-warm-grey-1/20 bg-warm-white/80 shadow-xl shadow-warm-grey/5 dark:border-warm-white/10 dark:bg-warm-grey/80"
          : "bg-warm-white/0 dark:bg-warm-grey/0"
      )}
    >
      <div className="w-full lg:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={siteConfig.baseLinks.home} aria-label="Advanti Estate">
            <span className="sr-only">Advanti Estate</span>
            <DatabaseLogo className="w-28 lg:w-32" />
          </Link>
          <nav className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:block lg:-translate-x-1/2 lg:-translate-y-1/2 lg:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link
                className="whitespace-nowrap px-2 py-1 text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.about}
              >
                Om oss
              </Link>
              <Link
                className="whitespace-nowrap px-2 py-1 text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.tjenester}
              >
                Tjenester
              </Link>
              <Link
                className="whitespace-nowrap px-2 py-1 text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.naringsmegler}
              >
                Næringsmegler
              </Link>
              <Link
                className="whitespace-nowrap px-2 py-1 text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.personer}
              >
                Team
              </Link>
              <Link
                className="whitespace-nowrap px-2 py-1 text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.blog}
              >
                Artikler
              </Link>
              <Link
                className="whitespace-nowrap px-2 py-1 text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.help}
              >
                Kunnskapsbase
              </Link>
              {/* <Link
                className="whitespace-nowrap px-2 py-1 text-warm-grey hover:text-warm-grey-3 dark:text-warm-white dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.verktoy}
              >
                Verktøy
              </Link> */}
            </div>
          </nav>
          <Link
            href={siteConfig.baseLinks.kontakt}
            data-track="navbar-kontakt-cta"
            data-track-action="click"
          >
            <Button className="hidden h-10 font-semibold lg:flex">
              Ta kontakt
            </Button>
          </Link>
          <div className="flex gap-x-2 lg:hidden">
            <Button asChild>
              <Link
                href={siteConfig.baseLinks.kontakt}
                data-track="navbar-kontakt-cta"
                data-track-action="click"
              >
                Ta kontakt
              </Link>
            </Button>
            <Button
              onClick={() => setOpen(!open)}
              variant="ghost"
              className="aspect-square p-2"
            >
              {open ? (
                <RiCloseLine aria-hidden="true" className="size-5" />
              ) : (
                <RiMenuLine aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <nav
          className={cx(
            "my-6 flex text-lg ease-in-out will-change-transform lg:hidden",
            open ? "" : "hidden"
          )}
        >
          <ul className="space-y-4 font-medium text-warm-grey dark:text-warm-white">
            <li onClick={() => setOpen(false)}>
              <Link
                className="hover:text-warm-grey-3 dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.about}
              >
                Om oss
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                className="hover:text-warm-grey-3 dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.tjenester}
              >
                Tjenester
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                className="hover:text-warm-grey-3 dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.naringsmegler}
              >
                Næringsmegler
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                className="hover:text-warm-grey-3 dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.personer}
              >
                Team
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                className="hover:text-warm-grey-3 dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.blog}
              >
                Artikler
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                className="hover:text-warm-grey-3 dark:hover:text-warm-grey-1"
                href={siteConfig.baseLinks.verktoy}
              >
                Verktøy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
