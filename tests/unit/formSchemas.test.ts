import { describe, it, expect } from "vitest"
import {
  newsletterSchema,
  ctaLeadSchema,
  verdivurderingIntakeSchema,
  investorAccessSchema,
  contactInquirySchema,
} from "@/lib/forms/schemas"

// Validation gate for the lead/contact server actions. These lock the
// required-field sets + email format + that blank optional fields become
// undefined (not "") so they drop out of the Discord notification.

describe("newsletterSchema", () => {
  it("accepts a valid email and lowercases + trims it", () => {
    const r = newsletterSchema.safeParse({ email: "  Ola@Example.NO " })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.email).toBe("ola@example.no")
  })

  it("rejects a malformed email", () => {
    expect(newsletterSchema.safeParse({ email: "not-an-email" }).success).toBe(
      false,
    )
    expect(newsletterSchema.safeParse({ email: "" }).success).toBe(false)
  })

  it("turns a blank optional field into undefined", () => {
    const r = newsletterSchema.safeParse({ email: "a@b.no", firstName: "" })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.firstName).toBeUndefined()
  })
})

describe("verdivurderingIntakeSchema", () => {
  const base = {
    email: "a@b.no",
    propertyType: "Kontor",
    location: "Bodø",
    purpose: "Vurderer salg",
  }

  it("accepts the hard-intent minimum (email + type + location + purpose)", () => {
    expect(verdivurderingIntakeSchema.safeParse(base).success).toBe(true)
  })

  it("rejects when a required field is missing", () => {
    expect(
      verdivurderingIntakeSchema.safeParse({ ...base, location: "" }).success,
    ).toBe(false)
    expect(
      verdivurderingIntakeSchema.safeParse({ ...base, purpose: "" }).success,
    ).toBe(false)
  })

  it("caps an over-long free-text field", () => {
    const r = verdivurderingIntakeSchema.safeParse({
      ...base,
      notes: "x".repeat(5000),
    })
    expect(r.success).toBe(false)
  })
})

describe("ctaLeadSchema", () => {
  it("requires name + valid email; formType is optional", () => {
    expect(
      ctaLeadSchema.safeParse({ name: "Ola", email: "a@b.no" }).success,
    ).toBe(true)
    expect(
      ctaLeadSchema.safeParse({ name: "", email: "a@b.no" }).success,
    ).toBe(false)
    expect(
      ctaLeadSchema.safeParse({ name: "Ola", email: "bad" }).success,
    ).toBe(false)
  })
})

describe("investorAccessSchema", () => {
  it("requires name + valid email; company/mandate optional", () => {
    expect(
      investorAccessSchema.safeParse({ name: "Kari", email: "k@i.no" }).success,
    ).toBe(true)
    expect(
      investorAccessSchema.safeParse({ name: "", email: "k@i.no" }).success,
    ).toBe(false)
  })
})

describe("contactInquirySchema", () => {
  it("requires name + email + service", () => {
    expect(
      contactInquirySchema.safeParse({
        name: "Ola",
        email: "a@b.no",
        service: "Verdsettelse",
      }).success,
    ).toBe(true)
    expect(
      contactInquirySchema.safeParse({
        name: "Ola",
        email: "a@b.no",
        service: "",
      }).success,
    ).toBe(false)
  })
})
