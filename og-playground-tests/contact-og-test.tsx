// Copy this entire code into https://og-playground.vercel.app/
// Test with different team members

export default function ContactOG() {
  // TEST PARAMETERS - Modify these to test different scenarios
  const name = "Christer Hagen"
  const role = "Daglig leder og Næringsmegler"
  const email = "christer@advanti.no"
  const phone = "+47 123 45 678"
  const location = "Bodø, Nordland"

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

        {/* Team Badge */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#cbeef2",
            color: "#2c2825",
            padding: "8px 20px",
            borderRadius: "999px",
            fontSize: "18px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Vårt team
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "50px",
          alignItems: "center",
        }}
      >
        {/* Profile Avatar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "240px",
              height: "240px",
              borderRadius: "20px",
              backgroundColor: "#cbeef2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "96px",
              fontWeight: "700",
              color: "#2c2825",
              border: "4px solid rgba(203, 238, 242, 0.3)",
            }}
          >
            {name
              .split(" ")
              .map((n) => n.charAt(0))
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        </div>

        {/* Info Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "20px",
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: "800",
              lineHeight: "1.1",
              color: "#f3f1ef",
            }}
          >
            {name}
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#cbeef2",
              marginBottom: "10px",
            }}
          >
            {role}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: "#cbeef2",
              borderRadius: "2px",
              marginBottom: "10px",
            }}
          />

          {/* Contact Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "22px",
                  color: "#cbeef2",
                }}
              >
                <span>✉️</span>
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "22px",
                  color: "#cbeef2",
                }}
              >
                <span>📱</span>
                <span>{phone}</span>
              </div>
            )}
            {location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "22px",
                  color: "#cbeef2",
                }}
              >
                <span>📍</span>
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
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
            fontSize: "20px",
            color: "#cbeef2",
            fontWeight: "600",
          }}
        >
          Ta kontakt for en uforpliktende samtale
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
