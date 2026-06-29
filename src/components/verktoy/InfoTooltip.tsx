"use client"

import { RiInformationLine } from "@remixicon/react"
import { useId } from "react"

/**
 * Accessible info tooltip for calculator field labels. The trigger is a real
 * focusable <button> (keyboard- and screen-reader-reachable, unlike the old
 * hover-only <div>); the help text shows on hover and on keyboard focus
 * (group-focus-within) and is linked to the button via aria-describedby, so
 * assistive tech announces it even while visually hidden. Render it as a
 * sibling of the <label> (never inside it) so it does not pollute the input's
 * accessible name.
 */
export function InfoTooltip({
  text,
  label = "Mer info",
}: {
  text: string
  label?: string
}) {
  const id = `tip-${useId().replace(/:/g, "")}`
  return (
    <span className="group relative ml-2 inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        className="inline-flex size-5 items-center justify-center rounded-full text-warm-grey-2 transition-colors hover:text-warm-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-grey"
      >
        <RiInformationLine aria-hidden="true" className="size-4" />
      </button>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-warm-grey px-3 py-2 text-xs font-normal text-warm-white shadow-lg group-hover:block group-focus-within:block"
      >
        {text}
      </span>
    </span>
  )
}
