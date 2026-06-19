"use client"

import { Divider } from "@/components/ui/Divider"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

export default function FeatureDivider({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <Divider className={className}>
      <div className="relative h-4 w-5">
        <div
          className="bg-warm-grey-2 absolute left-0 top-0 size-1 rounded-full transition-colors"
          style={{
            animation: reduce ? undefined : `wave 2s infinite ease-in-out`,
            animationDelay: `${0 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 absolute left-4 top-0 size-1 rounded-full transition-colors"
          style={{
            animation: reduce ? undefined : `wave 2s infinite ease-in-out`,
            animationDelay: `${0 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 absolute left-2 top-1 size-1 rounded-full transition-colors"
          style={{
            animation: reduce ? undefined : `wave 2s infinite ease-in-out`,
            animationDelay: `${2 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 absolute left-0 top-2 size-1 rounded-full transition-colors"
          style={{
            animation: reduce ? undefined : `wave 2s infinite ease-in-out`,
            animationDelay: `${3 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 absolute left-4 top-2 size-1 rounded-full transition-colors"
          style={{
            animation: reduce ? undefined : `wave 2s infinite ease-in-out`,
            animationDelay: `${3 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 absolute left-2 top-3 size-1 rounded-full transition-colors"
          style={{
            animation: reduce ? undefined : `wave 2s infinite ease-in-out`,
            animationDelay: `${5 * 0.2}s`,
          }}
        />
      </div>
    </Divider>
  )
}
