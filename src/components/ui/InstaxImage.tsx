"use client"
import { cx } from "@/lib/utils"
import Image from "next/image"

export function InstaxImage({
  className,
  src,
  width,
  height,
  alt,
  caption,
}: {
  className?: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
}) {
  return (
    <figure
      className={cx(
        "h-fit overflow-hidden rounded-lg bg-warm-white shadow-xl shadow-warm-grey/10 ring-1 ring-warm-grey/5 transition hover:-translate-y-0.5 hover:shadow-warm-grey/20 dark:bg-warm-grey dark:shadow-light-blue/5 dark:ring-warm-white/20 dark:hover:shadow-light-blue/20",
        className,
      )}
    >
      <div className="bg-warm-grey/5 p-2 dark:bg-warm-grey-2">
        <div className="relative overflow-hidden rounded">
          <div className="absolute inset-0 shadow-[inset_0px_0px_3px_0px_rgb(0,0,0,0.1)] dark:shadow-[inset_0px_0px_3px_0px_rgb(255,255,255,0.1)]"></div>
          <Image src={src} alt={alt} width={width} height={height} />
        </div>
      </div>
      <div
        className={cx(
          "px-2 pb-2 pt-2 font-handwriting text-xl text-warm-grey dark:text-warm-grey-1",
        )}
      >
        <figcaption className="text-center">{caption}</figcaption>
      </div>
    </figure>
  )
}
