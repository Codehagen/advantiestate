"use client"

import { useState, useEffect } from "react"
import { RiCalculatorLine, RiCloseLine } from "@remixicon/react"
import ValuationRequestModal from "@/components/modals/ValuationRequestModal"
import { cx } from "@/lib/utils"

export default function FloatingCTA() {
  const [showModal, setShowModal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show CTA after user scrolls down 500px
    const handleScroll = () => {
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <>
      <div
        className={cx(
          "fixed bottom-6 right-6 z-30 transition-all duration-300",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <div className="relative">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-warm-grey p-1.5 text-warm-white shadow-lg transition-colors hover:bg-warm-grey-2 dark:bg-warm-white dark:text-warm-grey dark:hover:bg-warm-grey-1"
            aria-label="Lukk"
          >
            <RiCloseLine className="h-4 w-4" />
          </button>

          {/* Main CTA Button */}
          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-light-blue to-light-blue/80 px-6 py-4 pr-8 text-warm-grey shadow-2xl transition-all hover:scale-105 hover:shadow-3xl dark:text-warm-grey"
          >
            <div className="rounded-full bg-warm-grey/10 p-2">
              <RiCalculatorLine className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Uforpliktende Verdivurdering</div>
              <div className="text-xs opacity-90">Få svar innen 24 timer</div>
            </div>
          </button>

          {/* Pulse animation */}
          <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-light-blue opacity-20" />
        </div>
      </div>

      <ValuationRequestModal showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}
