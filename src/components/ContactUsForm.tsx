"use client";

import { useState } from "react";
import { Input } from "./Input";
import { Divider } from "./ui/Divider";
import { submitContactInquiry } from "@/app/actions/onboarding/onboarding";

export default function ContactUsForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Alle felter med * må fylles ut.");
      return;
    }
    // Basic email validation (can be more sophisticated)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Vennligst oppgi en gyldig e-postadresse.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactInquiry({ name, phone, email });
      if (result.success) {
        setIsSubmitted(true);
        setName("");
        setPhone("");
        setEmail("");
      } else {
        setError(result.error || "Innsending feilet. Vennligst prøv igjen.");
      }
    } catch (err) {
      setError("En uventet feil oppstod. Vennligst prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="sm:mx-auto sm:max-w-2xl py-12 text-center">
        <h3 className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Takk for din henvendelse!
        </h3>
        <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Vi kontakter deg så snart som mulig.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="sm:mx-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="col-span-full">
              <label
                htmlFor="name"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Navn
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Ditt navn"
                className="mt-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="col-span-full sm:col-span-1">
              <label
                htmlFor="phone"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Telefon
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                placeholder="Ditt telefonnummer"
                className="mt-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="col-span-full sm:col-span-1">
              <label
                htmlFor="email"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                E-post
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Din e-postadresse"
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
          <Divider className="mt-8" />
          <div className="mt-6 flex items-center justify-end space-x-4">
            <button
              type="submit"
              className="whitespace-nowrap rounded-tremor-default bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sender..." : "Send Henvendelse"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
