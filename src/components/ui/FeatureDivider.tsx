"use client"

import { Divider } from "@/components/ui/Divider"

export default function FeatureDivider({ className }: { className?: string }) {
  return (
    <Divider className={className}>
      <div className="relative h-4 w-5">
        <div
          className="bg-warm-grey-2 dark:bg-warm-grey-1 absolute left-0 top-0 size-1 rounded-full transition-colors"
          style={{
            animation: `wave 2s infinite ease-in-out`,
            animationDelay: `${0 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 dark:bg-warm-grey-1 absolute left-4 top-0 size-1 rounded-full transition-colors"
          style={{
            animation: `wave 2s infinite ease-in-out`,
            animationDelay: `${0 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 dark:bg-warm-grey-1 absolute left-2 top-1 size-1 rounded-full transition-colors"
          style={{
            animation: `wave 2s infinite ease-in-out`,
            animationDelay: `${2 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 dark:bg-warm-grey-1 absolute left-0 top-2 size-1 rounded-full transition-colors"
          style={{
            animation: `wave 2s infinite ease-in-out`,
            animationDelay: `${3 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 dark:bg-warm-grey-1 absolute left-4 top-2 size-1 rounded-full transition-colors"
          style={{
            animation: `wave 2s infinite ease-in-out`,
            animationDelay: `${3 * 0.2}s`,
          }}
        />
        <div
          className="bg-warm-grey-2 dark:bg-warm-grey-1 absolute left-2 top-3 size-1 rounded-full transition-colors"
          style={{
            animation: `wave 2s infinite ease-in-out`,
            animationDelay: `${5 * 0.2}s`,
          }}
        />
      </div>
    </Divider>
  )
}

// Add this to your globals.css file if not already present
/*
@keyframes wave {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-3px);
    opacity: 1;
  }
}
*/
