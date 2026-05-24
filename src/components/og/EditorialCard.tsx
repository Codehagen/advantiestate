// Editorial-dark OG card (1200×630). Two modes: "brand" (homepage / fallback)
// and "article" (per blog post). Mirrors the studio design in
// /tmp/advanti-design — Satori-safe (flex only, inline styles, no CSS
// shorthand for background, all colour values as full strings).
//
// Used by:
//   src/app/opengraph-image.tsx                                (brand)
//   src/app/(blog)/blog/(post)/[slug]/opengraph-image.tsx      (article)

const WARM_GREY = "#2c2825"
const WARM_WHITE = "#f3f1ef"
const LIGHT_BLUE = "#cbeef2"
const FADE_72 = "rgba(243, 241, 239, 0.72)"
const FADE_65 = "rgba(243, 241, 239, 0.65)"
const FADE_60 = "rgba(243, 241, 239, 0.60)"
const FADE_55 = "rgba(243, 241, 239, 0.55)"
const FADE_40 = "rgba(243, 241, 239, 0.40)"
const HAIRLINE = "rgba(243, 241, 239, 0.18)"

type BrandProps = {
  mode: "brand"
  title: string
  tagline: string
  metaLeft: string
  metaRight: string
}

type ArticleProps = {
  mode: "article"
  category: string
  title: string
  date: string
  readtime: string
  authorName: string
  authorRole: string
  authorAvatar?: string | null
}

export type EditorialCardProps = BrandProps | ArticleProps

// Title font-size selection. Satori can't measure text, so we approximate by
// character count. Calibrated against the 9 published blog titles to keep
// everything on two lines max. Brand mode runs larger per design.
function titleFontSize(title: string, mode: "brand" | "article"): number {
  const len = title.length
  if (mode === "brand") {
    if (len <= 24) return 88
    if (len <= 36) return 76
    return 64
  }
  if (len <= 36) return 74
  if (len <= 50) return 64
  if (len <= 66) return 56
  if (len <= 84) return 48
  return 42
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
  )
}

function CategoryEyebrow({ text }: { text: string }) {
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
  )
}

export function EditorialCard(props: EditorialCardProps) {
  const fontSize = titleFontSize(props.title, props.mode)

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: WARM_GREY,
        color: WARM_WHITE,
        padding: "64px 72px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Inter",
      }}
    >
      {/* TOP: logo + category */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Logo />
        <CategoryEyebrow
          text={
            props.mode === "article"
              ? props.category.toUpperCase()
              : "NÆRINGSEIENDOM · NORD-NORGE"
          }
        />
      </div>

      {/* MIDDLE: title + (brand) tagline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 1056,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Newsreader",
            fontWeight: 400,
            fontSize,
            lineHeight: props.mode === "brand" ? 1.0 : 1.04,
            letterSpacing: "-0.024em",
            color: WARM_WHITE,
          }}
        >
          {props.title}
        </div>

        {props.mode === "brand" && (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 24,
              lineHeight: 1.45,
              color: FADE_72,
              maxWidth: 820,
            }}
          >
            {props.tagline}
          </div>
        )}
      </div>

      {/* BOTTOM: hairline + author/meta */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {props.mode === "article" ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {props.authorAvatar ? (
                <img
                  src={props.authorAvatar}
                  width={48}
                  height={48}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 9999,
                    objectFit: "cover",
                    marginRight: 14,
                    border: `1px solid ${HAIRLINE}`,
                  }}
                />
              ) : null}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Newsreader",
                    fontWeight: 400,
                    fontSize: 20,
                    color: WARM_WHITE,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {props.authorName}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: 12,
                    color: FADE_55,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {props.authorRole}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: "Newsreader",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: 18,
                color: FADE_60,
              }}
            >
              {props.metaLeft}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily:
                props.mode === "brand" ? "Newsreader" : "Inter",
              fontWeight: props.mode === "brand" ? 300 : 500,
              fontStyle: props.mode === "brand" ? "italic" : "normal",
              fontSize: props.mode === "brand" ? 18 : 14,
              letterSpacing: props.mode === "brand" ? "0" : "0.14em",
              textTransform: props.mode === "brand" ? "none" : "uppercase",
              color: props.mode === "brand" ? FADE_60 : FADE_65,
            }}
          >
            {props.mode === "article" ? (
              <>
                <span style={{ display: "flex" }}>{props.date}</span>
                <span
                  style={{
                    display: "flex",
                    width: 4,
                    height: 4,
                    borderRadius: 9999,
                    backgroundColor: FADE_40,
                    marginLeft: 16,
                    marginRight: 16,
                  }}
                />
                <span style={{ display: "flex" }}>{props.readtime}</span>
              </>
            ) : (
              props.metaRight
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
