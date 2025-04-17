// 'use client';

import { Card } from "../Card"

function ContentPlaceholder() {
  return (
    <div className="relative h-full overflow-hidden rounded bg-gray-50 dark:bg-gray-800">
      <svg
        className="absolute inset-0 h-full w-full stroke-gray-200 dark:stroke-gray-700"
        fill="none"
      >
        <defs>
          <pattern
            id="pattern-3"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
          </pattern>
        </defs>
        <rect
          stroke="none"
          fill="url(#pattern-3)"
          width="100%"
          height="100%"
        ></rect>
      </svg>
    </div>
  )
}

export default function Example() {
  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <main className="pt-32">
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="h-36 p-2">
              <ContentPlaceholder />
            </Card>
            <Card className="h-36 p-2">
              <ContentPlaceholder />
            </Card>
            <Card className="h-36 p-2">
              <ContentPlaceholder />
            </Card>
          </div>
          <Card className="mt-4 h-96 p-2">
            <ContentPlaceholder />
          </Card>
        </main>
      </div>
    </>
  )
}
