import { cx } from "@/lib/utils"
import type { BundledLanguage, BundledTheme } from "shiki"
import { codeToHtml } from "shiki"
import CopyToClipboard from "./CopyToClipboard"

type Props = {
  code: string
  lang?: BundledLanguage
  theme?: BundledTheme
  filename?: string
  copy?: boolean
  className?: string
}

export default async function Code({
  code,
  lang = "typescript",
  copy = false,
  // tokyo-night
  // catppuccin-macchiato
  // min-dark
  // poimandres
  theme = "poimandres",
  className,
}: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme,
  })

  return (
    <div
      className={cx(
        "bg-warm-grey dark:shadow-light-blue/30 dark:ring-warm-white/5 relative w-full overflow-auto rounded-xl shadow-xl shadow-black/40 ring-1 ring-black",
        className,
      )}
    >
      {copy && (
        <div className="from-warm-grey/0 via-warm-grey/70 to-warm-grey absolute right-0 h-full w-24 bg-gradient-to-r">
          <div className="absolute right-3 top-3">
            <CopyToClipboard code={code} />
          </div>
        </div>
      )}

      <div
        className="[&>pre]:!bg-warm-grey [&>pre]:dark:!bg-warm-grey text-sm [&>pre]:overflow-x-auto [&>pre]:py-6 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  )
}
