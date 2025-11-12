import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "Datakilde"
  const description = searchParams.get("description") || ""
  const provider = searchParams.get("provider") || ""
  const category = searchParams.get("category") || "general"

  // Category color mapping
  const categoryColors: Record<string, { accent: string }> = {
    finansiering: { accent: "#8ecae6" },
    marked: { accent: "#a8dadc" },
    eiendom: { accent: "#cbeef2" },
    regnskap: { accent: "#f1faee" },
    general: { accent: "#cbeef2" },
  }

  const colors = categoryColors[category] || categoryColors.general

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
            marginBottom: "50px",
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

          {/* Integration Badge */}
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
            Datakilde
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Provider Name */}
          {provider && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {/* Connection Icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "24px",
                  color: colors.accent,
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: colors.accent,
                  }}
                />
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    backgroundColor: colors.accent,
                  }}
                />
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: colors.accent,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: colors.accent,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {provider}
              </div>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? "56px" : "68px",
              fontWeight: "800",
              lineHeight: "1.1",
              marginBottom: "32px",
              color: "#f3f1ef",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title.slice(0, 100)}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: "26px",
                lineHeight: "1.5",
                color: "#cbeef2",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description.slice(0, 200)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(203, 238, 242, 0.2)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                color: colors.accent,
                fontWeight: "600",
              }}
            >
              ⚡ Integrasjon tilgjengelig
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
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
