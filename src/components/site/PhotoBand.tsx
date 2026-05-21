import Image from "next/image";

export interface PhotoBandProps {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Full-bleed editorial photo band — breaks up long content pages and
 * carries the photo-first design intent. Spans the viewport edge-to-edge.
 */
export function PhotoBand({ src, alt, caption }: PhotoBandProps) {
  return (
    <section className="photo-band" aria-hidden={caption ? undefined : true}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      {caption && <span className="photo-band-caption">{caption}</span>}
    </section>
  );
}
