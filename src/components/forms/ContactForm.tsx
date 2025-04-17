"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"

export default function ContactForm() {
  return (
    <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstname"
              className="text-warm-grey dark:text-warm-white sr-only"
            >
              Fornavn
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
              className="text-warm-grey dark:text-warm-white sr-only"
            >
              Etternavn
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
        <div>
          <label
            htmlFor="email"
            className="text-warm-grey dark:text-warm-white sr-only"
          >
            E-post
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="E-post"
            required
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="text-warm-grey dark:text-warm-white sr-only"
          >
            Telefon
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Telefon"
            required
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="text-warm-grey dark:text-warm-white sr-only"
          >
            Melding
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="border-warm-grey-1 bg-warm-white text-warm-grey placeholder:text-warm-grey-2 focus:border-warm-grey focus:ring-light-blue/50 dark:border-warm-grey-2 dark:bg-warm-grey dark:text-warm-white dark:placeholder:text-warm-grey-1 dark:focus:border-warm-grey-1 dark:focus:ring-light-blue/30 w-full rounded-md shadow-sm focus:ring-2"
            placeholder="Din melding"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Send melding
      </Button>
    </form>
  )
}
