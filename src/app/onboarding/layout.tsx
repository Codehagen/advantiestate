import { constructMetadata } from "@/lib/utils"
import React from "react"

export const metadata = constructMetadata({
  title: "Simulering og Onboarding | Propdock",
  description:
    "Test og utforsk Propdocks avanserte verdsettelsesverktøy gjennom vår interaktive simulering. Lær hvordan du kan utføre presise verdivurderinger av næringseiendom.",
})

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <main id="main-content" className="mx-auto mb-20 mt-28 max-w-lg">
        {children}
      </main>
    </>
  )
}

export default Layout
