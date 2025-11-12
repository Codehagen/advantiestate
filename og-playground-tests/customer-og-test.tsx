// Copy this entire code into https://og-playground.vercel.app/
// Test with different customer scenarios

export default function CustomerOG() {
  // TEST PARAMETERS - Modify these to test different scenarios
  const title = "Vellykket salg av kontorbygg i Bodø sentrum"
  const company = "Nordland Eiendom AS"
  const location = "Bodø, Nordland"
  const industry = "Kontorlokaler"
  const result = "Solgt 15% over takst på kun 3 måneder"

  return (
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

        {/* Success Story Badge */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#e9c46a",
            color: "#2c2825",
            padding: "8px 20px",
            borderRadius: "999px",
            fontSize: "18px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Kundehistorie
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
        {/* Company Name with Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {/* Company Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              backgroundColor: "#cbeef2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "700",
              color: "#2c2825",
            }}
          >
            {company.charAt(0).toUpperCase()}
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#cbeef2",
            }}
          >
            {company}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "48px" : "58px",
            fontWeight: "800",
            lineHeight: "1.1",
            marginBottom: "28px",
            color: "#f3f1ef",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title.slice(0, 120)}
        </div>

        {/* Tags/Meta */}
        {(location || industry) && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            {location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(203, 238, 242, 0.1)",
                  padding: "6px 16px",
                  borderRadius: "999px",
                  fontSize: "18px",
                  color: "#cbeef2",
                }}
              >
                📍 {location}
              </div>
            )}
            {industry && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "rgba(203, 238, 242, 0.1)",
                  padding: "6px 16px",
                  borderRadius: "999px",
                  fontSize: "18px",
                  color: "#cbeef2",
                }}
              >
                🏢 {industry}
              </div>
            )}
          </div>
        )}

        {/* Result/Impact */}
        {result && (
          <div
            style={{
              fontSize: "22px",
              lineHeight: "1.5",
              color: "#e9c46a",
              fontWeight: "600",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            ✓ {result.slice(0, 140)}
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
        <div style={{ fontSize: "20px", color: "#cbeef2", opacity: 0.8 }}>
          Les hele historien
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
  )
}
