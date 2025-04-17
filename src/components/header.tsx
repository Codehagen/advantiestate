"use client";

import Drawer from "@/components/drawer";
import { Icons } from "@/components/icons";
import Menu from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);

  // Handle scroll effect for border
  useEffect(() => {
    const handleScroll = () => {
      setAddBorder(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={
        "relative sticky top-0 z-50 py-2 bg-background/60 backdrop-blur"
      }
    >
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            title="brand-logo"
            className="relative flex items-center space-x-2"
          >
            <Icons.logo className="w-auto h-[40px]" />
            <span className="font-bold text-xl">{siteConfig.name}</span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Menu />
            </div>

            <nav className="flex items-center space-x-4">
              {/* <Link
                href="/au/real-estate"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                })}
              >
                Real Estate
              </Link>
              <Link
                href="/au/landscaping"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                })}
              >
                Landscaping
              </Link> */}
            </nav>
          </div>

          <div className="md:hidden">
            <Drawer />
          </div>
        </div>
      </div>
      <hr
        className={cn(
          "absolute bottom-0 w-full transition-opacity duration-300 ease-in-out",
          addBorder ? "opacity-100" : "opacity-0"
        )}
      />
    </header>
  );
}
