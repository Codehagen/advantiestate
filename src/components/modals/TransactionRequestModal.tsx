"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import Modal from "@/components/blog/modal"
import { RiCloseLine, RiExchangeLine, RiCheckLine } from "@remixicon/react"
import { useState, type Dispatch, type SetStateAction } from "react"
import { submitCtaLead } from "@/app/actions/cta-lead"

interface TransactionRequestModalProps {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}

export default function TransactionRequestModal({
  showModal,
  setShowModal,
}: TransactionRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitCtaLead({
      formType: "Transaksjonshjelp",
      name: `${formData.get("firstname")} ${formData.get("lastname")}`,
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      pageUrl: window.location.pathname,
      fields: {
        Adresse: String(formData.get("propertyAddress") ?? ""),
        "Type transaksjon": String(formData.get("transactionType") ?? ""),
        Tidshorisont: String(formData.get("timeline") ?? ""),
        "Estimert verdi": String(formData.get("estimatedValue") ?? ""),
        Melding: String(formData.get("message") ?? ""),
      },
    })

    setIsSubmitting(false)
    if (result.ok) {
      setIsSuccess(true)
      setTimeout(() => { setShowModal(false); setIsSuccess(false) }, 3000)
    } else {
      setError(result.error)
    }
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="relative overflow-hidden bg-warm-white">
        {/* Header */}
        <div className="border-b border-warm-grey-1/20 bg-gradient-to-br from-light-blue/10 to-warm-white px-6 py-6">
          <button
            onClick={() => setShowModal(false)}
            className="absolute right-4 top-4 rounded-full p-2 text-warm-grey-2 transition-colors hover:bg-warm-grey-1/10"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-light-blue/20 p-3">
              <RiExchangeLine className="h-6 w-6 text-warm-grey" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-warm-grey">
                Be om transaksjonshjelp
              </h2>
              <p className="mt-1 text-sm text-warm-grey-2">
                Vi hjelper deg med kjøp og salg av næringseiendom
              </p>
            </div>
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <div className="mb-4 rounded-full bg-green-100 p-4">
              <RiCheckLine className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-warm-grey">
              Takk for din henvendelse!
            </h3>
            <p className="mt-2 text-center text-warm-grey-2">
              Vi vil kontakte deg innen 24 timer for å diskutere din transaksjon.
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
                      className="mb-2 block text-sm font-medium text-warm-grey"
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
                      className="mb-2 block text-sm font-medium text-warm-grey"
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
                      className="mb-2 block text-sm font-medium text-warm-grey"
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
                      className="mb-2 block text-sm font-medium text-warm-grey"
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

                {/* Property Address */}
                <div>
                  <label
                    htmlFor="propertyAddress"
                    className="mb-2 block text-sm font-medium text-warm-grey"
                  >
                    Eiendomsadresse *
                  </label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    type="text"
                    placeholder="f.eks. Storgata 1, Bodø"
                    required
                  />
                </div>

                {/* Transaction Type & Timeline */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="transactionType"
                      className="mb-2 block text-sm font-medium text-warm-grey"
                    >
                      Transaksjonstype *
                    </label>
                    <Select name="transactionType" required>
                      <SelectTrigger id="transactionType">
                        <SelectValue placeholder="Velg type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kjop">Kjøp</SelectItem>
                        <SelectItem value="salg">Salg</SelectItem>
                        <SelectItem value="begge">Begge deler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="timeline"
                      className="mb-2 block text-sm font-medium text-warm-grey"
                    >
                      Tidsramme
                    </label>
                    <Input
                      id="timeline"
                      name="timeline"
                      type="text"
                      placeholder="f.eks. Innen 6 måneder"
                    />
                  </div>
                </div>

                {/* Estimated Value */}
                <div>
                  <label
                    htmlFor="estimatedValue"
                    className="mb-2 block text-sm font-medium text-warm-grey"
                  >
                    Estimert verdi (kr)
                  </label>
                  <Input
                    id="estimatedValue"
                    name="estimatedValue"
                    type="number"
                    placeholder="10 000 000"
                  />
                </div>

                {/* Additional Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-warm-grey"
                  >
                    Tilleggsinformasjon
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full rounded-md border border-warm-grey-1 bg-warm-white px-3 py-2 text-warm-grey shadow-sm transition-colors placeholder:text-warm-grey-2 focus:border-warm-grey focus:outline-none focus:ring-2 focus:ring-light-blue/50"
                    placeholder="Fortell oss mer om transaksjonen..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Sender..." : "Send forespørsel"}
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-warm-grey-2">
                Ved å sende inn dette skjemaet godtar du at vi kontakter deg om din transaksjon.
              </p>
            </form>
          </>
        )}
      </div>
    </Modal>
  )
}
