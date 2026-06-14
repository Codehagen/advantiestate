import Link from "next/link";
import BlurImage from "@/lib/blog/blur-image";

/**
 * Advisor — editorial contact card (the `.ae-advisor` block).
 *
 * Used two ways, both via this one component so the card stays consistent:
 *  - Globally on every blog article (rendered by the post page from the
 *    author's resolved profile), and
 *  - Inline inside an MDX article that wants a localized card (e.g. a
 *    "Din rådgiver i <by>" card under a Kontakt section). Such an article
 *    sets `advisorInline: true` in frontmatter so the page skips the global one.
 *
 * Typed props only (no `children` escape hatch) so MDX authors can't break the
 * card's consistency. When phone/email are absent it falls back to a single
 * "Kontakt oss" link — never an empty `tel:`/`mailto:`.
 */
export interface AdvisorProps {
  name: string;
  role: string;
  /** Portrait URL — always provide one (author avatar), never undefined. */
  portrait: string;
  label?: string;
  /** Company + address line, e.g. "Advanti Estate · Dronningens gate 18, 8006 Bodø". */
  address?: string;
  /** Display phone, e.g. "+47 984 53 571". The href is normalized to digits. */
  phone?: string;
  email?: string;
  /** Fallback link target when phone/email are missing. */
  contactHref?: string;
}

export function Advisor({
  name,
  role,
  portrait,
  label = "Din rådgiver",
  address,
  phone,
  email,
  contactHref = "/kontakt",
}: AdvisorProps) {
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
  const mailHref = email ? `mailto:${email.toLowerCase()}` : null;
  const hasDirectContact = Boolean(telHref || mailHref);

  return (
    <div className="ae-advisor">
      <div className="ae-portrait">
        <BlurImage src={portrait} alt={name} width={128} height={160} />
      </div>
      <div>
        <span className="ae-ad-label">{label}</span>
        <h4>{name}</h4>
        <div className="ae-ad-role">{role}</div>
        <div className="ae-ad-contact">
          {address && (
            <>
              {address}
              <br />
            </>
          )}
          {hasDirectContact ? (
            <>
              {telHref && (
                <>
                  Telefon: <a href={telHref}>{phone}</a>
                  {mailHref && " · "}
                </>
              )}
              {mailHref && (
                <>
                  E&#8209;post: <a href={mailHref}>{email}</a>
                </>
              )}
            </>
          ) : (
            <Link href={contactHref}>
              Kontakt oss <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Advisor;
