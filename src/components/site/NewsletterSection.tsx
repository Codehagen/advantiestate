"use client";

import { useState, type FormEvent } from "react";

/**
 * Newsletter sign-up band — the dark warm-grey section at the foot of the
 * blog (replaces the generic CtaStrip per the blog.html design). The design
 * ships no backend, so submitting swaps the form for an inline confirmation.
 */
export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="newsletter">
      <div className="wrap">
        <div className="newsletter-inner">
          <span className="eyebrow center no-rule">
            Få våre analyser i innboksen
          </span>
          <h2>
            Markedsbrev til{" "}
            <span className="italic">de som faktisk leser.</span>
          </h2>
          <p>
            Kvartalsvis brev fra senior partner. Ingen massemarkedsføring, ingen
            klikkfeller — bare det vi ser i markedet og hvordan vi tolker det.
          </p>

          {submitted ? (
            <p className="newsletter-success" role="status">
              Takk — vi har notert {email}. Du får neste markedsbrev i innboksen.
            </p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="din@epost.no"
                aria-label="E-postadresse"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Abonner
              </button>
            </form>
          )}

          <p className="newsletter-fineprint">
            Vi sender én utgave per kvartal. Avmelding når som helst.
          </p>
        </div>
      </div>
    </section>
  );
}
