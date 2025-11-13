"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import Modal from "@/components/blog/modal"
import { RiCloseLine, RiCalculatorLine, RiCheckLine } from "@remixicon/react"
import { useState } from "react"

interface ValuationRequestModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
}

export default function ValuationRequestModal({
  showModal,
  setShowModal,
}: ValuationRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: `${formData.get("firstname")} ${formData.get("lastname")}`,
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      propertyType: formData.get("propertyType"),
      size: formData.get("size"),
      income: formData.get("income"),
      costs: formData.get("costs"),
      formType: "Verdsettelse",
    }

    try {
      // Send to Discord webhook or your backend
      const response = await fetch("/api/discord-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          setShowModal(false)
          setIsSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="relative overflow-hidden bg-warm-white dark:bg-warm-grey">
        {/* Header */}
        <div className="border-b border-warm-grey-1/20 bg-gradient-to-br from-light-blue/10 to-warm-white px-6 py-6 dark:border-warm-grey-2/20 dark:from-light-blue/5 dark:to-warm-grey">
          <button
            onClick={() => setShowModal(false)}
            className="absolute right-4 top-4 rounded-full p-2 text-warm-grey-2 transition-colors hover:bg-warm-grey-1/10 dark:text-warm-grey-1 dark:hover:bg-warm-grey-2/20"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-light-blue/20 p-3">
              <RiCalculatorLine className="h-6 w-6 text-warm-grey dark:text-warm-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
                Gratis verdsettelse
              </h2>
              <p className="mt-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Få en profesjonell innledende verdsettelse av din næringseiendom
              </p>
            </div>
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
              <RiCheckLine className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
              Takk for din henvendelse!
            </h3>
            <p className="mt-2 text-center text-warm-grey-2 dark:text-warm-grey-1">
              Vi vil kontakte deg innen 24 timer for å diskutere verdivurdering av din eiendom.
            </p>
          </div>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      Fornavn *
                    </label>
                    <Input
                      id="firstname"
                      name="firstname"
                      type="text"
                      placeholder="Fornavn"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      Etternavn *
                    </label>
                    <Input
                      id="lastname"
                      name="lastname"
                      type="text"
                      placeholder="Etternavn"
                      required
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      E-post *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="din@epost.no"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      Telefon *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+47 123 45 678"
                      required
                    />
                  </div>
                </div>

                {/* Address / Location */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                  >
                    Adresse / Sted *
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="f.eks. Storgata 1, Bodø"
                    required
                  />
                </div>

                {/* Property Type & Size */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="propertyType"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      Eiendomstype *
                    </label>
                    <Select name="propertyType" required>
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Velg eiendomstype" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kontor">Kontor</SelectItem>
                        <SelectItem value="handel">Handel / Butikk</SelectItem>
                        <SelectItem value="industri">Industri / Lager</SelectItem>
                        <SelectItem value="bolig">Bolig (flermannsbolig)</SelectItem>
                        <SelectItem value="hotell">Hotell / Overnatting</SelectItem>
                        <SelectItem value="annet">Annet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="size"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      Areal (m²)
                    </label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      placeholder="1000"
                    />
                  </div>
                </div>

                {/* Income & Costs */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="income"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      Årlige inntekter (kr)
                    </label>
                    <Input
                      id="income"
                      name="income"
                      type="number"
                      placeholder="1 000 000"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="costs"
                      className="mb-2 block text-sm font-medium text-warm-grey dark:text-warm-white"
                    >
                      Årlige kostnader (kr)
                    </label>
                    <Input
                      id="costs"
                      name="costs"
                      type="number"
                      placeholder="500 000"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Sender..." : "Send forespørsel"}
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-warm-grey-2 dark:text-warm-grey-1">
                Ved å sende inn dette skjemaet godtar du at vi kontakter deg om din eiendom.
              </p>
            </form>
          </>
        )}
      </div>
    </Modal>
  )
}
