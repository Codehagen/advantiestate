import { Icons } from "@/components/icons";
import { siteConfig } from "@/lib/config";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto py-16 sm:px-10 px-5 pb-0">
        <a
          href="/"
          title={siteConfig.name}
          className="relative mr-6 flex items-center space-x-2"
        >
          <Icons.logo className="w-auto h-[40px]" />
          <span className="font-bold text-xl">{siteConfig.name}</span>
        </a>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 mt-8">
          {siteConfig.footer.map((section, index) => (
            <div key={index} className="mb-5">
              <h2 className="font-semibold">{section.title}</h2>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="my-2">
                    <Link
                      href={link.href}
                      className="group inline-flex cursor-pointer items-center justify-start gap-1 text-muted-foreground duration-200 hover:text-foreground hover:opacity-90"
                    >
                      {link.icon && link.icon}
                      {link.text}
                      <ChevronRight className="h-4 w-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 text-sm text-warm-grey-2 dark:text-warm-grey-1 sm:grid-cols-2">
          <div>
            <h2 className="font-semibold text-warm-grey dark:text-warm-white">
              Kontakt Bodø
            </h2>
            <address className="mt-2 not-italic">
              <div className="font-medium text-warm-grey dark:text-warm-white">
                Dronningens gate 18
              </div>
              <div>8006 Bodø</div>
            </address>
            <div className="mt-2">
              <a
                href="tel:+4798453571"
                className="block text-warm-grey hover:text-warm-grey-3 dark:text-warm-white"
              >
                +47 984 53 571
              </a>
              <a
                href="mailto:Christer@advanti.no"
                className="block hover:text-warm-grey-3"
              >
                Christer@advanti.no
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-warm-grey dark:text-warm-white">
              Kontakt Alta
            </h2>
            <address className="mt-2 not-italic">
              <div className="font-medium text-warm-grey dark:text-warm-white">
                AMFI Alta, Markedsgata 21/25
              </div>
              <div>9510 Alta</div>
            </address>
            <div className="mt-2">
              <a
                href="tel:+4798038737"
                className="block text-warm-grey hover:text-warm-grey-3 dark:text-warm-white"
              >
                +47 980 38 737
              </a>
              <a
                href="mailto:Havard@advanti.no"
                className="block hover:text-warm-grey-3"
              >
                Havard@advanti.no
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t py-2 grid md:grid-cols-2 h-full justify-between w-full grid-cols-1 gap-1">
          <span className="text-sm tracking-tight text-foreground">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer">
              {siteConfig.name}
            </Link>{" "}
            - {siteConfig.description}
          </span>
          <ul className="flex justify-start md:justify-end text-sm tracking-tight text-foreground">
            <li className="mr-3 md:mx-4">
              <Link href="/privacy" rel="noopener noreferrer">
                Personvernpolicy
              </Link>
            </li>
            <li className="mr-3 md:mx-4">
              <Link href="/terms" rel="noopener noreferrer">
                Vilkår for bruk
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
