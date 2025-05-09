"use client"

import { Icons } from "@/components/investor/icons"
import { Button } from "@/components/ui/button"
import useMediaQuery from "@/lib/hooks/use-media-query"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

const ReactHlsPlayer = dynamic(() => import("react-hls-player"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

type Props = {
  playVideo: boolean
}

export function SectionDemo({ playVideo }: Props) {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setPlaying] = useState(true)
  const { isDesktop } = useMediaQuery()

  useHotkeys(
    "space",
    () => {
      togglePlay()
    },
    [],
  )

  useHotkeys(
    "backspace",
    () => {
      handleRestart()
    },
    [playerRef],
  )

  useEffect(() => {
    if (isDesktop) {
      if (playVideo) {
        togglePlay()
      } else {
        togglePlay()
      }
    }
  }, [playVideo, isDesktop])

  const handleRestart = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0
    }
  }

  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pause()
    } else {
      playerRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }

    setPlaying((prev) => !prev)
  }

  return (
    <section className="relative w-full bg-warm-white py-24 text-warm-grey md:py-32 dark:bg-warm-grey dark:text-warm-white">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header with navigation context */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-warm-grey-2">04</span>
            <h2 className="text-xl font-medium tracking-tight">Demo</h2>
          </div>
          <Link
            href="/"
            className="text-warm-grey-2 transition-colors hover:text-warm-grey-1"
          >
            propdock.no
          </Link>
        </div>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-warm-grey-2">
                Version 0.5 (Private beta)
              </p>
              <h3 className="text-3xl font-medium leading-tight md:text-4xl">
                Se hvordan Propdock transformerer eiendomsanalyse
              </h3>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute left-[50%] top-[50%] z-30 -ml-[100px] -mt-[50px] hidden h-[50px] w-[200px] items-center justify-center space-x-4 opacity-0 transition-all group-hover:opacity-100 md:flex">
              <Button
                className="h-14 w-14 rounded-full border border-white bg-transparent text-white hover:bg-transparent"
                onClick={handleRestart}
              >
                <Icons.Reply size={24} />
              </Button>
              <Button className="h-14 w-14 rounded-full" onClick={togglePlay}>
                {isPlaying ? (
                  <Icons.PauseOutline size={24} />
                ) : (
                  <Icons.PlayOutline size={24} />
                )}
              </Button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-warm-grey-2/10">
              <ReactHlsPlayer
                onClick={togglePlay}
                src="https://customer-oh6t55xltlgrfayh.cloudflarestream.com/3c8ebd39be71d2451dee78d497b89a23/manifest/video.m3u8"
                autoPlay={false}
                controls={!isDesktop}
                playerRef={playerRef}
                className="aspect-video w-full bg-[#121212]"
                loop
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
