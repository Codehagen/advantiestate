"use client"
import { submitOnboarding } from "@/app/actions/onboarding/onboarding"
import { searchOrganization } from "@/app/actions/onboarding/search-organization"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/RadioCardGroup"
import { cx } from "@/lib/utils"
import React from "react"

interface Step {
  name: string
  href: string
}

const steps: Step[] = [
  { name: "Formål", href: "purpose" },
  { name: "Bedrift", href: "company" },
  { name: "Kontakt", href: "contact" },
]

interface StepProgressProps {
  currentStep: number
}

const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div aria-label="Onboarding progress" className="mb-8">
      <ol className="mx-auto flex w-24 flex-nowrap gap-1 md:w-fit">
        {steps.map((step, index) => (
          <li
            key={step.name}
            className={cx(
              "h-1 w-12 rounded-full",
              index <= currentStep - 1
                ? "bg-warm-grey dark:bg-warm-white"
                : "bg-warm-grey-2/30 dark:bg-warm-grey-1/30",
            )}
          >
            <span className="sr-only">
              {step.name}{" "}
              {index < currentStep - 1
                ? "completed"
                : index === currentStep - 1
                  ? "current"
                  : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

const purposes = [
  {
    id: "valuation",
    title: "Verdivurdering",
    description: "Få nøyaktige verdivurderinger av eiendommer",
  },
  {
    id: "search",
    title: "Finne nye eiendommer",
    description: "Søk og analyser potensielle investeringsmuligheter",
  },
  {
    id: "market",
    title: "Markedsanalyse",
    description: "Få innsikt i eiendomsmarkedet og trender",
  },
  {
    id: "portfolio",
    title: "Porteføljestyring",
    description: "Administrer og optimaliser eiendomsporteføljen din",
  },
]

interface FormData {
  step: number
  purpose: string
  company: {
    name: string
    orgNumber: string
    address: string
  }
  contact: {
    name: string
    email: string
    phone: string
  }
}

interface FormErrors {
  email?: string
  phone?: string
}

interface CompanySearchResult {
  name: string
  orgnr: string
  address: string
  zip: string
  city: string
}

export default function Products() {
  const [formData, setFormData] = React.useState<FormData>({
    step: 1,
    purpose: "",
    company: {
      name: "",
      orgNumber: "",
      address: "",
    },
    contact: {
      name: "",
      email: "",
      phone: "",
    },
  })
  const [formErrors, setFormErrors] = React.useState<FormErrors>({})
  const [loading, setLoading] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<
    CompanySearchResult[]
  >([])
  const [searching, setSearching] = React.useState(false)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleNextStep = () => {
    if (formData.step < 3) {
      setFormData((prev) => ({ ...prev, step: prev.step + 1 }))
    } else {
      // Validate contact form before submission
      const emailError = validateEmail(formData.contact.email)
      const phoneError = validatePhone(formData.contact.phone)
      setFormErrors({ email: emailError, phone: phoneError })

      if (!emailError && !phoneError && formData.contact.name) {
        handleSubmit()
      }
    }
  }

  const handlePrevStep = () => {
    if (formData.step > 1) {
      setFormData((prev) => ({ ...prev, step: prev.step - 1 }))
      // Clear errors when going back
      setFormErrors({})
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await submitOnboarding({
        purpose: formData.purpose,
        company: formData.company,
        contact: formData.contact,
      })

      if (response.success) {
        // Show success message with loading animation
        const message = document.createElement("div")
        message.className =
          "fixed inset-0 z-50 flex items-center justify-center bg-warm-grey/20 backdrop-blur-sm dark:bg-warm-grey-1/20 motion-safe:animate-fadeIn"
        message.innerHTML = `
          <div class="relative rounded-lg bg-warm-white p-8 shadow-lg dark:bg-warm-grey motion-safe:animate-scaleIn">
            <div class="flex flex-col items-center gap-6 text-center">
              <div class="text-3xl font-semibold text-warm-grey dark:text-warm-white motion-safe:animate-slideDown">
                Velkommen til PropDock!
              </div>
              <div class="space-y-3 motion-safe:animate-fadeIn" style="animation-delay: 200ms">
                <p class="text-lg text-warm-grey dark:text-warm-white">
                  Takk for registreringen!
                </p>
                <p class="text-warm-grey-2 dark:text-warm-grey-1">
                  Vi setter opp Propdock for deg...
                </p>
              </div>
              <div class="flex items-center gap-2 motion-safe:animate-fadeIn" style="animation-delay: 400ms">
                <div class="h-2 w-2 animate-[wave_1s_ease-in-out_infinite] rounded-full bg-warm-grey dark:bg-warm-white"></div>
                <div class="h-2 w-2 animate-[wave_1s_ease-in-out_infinite_200ms] rounded-full bg-warm-grey dark:bg-warm-white"></div>
                <div class="h-2 w-2 animate-[wave_1s_ease-in-out_infinite_400ms] rounded-full bg-warm-grey dark:bg-warm-white"></div>
              </div>
            </div>
          </div>
        `
        document.body.appendChild(message)

        // Wait a moment to show the message
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Redirect to simulation
        window.location.href = "/propdock/simulering"
      } else {
        alert("Det oppstod en feil. Vennligst prøv igjen.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Det oppstod en feil. Vennligst prøv igjen.")
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "E-post er påkrevd"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Ugyldig e-postadresse"
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Telefonnummer er påkrevd"
    // Norwegian phone number format (8 digits, optional country code)
    const phoneRegex = /^(?:\+47|0047)?[2-9]\d{7}$/
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      return "Ugyldig telefonnummer (8 siffer)"
    }
    return undefined
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, email },
    }))
    const error = validateEmail(email)
    setFormErrors((prev) => ({ ...prev, email: error }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, phone },
    }))
    const error = validatePhone(phone)
    setFormErrors((prev) => ({ ...prev, phone: error }))
  }

  const isStepValid = () => {
    switch (formData.step) {
      case 1:
        return formData.purpose !== ""
      case 2:
        return (
          formData.company.name !== "" &&
          formData.company.orgNumber !== "" &&
          formData.company.address !== ""
        )
      case 3:
        // Only check validity without setting state
        return (
          formData.contact.name !== "" &&
          !validateEmail(formData.contact.email) &&
          !validatePhone(formData.contact.phone)
        )
      default:
        return false
    }
  }

  const handleCompanySearch = async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!query) {
      setSearchResults([])
      return
    }

    setSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      const result = await searchOrganization(query)
      if (result.success && result.data) {
        setSearchResults(result.data)
      } else {
        setSearchResults([])
      }
      setSearching(false)
    }, 300)
  }

  const selectCompany = (company: CompanySearchResult) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        name: company.name,
        orgNumber: company.orgnr,
        address: `${company.address}, ${company.zip} ${company.city}`,
      },
    }))
    setSearchResults([])
  }

  return (
    <main className="mx-auto max-w-2xl p-4">
      <StepProgress currentStep={formData.step} />

      {formData.step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
              Hva skal du bruke PropDock til?
            </h1>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Velg hovedformålet ditt for å få en tilpasset opplevelse.
            </p>
          </div>

          <RadioCardGroup
            value={formData.purpose}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, purpose: value }))
            }
            required
            aria-label="Velg formål"
            className="space-y-2"
          >
            {purposes.map((purpose, index) => (
              <div
                className="motion-safe:animate-revealBottom"
                key={purpose.id}
                style={{
                  animationDuration: "600ms",
                  animationDelay: `${100 + index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <RadioCardItem
                  className={cx(
                    "border-warm-grey-2/20 bg-warm-white active:scale-[99%] dark:border-warm-grey-1/20 dark:bg-warm-grey",
                    "has-[:checked]:border-warm-grey has-[:checked]:ring-1 has-[:checked]:ring-warm-grey dark:has-[:checked]:border-warm-white dark:has-[:checked]:ring-warm-white",
                    "hover:bg-warm-grey-2/5 dark:hover:bg-warm-grey-1/5",
                  )}
                  value={purpose.id}
                >
                  <div className="flex items-start gap-2.5">
                    <RadioCardIndicator className="mt-1 text-warm-grey dark:text-warm-white" />
                    <div>
                      <span className="block font-medium text-warm-grey dark:text-warm-white">
                        {purpose.title}
                      </span>
                      <span className="mt-1 block text-sm text-warm-grey-2 dark:text-warm-grey-1">
                        {purpose.description}
                      </span>
                    </div>
                  </div>
                </RadioCardItem>
              </div>
            ))}
          </RadioCardGroup>
        </div>
      )}

      {formData.step === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
              Bedriftsinformasjon
            </h1>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Søk etter din bedrift med navn eller organisasjonsnummer.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="companySearch"
                className="text-warm-grey dark:text-warm-white"
              >
                Søk etter bedrift
              </Label>
              <Input
                id="companySearch"
                placeholder="Bedriftsnavn eller org.nummer"
                onChange={(e) => handleCompanySearch(e.target.value)}
                className="border-warm-grey-2/20 bg-warm-white text-warm-grey placeholder:text-warm-grey-2 dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white dark:placeholder:text-warm-grey-1"
              />
            </div>

            {searching && (
              <p className="text-sm text-warm-grey-2 dark:text-warm-grey-1">
                Søker...
              </p>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2 rounded-md border border-warm-grey-2/20 p-2 dark:border-warm-grey-1/20">
                {searchResults.map((company) => (
                  <button
                    key={company.orgnr}
                    onClick={() => selectCompany(company)}
                    type="button"
                    className={cx(
                      "w-full rounded-md p-2 text-left transition-colors",
                      "hover:bg-warm-grey-2/5 dark:hover:bg-warm-grey-1/5",
                    )}
                  >
                    <div className="text-sm font-medium text-warm-grey dark:text-warm-white">
                      {company.name}
                    </div>
                    <div className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
                      Org.nr: {company.orgnr}
                    </div>
                    <div className="text-xs text-warm-grey-2 dark:text-warm-grey-1">
                      {company.address}, {company.zip} {company.city}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {formData.company.name && (
              <div className="rounded-md border border-warm-grey-2/20 p-4 dark:border-warm-grey-1/20">
                <h3 className="font-medium text-warm-grey dark:text-warm-white">
                  Valgt bedrift
                </h3>
                <div className="mt-2 space-y-1 text-sm text-warm-grey-2 dark:text-warm-grey-1">
                  <p>{formData.company.name}</p>
                  <p>Org.nr: {formData.company.orgNumber}</p>
                  <p>{formData.company.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {formData.step === 3 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-warm-grey dark:text-warm-white">
              Kontaktinformasjon
            </h2>
            <p className="text-warm-grey-2 dark:text-warm-grey-1">
              Hvordan kan vi kontakte deg?
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-warm-grey dark:text-warm-white"
              >
                Navn
              </Label>
              <Input
                id="name"
                value={formData.contact.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, name: e.target.value },
                  }))
                }
                className="border-warm-grey-2/20 bg-warm-white text-warm-grey placeholder:text-warm-grey-2 dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white dark:placeholder:text-warm-grey-1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-warm-grey dark:text-warm-white"
              >
                E-post
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={handleEmailChange}
                className={cx(
                  "border-warm-grey-2/20 bg-warm-white text-warm-grey placeholder:text-warm-grey-2 dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white dark:placeholder:text-warm-grey-1",
                  formErrors.email && "border-red-500 dark:border-red-500",
                )}
                required
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-warm-grey dark:text-warm-white"
              >
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.contact.phone}
                onChange={handlePhoneChange}
                placeholder="f.eks. +47 12345678"
                className={cx(
                  "border-warm-grey-2/20 bg-warm-white text-warm-grey placeholder:text-warm-grey-2 dark:border-warm-grey-1/20 dark:bg-warm-grey dark:text-warm-white dark:placeholder:text-warm-grey-1",
                  formErrors.phone && "border-red-500 dark:border-red-500",
                )}
                required
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {formData.step > 1 && (
          <Button
            variant="secondary"
            onClick={handlePrevStep}
            className="border-warm-grey-2/20 text-warm-grey hover:bg-warm-grey-2/10 dark:border-warm-grey-1/20 dark:text-warm-white dark:hover:bg-warm-grey-1/10"
          >
            Tilbake
          </Button>
        )}
        <Button
          className={cx(
            "ml-auto bg-warm-grey text-warm-white hover:bg-warm-grey/90 dark:bg-warm-white dark:text-warm-grey dark:hover:bg-warm-white/90",
            "disabled:bg-warm-grey-2/30 disabled:text-warm-grey-2 dark:disabled:bg-warm-grey-1/30 dark:disabled:text-warm-grey-1",
          )}
          onClick={handleNextStep}
          disabled={!isStepValid() || loading}
          isLoading={loading}
        >
          {formData.step === 3 ? "Fullfør" : "Neste"}
        </Button>
      </div>
    </main>
  )
}
