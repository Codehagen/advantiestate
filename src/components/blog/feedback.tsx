"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
// import va from "@vercel/analytics"
// import Cookies from "js-cookie"
// import { toast } from "sonner"

import { cx } from "@/lib/utils"

const reactions = [
  {
    emoji: "😞",
    label: "Ikke hjelpsom",
  },
  {
    emoji: "😐",
    label: "Litt hjelpsom",
  },
  {
    emoji: "😀",
    label: "Veldig hjelpsom",
  },
]

export default function Feedback() {
  const { slug } = useParams() as { slug: string }

  const [reaction, setReaction] = useState<string | null>(null)

  // Commenting out cookie-related effect for now
  // useEffect(() => {
  //   const reaction = Cookies.get(`feedback-help-${slug}`)
  //   if (reaction) setReaction(reaction)
  // }, [slug, reaction])

  return (
    <div className="mb-10 flex flex-col items-center justify-center space-y-2 border-t border-gray-200 py-10">
      <p className="text-gray-500 sm:text-lg">Svarte dette på ditt spørsmål?</p>
      <div className="flex space-x-4">
        {reactions.map(({ emoji, label }) => (
          <button
            key={label}
            onClick={() => {
              // va.track(`Help Center Feedback: ${label}`, {
              //   slug: `/help/article/${slug}`,
              // })
              // Cookies.set(`feedback-help-${slug}`, label)
              setReaction(label)
              // toast.success("Feedback registered – thank you!")
            }}
            className={cx(
              "text-4xl transition-all duration-75 hover:scale-110 active:scale-100",
              {
                "scale-90 grayscale": reaction && reaction !== label,
                "scale-110": reaction === label,
              },
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
