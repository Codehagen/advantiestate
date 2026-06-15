import Link from "next/link"

import ExpandingArrow from "./icons/expanding-arrow"

// Only slug + title are needed to render the link. Typed against the
// lightweight HELP_LINK_INDEX (not the full HelpPost) so this component never
// drags the compiled-MDX corpus into the client bundle. `article` may be
// undefined when a referenced slug isn't in the index — guarded below.
interface HelpArticleLinkProps {
  article?: { slug: string; title: string }
}

export default function HelpArticleLink({ article }: HelpArticleLinkProps) {
  if (!article || !article.slug) {
    return null // Or return a fallback UI
  }

  return (
    <Link
      href={`/help/article/${article.slug}`}
      className="group flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-warm-grey-2/20 active:bg-warm-grey-2/30 sm:px-4"
    >
      <h3 className="text-sm font-medium text-warm-grey/80 group-hover:text-warm-grey sm:text-base">
        {article.title || "Untitled Article"}
      </h3>
      <ExpandingArrow className="-ml-4 h-4 w-4 text-warm-grey/60 group-hover:text-warm-grey/80" />
    </Link>
  )
}
