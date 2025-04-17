"use client"
import { Badge } from "@/components/Badge"
import { RiDragMoveLine } from "@remixicon/react"
import Image from "next/image"
import { useState } from "react"
import Balancer from "react-wrap-balancer"

interface FeatureComparisonProps {
  title: string
  description: string
  badge: string
  lightImage: string
  darkImage: string
}

export function FeatureComparison({
  title,
  description,
  badge,
  lightImage,
  darkImage,
}: FeatureComparisonProps) {
  const [inset, setInset] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    let x = 0

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left
    } else if ("clientX" in e) {
      x = e.clientX - rect.left
    }

    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setInset(percentage)
  }

  return (
    <div className="w-full py-20 lg:py-32">
      <div className="mx-auto max-w-6xl px-3">
        <div className="flex flex-col gap-6">
          <Badge>{badge}</Badge>
          <div className="flex flex-col gap-4">
            <h2 className="bg-gradient-to-t from-warm-grey to-warm-grey-3 bg-clip-text text-3xl font-semibold tracking-tighter text-transparent md:text-5xl dark:from-warm-white dark:to-warm-grey-1">
              <Balancer>{title}</Balancer>
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-warm-grey-2 dark:text-warm-grey-1">
              <Balancer>{description}</Balancer>
            </p>
          </div>
          <div className="mt-8">
            {/* Labels */}
            <div className="mb-4 flex justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-warm-grey-2/50" />
                <span className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                  Excel (Tradisjonell metode)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-warm-grey-2 dark:text-warm-grey-1">
                  Propdock (Moderne plattform)
                </span>
                <div className="h-2 w-2 rounded-full bg-warm-grey-2/50" />
              </div>
            </div>

            <div
              className="group relative aspect-video w-full select-none overflow-hidden rounded-2xl bg-warm-grey/5 shadow-lg shadow-light-blue/10 ring-1 ring-warm-grey/5 dark:bg-warm-grey/20 dark:shadow-light-blue/10 dark:ring-warm-white/5"
              onMouseMove={onMouseMove}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchMove={onMouseMove}
              onTouchEnd={() => setIsDragging(false)}
            >
              {/* Divider Line */}
              <div
                className="absolute top-0 z-20 -ml-[1px] h-full w-0.5 select-none bg-warm-grey-1/20"
                style={{
                  left: inset + "%",
                }}
              >
                <button
                  className="absolute top-1/2 z-30 -ml-4 flex h-8 w-8 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-warm-grey-1/10 backdrop-blur-sm transition-all hover:scale-110 group-hover:bg-warm-grey-1/20"
                  onTouchStart={(e) => {
                    setIsDragging(true)
                    onMouseMove(e)
                  }}
                  onMouseDown={(e) => {
                    setIsDragging(true)
                    onMouseMove(e)
                  }}
                  onTouchEnd={() => setIsDragging(false)}
                  onMouseUp={() => setIsDragging(false)}
                >
                  <RiDragMoveLine className="h-4 w-4 select-none text-warm-white" />
                </button>
              </div>

              {/* Light Mode Image (Excel) */}
              <Image
                src={lightImage}
                alt="Excel verdsettelse"
                width={1920}
                height={1080}
                priority
                className="absolute left-0 top-0 z-10 h-full w-full select-none rounded-2xl"
                style={{
                  clipPath: "inset(0 0 0 " + inset + "%)",
                }}
              />

              {/* Dark Mode Image (Propdock) */}
              <Image
                src={darkImage}
                alt="Propdock verdsettelse"
                width={1920}
                height={1080}
                priority
                className="absolute left-0 top-0 h-full w-full select-none rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
