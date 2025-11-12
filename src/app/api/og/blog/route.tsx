import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "Bloggartikkel"
  const author = searchParams.get("author") || "Advanti Team"
  const category = searchParams.get("category") || "company"
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
  const summary = searchParams.get("summary") || ""

  // Category color mapping
  const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
    company: { bg: "#cbeef2", text: "#2c2825", label: "Selskap" },
    valuation: { bg: "#a8dadc", text: "#1d3557", label: "Verdivurdering" },
    "market-analysis": { bg: "#f1faee", text: "#457b9d", label: "Markedsanalyse" },
    casestudies: { bg: "#e9c46a", text: "#2c2825", label: "Casestudier" },
  }

  const categoryStyle = categoryColors[category] || categoryColors.company

  // Format date to Norwegian format
  const formatDate = (dateStr: string) => {
    const months = [
      "jan", "feb", "mar", "apr", "mai", "jun",
      "jul", "aug", "sep", "okt", "nov", "des"
    ]
    const d = new Date(dateStr)
    return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`
  }

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
        {/* Header with Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px",
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

          {/* Category Badge */}
          <div
            style={{
              display: "flex",
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.text,
              padding: "8px 20px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {categoryStyle.label}
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: title.length > 60 ? "52px" : "64px",
              fontWeight: "800",
              lineHeight: "1.1",
              marginBottom: "24px",
              color: "#f3f1ef",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title.slice(0, 120)}
          </div>

          {/* Summary */}
          {summary && (
            <div
              style={{
                fontSize: "24px",
                lineHeight: "1.4",
                color: "#cbeef2",
                marginBottom: "32px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {summary.slice(0, 150)}
            </div>
          )}
        </div>

        {/* Footer with Author and Date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(203, 238, 242, 0.2)",
            paddingTop: "24px",
          }}
        >
          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "999px",
                backgroundColor: "#cbeef2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "600",
                color: "#2c2825",
              }}
            >
              {author.charAt(0).toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "600" }}>
                {author}
              </div>
              <div style={{ fontSize: "18px", color: "#cbeef2", opacity: 0.8 }}>
                {formatDate(date)}
              </div>
            </div>
          </div>

          {/* Branding */}
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
