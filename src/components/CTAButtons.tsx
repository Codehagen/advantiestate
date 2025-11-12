"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import {
  RiCalculatorLine,
  RiTeamLine,
  RiExchangeLine,
  RiBuilding4Line,
  RiLightbulbLine,
  RiRoadMapLine,
} from "@remixicon/react";
import ValuationRequestModal from "@/components/modals/ValuationRequestModal";
import ConsultationModal from "@/components/modals/ConsultationModal";
import TransactionRequestModal from "@/components/modals/TransactionRequestModal";
import LeaseRequestModal from "@/components/modals/LeaseRequestModal";
import AdvisoryRequestModal from "@/components/modals/AdvisoryRequestModal";
import StrategicAdvisoryModal from "@/components/modals/StrategicAdvisoryModal";

export function ValuationCTAButton({
  className = "",
  variant = "primary",
}: {
  className?: string;
  variant?: "primary" | "secondary" | "light" | "ghost" | "destructive";
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className={className}
        variant={variant}
      >
        <RiCalculatorLine className="mr-2 h-5 w-5" />
        Få gratis verdivurdering
      </Button>
      <ValuationRequestModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
}

export function ConsultationCTAButton({
  className = "",
  variant = "primary",
}: {
  className?: string;
  variant?: "primary" | "secondary" | "light" | "ghost" | "destructive";
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className={className}
        variant={variant}
      >
        <RiTeamLine className="mr-2 h-5 w-5" />
        Bli kontaktet
      </Button>
      <ConsultationModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export function CTAButtonGroup({ className = "" }: { className?: string }) {
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  return (
    <>
      <div className={`flex flex-col gap-4 sm:flex-row ${className}`}>
        <Button onClick={() => setShowValuationModal(true)} className="flex-1">
          <RiCalculatorLine className="mr-2 h-5 w-5" />
          Gratis verdsettelse
        </Button>
        <Button
          onClick={() => setShowConsultationModal(true)}
          variant="secondary"
          className="flex-1"
        >
          <RiTeamLine className="mr-2 h-5 w-5" />
          Bli kontaktet
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
  );
}

export function TransactionCTAButtonGroup({
  className = "",
}: {
  className?: string;
}) {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  return (
    <>
      <div className={`flex flex-col gap-4 sm:flex-row ${className}`}>
        <Button
          onClick={() => setShowTransactionModal(true)}
          className="flex-1"
        >
          <RiCalculatorLine className="mr-2 h-5 w-5" />
          Gratis verdsettelse
        </Button>
        <Button
          onClick={() => setShowConsultationModal(true)}
          variant="secondary"
          className="flex-1"
        >
          <RiTeamLine className="mr-2 h-5 w-5" />
          Bli kontaktet
        </Button>
      </div>

      <TransactionRequestModal
        showModal={showTransactionModal}
        setShowModal={setShowTransactionModal}
      />
      <ConsultationModal
        showModal={showConsultationModal}
        setShowModal={setShowConsultationModal}
      />
    </>
  );
}

export function LeaseCTAButtonGroup({
  className = "",
}: {
  className?: string;
}) {
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  return (
    <>
      <div className={`flex flex-col gap-4 sm:flex-row ${className}`}>
        <Button onClick={() => setShowLeaseModal(true)} className="flex-1">
          <RiBuilding4Line className="mr-2 h-5 w-5" />
          Finn lokaler
        </Button>
        <Button
          onClick={() => setShowConsultationModal(true)}
          variant="secondary"
          className="flex-1"
        >
          <RiTeamLine className="mr-2 h-5 w-5" />
          Bli kontaktet
        </Button>
      </div>

      <LeaseRequestModal
        showModal={showLeaseModal}
        setShowModal={setShowLeaseModal}
      />
      <ConsultationModal
        showModal={showConsultationModal}
        setShowModal={setShowConsultationModal}
      />
    </>
  );
}

export function AdvisoryCTAButtonGroup({
  className = "",
}: {
  className?: string;
}) {
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  return (
    <>
      <div className={`flex flex-col gap-4 sm:flex-row ${className}`}>
        <Button onClick={() => setShowAdvisoryModal(true)} className="flex-1">
          <RiLightbulbLine className="mr-2 h-5 w-5" />
          Be om rådgivning
        </Button>
        <Button
          onClick={() => setShowConsultationModal(true)}
          variant="secondary"
          className="flex-1"
        >
          <RiTeamLine className="mr-2 h-5 w-5" />
          Bli kontaktet
        </Button>
      </div>

      <AdvisoryRequestModal
        showModal={showAdvisoryModal}
        setShowModal={setShowAdvisoryModal}
      />
      <ConsultationModal
        showModal={showConsultationModal}
        setShowModal={setShowConsultationModal}
      />
    </>
  );
}

export function StrategicAdvisoryCTAButtonGroup({
  className = "",
}: {
  className?: string;
}) {
  const [showStrategicModal, setShowStrategicModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  return (
    <>
      <div className={`flex flex-col gap-4 sm:flex-row ${className}`}>
        <Button onClick={() => setShowStrategicModal(true)} className="flex-1">
          <RiRoadMapLine className="mr-2 h-5 w-5" />
          Book strategisessjon
        </Button>
        <Button
          onClick={() => setShowConsultationModal(true)}
          variant="secondary"
          className="flex-1"
        >
          <RiTeamLine className="mr-2 h-5 w-5" />
          Bli kontaktet
        </Button>
      </div>

      <StrategicAdvisoryModal
        showModal={showStrategicModal}
        setShowModal={setShowStrategicModal}
      />
      <ConsultationModal
        showModal={showConsultationModal}
        setShowModal={setShowConsultationModal}
      />
    </>
  );
}
