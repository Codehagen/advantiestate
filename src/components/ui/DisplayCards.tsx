"use client"

import { cx } from "@/lib/utils"
import { RiBuildingLine } from "@remixicon/react"

interface DisplayCardProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  date?: string
  iconClassName?: string
  titleClassName?: string
}

function DisplayCard({
  className,
  icon = <RiBuildingLine className="text-light-blue size-4" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-warm-grey dark:text-warm-white",
  titleClassName = "text-warm-grey dark:text-warm-white",
}: DisplayCardProps) {
  return (
    <div
      className={cx(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border px-4 py-3 transition-all duration-700",
        "border-warm-grey/10 dark:border-warm-white/10",
        "bg-warm-grey/5 dark:bg-warm-grey/20",
        "backdrop-blur-sm",
        "after:from-warm-white dark:after:from-warm-grey after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:to-transparent after:content-['']",
        "before:absolute before:left-0 before:top-0 before:h-[100%] before:w-[100%] before:rounded-xl before:bg-blend-overlay before:content-['']",
        "before:bg-warm-white/50 dark:before:bg-warm-grey/50",
        "before:transition-opacity before:duration-700 hover:before:opacity-0",
        "hover:border-warm-grey/20 dark:hover:border-warm-white/20",
        "hover:bg-warm-grey/[7.5%] dark:hover:bg-warm-grey/30",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className,
      )}
    >
      <div>
        <span className="bg-warm-grey/5 ring-warm-grey/5 dark:bg-warm-grey/20 dark:ring-warm-white/5 relative inline-block rounded-full p-1 ring-1">
          {icon}
        </span>
        <p className={cx("text-lg font-medium", titleClassName)}>{title}</p>
      </div>
      <p className="text-warm-grey-2 dark:text-warm-grey-1 whitespace-nowrap text-lg">
        {description}
      </p>
      <p className="text-warm-grey-2 dark:text-warm-grey-1">{date}</p>
    </div>
  )
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[]
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      title: "Kontorbygg Bodø",
      description: "2,500 m² - Solgt for 45 MNOK",
      date: "Mars 2024",
      className:
        "[grid-area:stack] hover:-translate-y-10 grayscale-[100%] hover:grayscale-0",
    },
    {
      title: "Kjøpesenter Fauske",
      description: "5,000 m² - Solgt for 85 MNOK",
      date: "Februar 2024",
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 grayscale-[100%] hover:grayscale-0",
    },
    {
      title: "Lager Mo i Rana",
      description: "3,200 m² - Solgt for 28 MNOK",
      date: "Januar 2024",
      className:
        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ]

  const displayCards = cards || defaultCards

  return (
    <div className="flex min-h-[400px] w-full items-center justify-center py-20">
      <div className="w-full max-w-3xl">
        <div className="animate-in fade-in-0 grid place-items-center opacity-100 duration-700 [grid-template-areas:'stack']">
          {displayCards.map((cardProps, index) => (
            <DisplayCard key={index} {...cardProps} />
          ))}
        </div>
      </div>
    </div>
  )
}
