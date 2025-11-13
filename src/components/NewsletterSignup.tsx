"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { RiMailLine, RiCheckLine } from "@remixicon/react"
import { useState } from "react"

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "footer"
  title?: string
  description?: string
}

export default function NewsletterSignup({
  variant = "inline",
  title = "Hold deg oppdatert",
  description = "Få de nyeste markedsinnsiktene og tips om næringseiendom direkte i innboksen din.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/discord-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          formType: "Nyhetsbrev",
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setEmail("")
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        setError("Noe gikk galt. Vennligst prøv igjen.")
      }
    } catch (error) {
      setError("Noe gikk galt. Vennligst prøv igjen.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-warm-grey-1/20 bg-gradient-to-br from-light-blue/10 via-warm-white to-warm-white p-8 shadow-lg dark:border-warm-grey-2/20 dark:from-light-blue/5 dark:via-warm-grey dark:to-warm-grey">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-light-blue/20 p-3">
            <RiMailLine className="h-6 w-6 text-warm-grey dark:text-warm-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-warm-grey dark:text-warm-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
              {description}
            </p>

            {isSuccess ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <RiCheckLine className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Takk! Du er nå påmeldt nyhetsbrevet vårt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="din@epost.no"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sender..." : "Meld deg på"}
                  </Button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-warm-grey dark:text-warm-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-warm-grey-2 dark:text-warm-grey-1">
          {description}
        </p>

        {isSuccess ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
            <RiCheckLine className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Takk for at du meldte deg på!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="din@epost.no"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sender..." : "Meld deg på"}
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    )
  }

  // Default inline variant
  return (
    <div className="w-full">
      {isSuccess ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-100 p-4 dark:bg-green-900/30">
          <RiCheckLine className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Takk! Du er nå påmeldt nyhetsbrevet vårt.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="din@epost.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sender..." : "Meld deg på"}
          </Button>
        </form>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
