// Shared React Email primitives styled to match the OG card editorial palette.
// Warm-grey background, Newsreader-serif headlines, Inter caps for eyebrows.
// Email clients reject most modern CSS — these components use inline styles
// only, system-serif fallbacks, and tested-in-Gmail color values.

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import type { ReactNode } from "react"

export const COLOR = {
  warmGrey: "#2c2825",
  warmGrey85: "#57504a",
  warmWhite: "#f3f1ef",
  lightBlue: "#cbeef2",
  lightBlue1: "#f4fafb",
  hairline: "#d7d0c8",
}

const SERIF =
  '"Newsreader", "Source Serif 4", "Iowan Old Style", "Apple Garamond", "Baskerville", Georgia, serif'
const SANS =
  '"Inter", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif'

export function EditorialEmail({
  preview,
  children,
}: {
  preview: string
  children: ReactNode
}) {
  return (
    <Html lang="no">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body
          style={{
            backgroundColor: COLOR.lightBlue1,
            margin: 0,
            padding: 0,
            fontFamily: SANS,
            color: COLOR.warmGrey,
          }}
        >
          <Container
            style={{
              backgroundColor: COLOR.warmWhite,
              maxWidth: 600,
              margin: "0 auto",
              padding: "48px 40px 40px",
              borderTop: `4px solid ${COLOR.warmGrey}`,
            }}
          >
            <Section style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontFamily: SERIF,
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: COLOR.warmGrey,
                  margin: 0,
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    backgroundColor: COLOR.lightBlue,
                    borderRadius: "50%",
                    marginRight: 8,
                    verticalAlign: "middle",
                  }}
                />
                Advanti<span style={{ fontStyle: "italic" }}>.</span>
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    color: COLOR.warmGrey85,
                    textTransform: "uppercase",
                    marginLeft: 10,
                    fontWeight: 400,
                  }}
                >
                  Estate
                </span>
              </Text>
            </Section>
            {children}
            <Hr
              style={{
                borderColor: COLOR.hairline,
                margin: "40px 0 24px",
              }}
            />
            <Text
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: COLOR.warmGrey85,
                letterSpacing: "0.04em",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Advanti Estate · Næringseiendom i Nord-Norge
              <br />
              <Link
                href="https://www.advantiestate.no"
                style={{ color: COLOR.warmGrey85, textDecoration: "underline" }}
              >
                advantiestate.no
              </Link>
              {" · "}
              <Link
                href="mailto:hei@advantiestate.no"
                style={{ color: COLOR.warmGrey85, textDecoration: "underline" }}
              >
                hei@advantiestate.no
              </Link>
            </Text>
            <Text
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: COLOR.warmGrey85,
                margin: "12px 0 0",
              }}
            >
              Du får denne e-posten fordi du meldte deg på Advanti Estate sin
              månedlige markedsoppdatering.{" "}
              <Link
                href="{{RESEND_UNSUBSCRIBE_URL}}"
                style={{ color: COLOR.warmGrey85, textDecoration: "underline" }}
              >
                Meld deg av
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export function H1({ children }: { children: ReactNode }) {
  return (
    <Heading
      as="h1"
      style={{
        fontFamily: SERIF,
        fontSize: 32,
        fontWeight: 400,
        letterSpacing: "-0.018em",
        lineHeight: 1.15,
        color: COLOR.warmGrey,
        margin: "0 0 20px",
      }}
    >
      {children}
    </Heading>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: SANS,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: COLOR.warmGrey85,
        margin: "0 0 12px",
      }}
    >
      {children}
    </Text>
  )
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: 18,
        lineHeight: 1.45,
        color: COLOR.warmGrey85,
        margin: "0 0 24px",
      }}
    >
      {children}
    </Text>
  )
}

export function P({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: SANS,
        fontSize: 15.5,
        lineHeight: 1.65,
        color: COLOR.warmGrey,
        margin: "0 0 16px",
      }}
    >
      {children}
    </Text>
  )
}

export function CTA({ href, label }: { href: string; label: string }) {
  return (
    <Section style={{ margin: "28px 0 8px" }}>
      <Link
        href={href}
        style={{
          backgroundColor: COLOR.warmGrey,
          color: COLOR.warmWhite,
          padding: "14px 28px",
          borderRadius: 999,
          fontFamily: SANS,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        {label}
      </Link>
    </Section>
  )
}
