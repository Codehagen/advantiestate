"use client"

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react"
import { useState } from "react"
// import { toast } from "sonner"

export default function CopyBox(props: { title: string; copy: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="not-prose my-4 rounded-xl border border-warm-grey-2/20 bg-warm-white p-4">
      <p>{props.title}</p>
      <div className="mt-1 flex w-full items-center justify-between rounded-md bg-warm-grey-2/10 p-1.5 pl-3">
        <div className="scrollbar-hide overflow-auto">
          <p className="whitespace-nowrap text-warm-grey/70 sm:text-sm">
            {props.copy}
          </p>
        </div>
        <button
          type="button"
          aria-label={copied ? "Kopiert" : "Kopier"}
          className="rounded-md p-1 transition-colors hover:bg-warm-grey-2/10 active:bg-warm-grey-2/20"
          onClick={() => {
            navigator.clipboard.writeText(props.copy)
            setCopied(true)
            // toast.success("Copied to clipboard")
            setTimeout(() => setCopied(false), 3000)
          }}
        >
          {copied ? (
            <RiCheckLine aria-hidden="true" className="h-4 w-4 text-warm-grey/60" />
          ) : (
            <RiFileCopyLine aria-hidden="true" className="h-4 w-4 text-warm-grey/60" />
          )}
        </button>
      </div>
    </div>
  )
}
