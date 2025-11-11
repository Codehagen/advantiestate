"use client"

import { useState } from "react"
import { Button } from "@/components/Button"
import { RiCalculatorLine, RiTeamLine } from "@remixicon/react"
import ValuationRequestModal from "@/components/modals/ValuationRequestModal"
import ConsultationModal from "@/components/modals/ConsultationModal"

export function ValuationCTAButton({
  className = "",
  variant = "default",
  size = "default"
}: {
  className?: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className={className}
        variant={variant}
        size={size}
      >
        <RiCalculatorLine className="mr-2 h-5 w-5" />
        Få gratis verdivurdering
      </Button>
      <ValuationRequestModal showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export function ConsultationCTAButton({
  className = "",
  variant = "default",
  size = "default"
}: {
  className?: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className={className}
        variant={variant}
        size={size}
      >
        <RiTeamLine className="mr-2 h-5 w-5" />
        Book konsultasjon
      </Button>
      <ConsultationModal showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export function CTAButtonGroup({ className = "" }: { className?: string }) {
  const [showValuationModal, setShowValuationModal] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)

  return (
    <>
      <div className={`flex flex-col gap-4 sm:flex-row ${className}`}>
        <Button
          onClick={() => setShowValuationModal(true)}
          size="lg"
          className="flex-1"
        >
          <RiCalculatorLine className="mr-2 h-5 w-5" />
          Gratis verdivurdering
        </Button>
        <Button
          onClick={() => setShowConsultationModal(true)}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <RiTeamLine className="mr-2 h-5 w-5" />
          Book konsultasjon
        </Button>
      </div>

      <ValuationRequestModal
        showModal={showValuationModal}
        setShowModal={setShowValuationModal}
      />
      <ConsultationModal
        showModal={showConsultationModal}
        setShowModal={setShowConsultationModal}
      />
    </>
  )
}
