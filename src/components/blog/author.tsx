import Link from "next/link"
import { RiLinkedinFill, RiTwitterXFill } from "@remixicon/react"

import BlurImage from "@/lib/blog/blur-image"
import { timeAgo } from "@/lib/utils"
import { cx } from "@/lib/utils"

type Author = {
  name: string
  image: string
  bio?: string
  twitter?: string
  linkedin?: string
}

type Authors = {
  [key: string]: Author
}

const authors: Authors = {
  codehagen: {
    name: "Christer Hagen",
    image:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/addc4b60-4c8f-47d7-10ab-6f9048432500/public",
    bio: "Gründer og partner i Advanti Estate. Ekspert på næringseiendom i Nord-Norge med fokus på verdivurdering og markedsanalyse.",
    twitter: "codehagen",
    linkedin: "christerhagen",
  },
  vsoraas: {
    name: "Vegard Søraas",
    image:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/76037f97-384f-4681-176e-5b8a0ba71300/public",
    bio: "Partner i Advanti Estate. Spesialisert på salg og utleie av næringseiendom med dyp kunnskap om markedet i Nord-Norge.",
  },
}

export default async function Author({
  username,
  updatedAt,
  imageOnly,
}: {
  username: string
  updatedAt?: string
  imageOnly?: boolean
}) {
  if (!authors[username]) {
    console.error(`Author not found: ${username}`)
    return null
  }

  return imageOnly ? (
    <BlurImage
      src={authors[username].image}
      alt={authors[username].name}
      width={36}
      height={36}
      className="rounded-full transition-all group-hover:brightness-90"
    />
  ) : updatedAt ? (
    <div className="flex items-center space-x-3">
      <BlurImage
        src={authors[username].image}
        alt={authors[username].name}
        width={36}
        height={36}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="text-sm text-warm-white/80">
          Skrevet av {authors[username].name}
        </p>
        <time
          dateTime={updatedAt}
          className="text-sm font-light text-warm-white/60"
        >
          Sist oppdatert {timeAgo(new Date(updatedAt))}
        </time>
      </div>
    </div>
  ) : (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <BlurImage
          src={authors[username].image}
          alt={authors[username].name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-warm-white">
            {authors[username].name}
          </p>
          {authors[username].bio && (
            <p className="mt-1 text-sm leading-relaxed text-warm-white/70">
              {authors[username].bio}
            </p>
          )}
        </div>
      </div>
      {(authors[username].twitter || authors[username].linkedin) && (
        <div className="flex items-center space-x-3">
          {authors[username].twitter && (
            <Link
              href={`https://twitter.com/${authors[username].twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                "flex items-center justify-center rounded-full border border-warm-grey-2/20 bg-warm-grey-2/10 p-2 text-warm-white/60 transition-colors",
                "hover:border-warm-grey-2/30 hover:bg-warm-grey-2/20 hover:text-warm-white"
              )}
              aria-label={`${authors[username].name} på Twitter`}
            >
              <RiTwitterXFill className="h-4 w-4" />
            </Link>
          )}
          {authors[username].linkedin && (
            <Link
              href={`https://linkedin.com/in/${authors[username].linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                "flex items-center justify-center rounded-full border border-warm-grey-2/20 bg-warm-grey-2/10 p-2 text-warm-white/60 transition-colors",
                "hover:border-warm-grey-2/30 hover:bg-warm-grey-2/20 hover:text-warm-white"
              )}
              aria-label={`${authors[username].name} på LinkedIn`}
            >
              <RiLinkedinFill className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
