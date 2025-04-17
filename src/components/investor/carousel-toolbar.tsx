"use client"

import Modal from "@/components/blog/modal"
import { useCarousel } from "@/components/investor/carousel"
import { CopyInput } from "@/components/investor/copy-input"
import { Icons } from "@/components/investor/icons"
import { Tooltip } from "@/components/Tooltip"
import { Button } from "@/components/ui/button"
import { cx } from "@/lib/utils"
import { RiTwitterXLine } from "@remixicon/react"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

type Props = {
  views: number
}

interface PopupCenterProps {
  url: string
  title: string
  w: number
  h: number
}

const popupCenter = ({ url, title, w, h }: PopupCenterProps) => {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    `
    scrollbars=yes,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `,
  )

  return newWindow
}

export function CarouselToolbar({ views }: Props) {
  const api = useCarousel()
  const [showShareModal, setShowShareModal] = useState(false)

  useHotkeys("arrowRight", () => api.scrollNext(), [api])
  useHotkeys("arrowLeft", () => api.scrollPrev(), [api])

  const handleOnShare = () => {
    const popup = popupCenter({
      url: "https://twitter.com/intent/tweet?text=Check this pitch deck https://midday.ai/pitch @middayai",
      title: "Share",
      w: 800,
      h: 400,
    })

    popup?.focus()
  }

  return (
    <>
      <div className="fixed bottom-5 left-0 flex w-full justify-center">
        <AnimatePresence>
          <motion.div animate={{ y: views > 0 ? 0 : 100 }} initial={{ y: 100 }}>
            <div className="flex h-10 items-center space-x-4 border border-[#2C2C2C] bg-[#1A1A1A]/80 px-4 py-2 backdrop-blur-lg backdrop-filter">
              <Tooltip content="Views" side="top" sideOffset={25}>
                <div className="border-border flex items-center space-x-2 border-r-[1px] pr-4 text-[#878787]">
                  <Icons.Visibility size={18} />
                  <span className="text-sm">
                    {Intl.NumberFormat("en", {
                      notation: "compact",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    }).format(views ?? 0)}
                  </span>
                </div>
              </Tooltip>

              <Tooltip
                content="Book a meeting"
                side="top"
                sideOffset={25}
                triggerAsChild={true}
              >
                <button type="button" onClick={() => api.scrollNext()}>
                  <Icons.Calendar size={18} className="text-[#878787]" />
                </button>
              </Tooltip>

              <Tooltip
                content="Share"
                side="top"
                sideOffset={25}
                triggerAsChild={true}
              >
                <button type="button" onClick={() => setShowShareModal(true)}>
                  <Icons.Share size={18} className="-mt-[1px] text-[#878787]" />
                </button>
              </Tooltip>

              <div className="border-border flex items-center border-l-[1px] pl-4">
                <Tooltip
                  content="Previous slide"
                  side="top"
                  sideOffset={25}
                  triggerAsChild={true}
                >
                  <button
                    type="button"
                    disabled={!api?.canScrollPrev}
                    className={cx(!api?.canScrollPrev && "opacity-50")}
                    onClick={() => {
                      api.scrollPrev()
                    }}
                  >
                    <Icons.ChevronLeft className="h-6 w-6" />
                  </button>
                </Tooltip>
                <Tooltip
                  content="Next slide"
                  side="top"
                  sideOffset={25}
                  triggerAsChild={true}
                >
                  <button
                    type="button"
                    disabled={!api?.canScrollNext}
                    className={cx(!api?.canScrollNext && "opacity-50")}
                    onClick={() => {
                      api.scrollNext()
                    }}
                  >
                    <Icons.ChevronRight className="h-6 w-6" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Modal
        showModal={showShareModal}
        setShowModal={setShowShareModal}
        className="sm:max-w-[425px]"
      >
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Share</h2>
            <p className="text-sm text-warm-grey-2">
              Thanks for sharing our pitch deck.
            </p>
          </div>

          <div className="grid gap-6 py-4">
            <CopyInput value="https://propdock.no/investor" />
            <Button
              className="flex h-10 w-full items-center space-x-2"
              onClick={handleOnShare}
            >
              <span>Share on</span>
              <RiTwitterXLine />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
