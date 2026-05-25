// Listing OG card (1200×630). Renders a commercial-RE listing for social
// previews — price, yield, BTA and status badge over a dark editorial layout.
// Mirrors the EditorialCard chrome (logo + hairline + author rail) but swaps
// the bottom rail for the stat strip that makes a CRE listing click-worthy
// when dropped in LinkedIn/WhatsApp/Slack.
//
// Satori-safe: flex only, inline styles, no CSS shorthand for background, all
// colour values as full strings.

const WARM_GREY = "#2c2825";
const WARM_WHITE = "#f3f1ef";
const LIGHT_BLUE = "#cbeef2";
const FADE_72 = "rgba(243, 241, 239, 0.72)";
const FADE_55 = "rgba(243, 241, 239, 0.55)";
const FADE_40 = "rgba(243, 241, 239, 0.40)";
const HAIRLINE = "rgba(243, 241, 239, 0.18)";

export type ListingCardProps = {
  title: string;
  address: string;
  reference: string;
  status: "til-salgs" | "reservert" | "kommer" | "solgt";
  statusLabel: string;
  stats: {
    bta: string;       // e.g. "11 400 m²"
    headline: string;  // "425 mnok" | "Q3 2027" | "—"
    headlineLabel: string; // "Prisantydning" | "Ferdigstilles"
    yield: string;     // e.g. "5,9 %"
  };
  typeLabel: string;   // e.g. "Kontor · Tromsø"
};

// Title font-size selection — Satori can't measure text, so approximate by
// character count. Listing titles are typically longer than blog ("Sjøgata 7
// — kontortårn ved havna." vs "DCF-Analyse for Næringseiendom"), so the
// curve starts smaller.
function titleFontSize(title: string): number {
  const len = title.length;
  if (len <= 28) return 72;
  if (len <= 44) return 60;
  if (len <= 60) return 52;
  if (len <= 80) return 44;
  return 38;
}

function Logo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        color: WARM_WHITE,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 12,
          height: 12,
          backgroundColor: LIGHT_BLUE,
          borderRadius: 9999,
          marginRight: 10,
          transform: "translateY(-2px)",
        }}
      />
      <div
        style={{
          display: "flex",
          fontFamily: "Newsreader",
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: "-0.01em",
        }}
      >
        Advanti.
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: 12,
          letterSpacing: "0.22em",
          color: FADE_55,
          textTransform: "uppercase",
          marginLeft: 10,
        }}
      >
        Estate
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: ListingCardProps["status"];
  label: string;
}) {
  // Brown for reservert (#f4ecdc/#6e5418), dark for solgt, accent for active.
  const styles: Record<
    ListingCardProps["status"],
    { bg: string; color: string; dotBg: string; border: string }
  > = {
    "til-salgs": {
      bg: WARM_WHITE,
      color: WARM_GREY,
      dotBg: LIGHT_BLUE,
      border: "transparent",
    },
    reservert: {
      bg: "#f4ecdc",
      color: "#6e5418",
      dotBg: "#c89327",
      border: "transparent",
    },
    kommer: {
      bg: "transparent",
      color: WARM_WHITE,
      dotBg: FADE_55,
      border: HAIRLINE,
    },
    solgt: {
      bg: WARM_GREY,
      color: WARM_WHITE,
      dotBg: FADE_55,
      border: HAIRLINE,
    },
  };
  const s = styles[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: "10px 16px",
        fontFamily: "Inter",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 8,
          height: 8,
          borderRadius: 9999,
          backgroundColor: s.dotBg,
          marginRight: 10,
        }}
      />
      {label}
    </div>
  );
}

function Eyebrow({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: LIGHT_BLUE,
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}
    >
      <div
        style={{
          width: 28,
          height: 1,
          backgroundColor: LIGHT_BLUE,
          marginRight: 14,
        }}
      />
      {text}
    </div>
  );
}

function StatCell({
  label,
  value,
  borderLeft,
}: {
  label: string;
  value: string;
  borderLeft?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        paddingLeft: borderLeft ? 32 : 0,
        borderLeft: borderLeft ? `1px solid ${HAIRLINE}` : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 12,
          color: FADE_55,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Newsreader",
          fontWeight: 400,
          fontSize: 38,
          color: WARM_WHITE,
          letterSpacing: "-0.012em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function ListingCard(props: ListingCardProps) {
  const fontSize = titleFontSize(props.title);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: WARM_GREY,
        color: WARM_WHITE,
        padding: "56px 72px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Inter",
      }}
    >
      {/* TOP: logo (left) + status badge (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Logo />
        <StatusBadge status={props.status} label={props.statusLabel} />
      </div>

      {/* MIDDLE: eyebrow + title + address */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 1056,
        }}
      >
        <div style={{ display: "flex", marginBottom: 22 }}>
          <Eyebrow text={`${props.typeLabel} · ${props.reference}`} />
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Newsreader",
            fontWeight: 400,
            fontSize,
            lineHeight: 1.02,
            letterSpacing: "-0.024em",
            color: WARM_WHITE,
          }}
        >
          {props.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Newsreader",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 22,
            color: FADE_72,
          }}
        >
          {props.address}
        </div>
      </div>

      {/* BOTTOM: hairline + stat strip (BTA · price · yield) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <StatCell label="BTA" value={props.stats.bta} />
          <StatCell
            label={props.stats.headlineLabel}
            value={props.stats.headline}
            borderLeft
          />
          <StatCell label="Yield" value={props.stats.yield} borderLeft />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 18,
              color: FADE_40,
              paddingLeft: 32,
              borderLeft: `1px solid ${HAIRLINE}`,
            }}
          >
            advantiestate.no
          </div>
        </div>
      </div>
    </div>
  );
}
