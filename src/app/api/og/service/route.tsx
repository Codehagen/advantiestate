import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "Tjeneste"
  const description = searchParams.get("description") || ""
  const icon = searchParams.get("icon") || "🏢" // emoji icon
  const serviceType = searchParams.get("type") || "general" // salg, verdsettelse, leietakere, etc.

  // Service type color schemes
  const serviceColors: Record<string, { accent: string; bg: string }> = {
    salg: { accent: "#e9c46a", bg: "rgba(233, 196, 106, 0.1)" },
    verdsettelse: { accent: "#a8dadc", bg: "rgba(168, 218, 220, 0.1)" },
    leietakere: { accent: "#cbeef2", bg: "rgba(203, 238, 242, 0.1)" },
    transaksjoner: { accent: "#f1faee", bg: "rgba(241, 250, 238, 0.1)" },
    regnskap: { accent: "#8ecae6", bg: "rgba(142, 202, 230, 0.1)" },
    general: { accent: "#cbeef2", bg: "rgba(203, 238, 242, 0.1)" },
  }

  const colors = serviceColors[serviceType] || serviceColors.general

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#2c2825",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(203, 238, 242, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(203, 238, 242, 0.15) 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "#f3f1ef",
          padding: "60px 70px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "60px",
          }}
        >
          {/* Advanti Logo */}
          <svg
            width="140"
            height="32"
            viewBox="0 0 140 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 2L2 30h6l1.5-6h9l1.5 6h6L19.5 2h-11zm1.8 16l2.7-11 2.7 11h-5.4z"
              fill="#f3f1ef"
            />
            <path
              d="M35 8h5.5c4.8 0 8.5 3.7 8.5 8.5v5c0 4.8-3.7 8.5-8.5 8.5H35V8zm5 17c2.5 0 4-1.5 4-4v-5c0-2.5-1.5-4-4-4h-1v13h1z"
              fill="#f3f1ef"
            />
            <path
              d="M58 8h6l6 22h-5l-1-4h-6l-1 4h-5l6-22zm3 14h3.5l-1.8-7-1.7 7z"
              fill="#f3f1ef"
            />
            <path
              d="M78 8h5.5l6 14V8h4v22h-5l-6.5-14v14h-4V8z"
              fill="#f3f1ef"
            />
            <path
              d="M105 12v18h-5V12h-4V8h13v4h-4z"
              fill="#f3f1ef"
            />
            <path d="M116 8h5v22h-5V8z" fill="#f3f1ef" />
          </svg>

          {/* Services Badge */}
          <div
            style={{
              display: "flex",
              backgroundColor: colors.accent,
              color: "#2c2825",
              padding: "8px 20px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Tjenester
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Large Icon */}
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "24px",
              backgroundColor: colors.bg,
              border: `3px solid ${colors.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "80px",
              marginBottom: "40px",
            }}
          >
            {icon}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 40 ? "56px" : "72px",
              fontWeight: "800",
              lineHeight: "1.1",
              marginBottom: "28px",
              color: "#f3f1ef",
              maxWidth: "900px",
            }}
          >
            {title.slice(0, 80)}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: "28px",
                lineHeight: "1.4",
                color: colors.accent,
                maxWidth: "850px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description.slice(0, 180)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "2px solid rgba(203, 238, 242, 0.2)",
            paddingTop: "24px",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              color: "#cbeef2",
              fontWeight: "600",
            }}
          >
            Næringseiendom i Nord-Norge
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#cbeef2",
              opacity: 0.5,
            }}
          >
            •
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#cbeef2",
              opacity: 0.7,
            }}
          >
            advantiestate.no
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
