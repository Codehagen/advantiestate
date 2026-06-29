"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import Modal from "@/components/blog/modal"
import { RiCloseLine, RiLightbulbLine, RiCheckLine } from "@remixicon/react"
import { useRef, useState, type Dispatch, type SetStateAction } from "react"
import { submitCtaLead } from "@/app/actions/cta-lead"
import { trackLeadSubmit } from "@/lib/analytics"
import { useLeadStartOnFocus } from "@/lib/hooks/useLeadFunnel"

interface AdvisoryRequestModalProps {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}

export default function AdvisoryRequestModal({
  showModal,
  setShowModal,
}: AdvisoryRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const onFirstFocus = useLeadStartOnFocus("service-modal", "Rådgivning")
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Synchronous double-submit guard: isSubmitting only flips after a re-render,
  // so two clicks in the same frame would both dispatch the lead.
  const submitting = useRef(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitCtaLead({
      formType: "Rådgivning",
      name: `${formData.get("firstname")} ${formData.get("lastname")}`,
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? "") || undefined,
      pageUrl: window.location.pathname,
      fields: {
        Selskap: String(formData.get("company") ?? ""),
        Område: String(formData.get("advisoryArea") ?? ""),
        Beskrivelse: String(formData.get("description") ?? ""),
      },
    })

    setIsSubmitting(false)
    submitting.current = false
    if (result.ok) {
      trackLeadSubmit("service-modal", "Rådgivning")
      setIsSuccess(true)
      setTimeout(() => { setShowModal(false); setIsSuccess(false) }, 3000)
    } else {
      setError(result.error)
    }
  }

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      className="max-h-[85vh] overflow-y-auto"
    >
      <div className="relative bg-warm-white">
        <div className="border-b border-warm-grey-1/20 bg-gradient-to-br from-light-blue/10 to-warm-white px-6 py-6">
          <button
            type="button"
            aria-label="Lukk"
            onClick={() => setShowModal(false)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-warm-grey-2 transition-colors hover:bg-warm-grey-1/10"
          >
            <RiCloseLine aria-hidden="true" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-light-blue/20 p-3">
              <RiLightbulbLine className="h-6 w-6 text-warm-grey" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-warm-grey">
                Be om rådgivning
              </h2>
              <p className="mt-1 text-sm text-warm-grey-2">
                Vi hjelper deg med kompetent rådgivning om næringseiendom
              </p>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <div className="mb-4 rounded-full bg-green-100 p-4">
              <RiCheckLine className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-warm-grey">
              Takk for din henvendelse!
            </h3>
            <p className="mt-2 text-center text-warm-grey-2">
              Vi vil kontakte deg innen 24 timer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} onFocusCapture={onFirstFocus} className="px-6 py-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstname" className="mb-2 block text-sm font-medium text-warm-grey">
                    Fornavn *
                  </label>
                  <Input id="firstname" name="firstname" type="text" placeholder="Fornavn" required />
                </div>
                <div>
                  <label htmlFor="lastname" className="mb-2 block text-sm font-medium text-warm-grey">
                    Etternavn *
                  </label>
                  <Input id="lastname" name="lastname" type="text" placeholder="Etternavn" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-warm-grey">
                    E-post *
                  </label>
                  <Input id="email" name="email" type="email" placeholder="din@epost.no" required />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-warm-grey">
                    Telefon *
                  </label>
                  <Input id="phone" name="phone" type="tel" placeholder="+47 123 45 678" required />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="mb-2 block text-sm font-medium text-warm-grey">
                  Selskap
                </label>
                <Input id="company" name="company" type="text" placeholder="Ditt selskap" />
              </div>
              <div>
                <label htmlFor="advisoryArea" className="mb-2 block text-sm font-medium text-warm-grey">
                  Rådgivningsområde *
                </label>
                <Select name="advisoryArea" required>
                  <SelectTrigger id="advisoryArea">
                    <SelectValue placeholder="Velg område" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financing">Finansiering</SelectItem>
                    <SelectItem value="strategy">Strategi</SelectItem>
                    <SelectItem value="market">Markedsanalyse</SelectItem>
                    <SelectItem value="valuation">Verdivurdering</SelectItem>
                    <SelectItem value="other">Annet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-warm-grey">
                  Beskriv ditt behov *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="w-full rounded-md border border-warm-grey-1 bg-warm-white px-3 py-2 text-warm-grey shadow-sm transition-colors placeholder:text-warm-grey-2 focus:border-warm-grey focus:outline-none focus:ring-2 focus:ring-light-blue/50"
                  placeholder="Fortell oss om ditt behov for rådgivning..."
                />
              </div>
            </div>
            <div className="mt-6">
              {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Sender..." : "Send forespørsel"}
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-warm-grey-2">
              Ved å sende inn dette skjemaet godtar du at vi kontakter deg.
            </p>
          </form>
        )}
      </div>
    </Modal>
  )
}
