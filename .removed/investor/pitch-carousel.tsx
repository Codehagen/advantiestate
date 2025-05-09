"use client"

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/investor/carousel"
import { SectionStart } from "@/components/investor/section-start"
import { useEffect, useRef, useState } from "react"
import { CarouselToolbar } from "./carousel-toolbar"
import { SectionBook } from "./section-book"
import { SectionBusinessModel } from "./section-business-model"
import { SectionDemo } from "./section-demo"
import { SectionExpansion } from "./section-expansion"
import { SectionFutureGrowth } from "./section-future-growth"
import { SectionMarket } from "./section-market"
import { SectionProblem } from "./section-problem"
import { SectionSolution } from "./section-solution"
import { SectionTraction } from "./section-traction"

export function PitchCarusel() {
  const [views, setViews] = useState(0)
  const called = useRef(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    async function fetchViewsCount() {
      try {
        // const data = await setViewCount("pitch");
        // setViews(data);
        setViews(18000)
      } catch {}
    }

    if (!called.current) {
      fetchViewsCount()
      called.current = true
    }
  }, [called.current])

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Carousel className="relative min-h-full w-full" setApi={setApi}>
      <CarouselContent>
        <CarouselItem>
          <SectionStart />
        </CarouselItem>
        <CarouselItem>
          <SectionProblem />
        </CarouselItem>
        <CarouselItem>
          <SectionSolution />
        </CarouselItem>
        <CarouselItem>
          <SectionDemo playVideo={current === 4} />
        </CarouselItem>
        <CarouselItem>
          <SectionMarket />
        </CarouselItem>
        <CarouselItem>
          <SectionTraction />
        </CarouselItem>
        <CarouselItem>
          <SectionBusinessModel />
        </CarouselItem>
        <CarouselItem>
          <SectionFutureGrowth />
        </CarouselItem>
        {/* <CarouselItem>
          <SectionGrowthStrategy />
        </CarouselItem> */}
        <CarouselItem>
          <SectionExpansion />
        </CarouselItem>
        {/* <CarouselItem>
          <SectionTeam />
        </CarouselItem> */}
        <CarouselItem>
          <SectionBook />
        </CarouselItem>
      </CarouselContent>

      <CarouselToolbar views={views} />
    </Carousel>
  )
}
