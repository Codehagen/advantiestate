import { test, expect } from "@playwright/test";

// In-process imports use relative paths because Playwright's esbuild
// transpiler does not resolve tsconfig `@/` path aliases at runtime.
// csv.ts has only `import type` internals (erased at build); authors.ts and
// marketReleases.ts have no Next.js globals — all safe to require in Node.
import { releaseToCsv } from "../src/lib/presserom/csv";
import { AUTHORS, getAuthorName } from "../src/lib/authors";
import {
  getRelease,
  LATEST_RELEASE,
} from "../src/components/markedsinnsikt/marketReleases";
import { CITIES } from "../src/components/markedsinnsikt/marketData";

/**
 * T16 — Presserom spec (review-vedtak 3A + 6A)
 *
 * Section A: in-process unit assertions — no HTTP, pure module imports.
 *   A1  releaseToCsv: BOM, semikolon, header, radantall, punkt-desimaler.
 *   A2  AUTHORS / getAuthorName: codehagen, vsoraas, ukjent handle.
 *   A3  getRelease + CITIES: kjent/ukjent slug, 6 byer, yield-format.
 *
 * Section B: HTTP / page fixtures — runs against the Next.js production build
 *   started by the webServer stanza in playwright.config.ts.
 *   B4  /presserom/markedstall.csv → 200, text/csv, BOM, "Bodø"
 *   B5  /presserom/arkiv/q4-2025 → 200 + "Q4 2025"; /arkiv/finnes-ikke → 404
 *   B6  /presserom/arkiv/q4-2025/data.csv → 200 text/csv
 *   B7  /api/og/marked/bodo → 200 image/png; /api/og/marked/oslo → 404
 *   B8  /presserom: Dataset JSON-LD parsebar, distribution.contentUrl korrekt,
 *       ingen node med name nøyaktig «Advanti»
 *   B9  «Kopier sitering»: knapp finnes, klikk → «Kopiert»-tilstand eller fallback
 *   B10 Bloggpost med codehagen-forfatter: Article.author @id → /personer/christer-hagen#person
 */

const LD = 'script[type="application/ld+json"]';

// ---------------------------------------------------------------------------
// A1 — releaseToCsv (in-process, no HTTP)
// ---------------------------------------------------------------------------

test.describe("A1: releaseToCsv (unit, in-process)", () => {
  test("output starts with UTF-8 BOM (U+FEFF)", () => {
    const csv = releaseToCsv(LATEST_RELEASE);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
  });

  test("uses semikolon as separator", () => {
    const csv = releaseToCsv(LATEST_RELEASE);
    const headerLine = csv.replace(/^﻿/, "").split("\r\n")[0];
    expect(headerLine).toContain(";");
    expect(headerLine).not.toContain(",");
  });

  test("has correct header row", () => {
    const csv = releaseToCsv(LATEST_RELEASE);
    const firstLine = csv.replace(/^﻿/, "").split("\r\n")[0];
    expect(firstLine).toBe(
      "by;prime_yield_pct;markedsleie_kr_m2;kontorledighet_pct",
    );
  });

  test("has one data row per city", () => {
    const csv = releaseToCsv(LATEST_RELEASE);
    const lines = csv
      .replace(/^﻿/, "")
      .split("\r\n")
      .filter((l) => l.length > 0);
    // lines[0] = header; remaining lines = data rows
    expect(lines.length - 1).toBe(LATEST_RELEASE.cities.length);
  });

  test("numeric columns use dot as decimal separator (no comma)", () => {
    const csv = releaseToCsv(LATEST_RELEASE);
    const dataLines = csv
      .replace(/^﻿/, "")
      .split("\r\n")
      .filter((l) => l.length > 0)
      .slice(1); // skip header

    for (const line of dataLines) {
      const cols = line.split(";");
      // col[1] = yieldPct (e.g. "6.35"), col[2] = leieKrM2 (e.g. "2400"),
      // col[3] = vacPct (e.g. "4.6") — never Norwegian comma format
      expect(cols[1], `yieldPct in "${line}"`).not.toContain(",");
      expect(cols[2], `leieKrM2 in "${line}"`).not.toContain(",");
      expect(cols[3], `vacPct in "${line}"`).not.toContain(",");
      // yieldPct and vacPct are fractional — verify dot is present
      expect(cols[1], `yieldPct dot in "${line}"`).toContain(".");
      expect(cols[3], `vacPct dot in "${line}"`).toContain(".");
    }
  });
});

// ---------------------------------------------------------------------------
// A2 — AUTHORS / getAuthorName (in-process, no HTTP)
// ---------------------------------------------------------------------------

test.describe("A2: authors.ts (unit, in-process)", () => {
  test("codehagen → name «Christer Hagen» + personSlug «christer-hagen»", () => {
    expect(AUTHORS.codehagen.name).toBe("Christer Hagen");
    expect(AUTHORS.codehagen.personSlug).toBe("christer-hagen");
  });

  test("vsoraas er registrert men har IKKE personSlug", () => {
    expect(AUTHORS.vsoraas).toBeDefined();
    expect(AUTHORS.vsoraas.personSlug).toBeUndefined();
  });

  test("getAuthorName faller tilbake til handle for ukjent forfatter", () => {
    const handle = "ukjent-forfatter-xyz";
    expect(getAuthorName(handle)).toBe(handle);
  });
});

// ---------------------------------------------------------------------------
// A3 — getRelease + CITIES (in-process, no HTTP)
// ---------------------------------------------------------------------------

test.describe("A3: marketReleases + CITIES (unit, in-process)", () => {
  test("getRelease('q4-2025') returnerer en release", () => {
    const release = getRelease("q4-2025");
    expect(release).toBeDefined();
    expect(release?.slug).toBe("q4-2025");
    expect(release?.quarter).toBe("Q4 2025");
  });

  test("getRelease('finnes-ikke') returnerer undefined", () => {
    expect(getRelease("finnes-ikke")).toBeUndefined();
  });

  test("CITIES har eksakt 6 byer", () => {
    expect(CITIES).toHaveLength(6);
  });

  test("CITIES yield-strenger har format «X,XX %»", () => {
    for (const city of CITIES) {
      expect(
        city.yield,
        `${city.name}: yield-format`,
      ).toMatch(/^\d+,\d{2} %$/);
    }
  });
});

// ---------------------------------------------------------------------------
// B4 — /presserom/markedstall.csv
// ---------------------------------------------------------------------------

test("B4: GET /presserom/markedstall.csv → 200, text/csv, BOM, inneholder Bodø", async ({
  request,
}) => {
  const res = await request.get("/presserom/markedstall.csv");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/csv");
  const body = await res.text();
  // UTF-8 BOM (U+FEFF)
  expect(body.charCodeAt(0)).toBe(0xfeff);
  expect(body).toContain("Bodø");
});

// ---------------------------------------------------------------------------
// B5 — /presserom/arkiv/[kvartal]
// ---------------------------------------------------------------------------

test("B5a: GET /presserom/arkiv/q4-2025 → 200 med «Q4 2025»", async ({
  page,
}) => {
  const res = await page.goto("/presserom/arkiv/q4-2025", {
    waitUntil: "domcontentloaded",
  });
  expect(res?.status()).toBe(200);
  await expect(page.locator("body")).toContainText("Q4 2025");
});

test("B5b: GET /presserom/arkiv/finnes-ikke → 404", async ({ request }) => {
  const res = await request.get("/presserom/arkiv/finnes-ikke");
  expect(res.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// B6 — /presserom/arkiv/q4-2025/data.csv
// ---------------------------------------------------------------------------

test("B6: GET /presserom/arkiv/q4-2025/data.csv → 200 text/csv", async ({
  request,
}) => {
  const res = await request.get("/presserom/arkiv/q4-2025/data.csv");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/csv");
});

// ---------------------------------------------------------------------------
// B7 — /api/og/marked/[by]
// ---------------------------------------------------------------------------

test("B7a: GET /api/og/marked/bodo → 200 image/png", async ({ request }) => {
  const res = await request.get("/api/og/marked/bodo");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("B7b: GET /api/og/marked/oslo → 404 (ikke i whitelist)", async ({
  request,
}) => {
  const res = await request.get("/api/og/marked/oslo");
  expect(res.status()).toBe(404);
});

// ---------------------------------------------------------------------------
// B8 — /presserom: Dataset JSON-LD
// ---------------------------------------------------------------------------

/**
 * Rekursiv hjelper: returnerer true dersom et vilkårlig JSON-node-tre
 * inneholder et objekt med name === target.
 */
function hasExactName(value: unknown, target: string): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasExactName(item, target));
  }
  if (value !== null && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("name" in obj && obj["name"] === target) return true;
    return Object.values(obj).some((v) => hasExactName(v, target));
  }
  return false;
}

test("B8: /presserom JSON-LD — Dataset med distribution.contentUrl, ingen node med name «Advanti»", async ({
  page,
}) => {
  await page.goto("/presserom", { waitUntil: "domcontentloaded" });

  const blocks = await page.locator(LD).allTextContents();
  expect(blocks.length, "JSON-LD blocks på /presserom").toBeGreaterThan(0);

  // Alle blokker skal parses uten feil  const parsed: any[] = blocks.map((b) => JSON.parse(b));

  // Minst én Dataset-blokk  const dataset = parsed.find((b: any) => b["@type"] === "Dataset");
  expect(dataset, "Dataset JSON-LD blokk").toBeTruthy();

  // distribution.contentUrl skal slutte med /presserom/markedstall.csv
  const contentUrl: unknown =
    dataset?.distribution?.contentUrl;
  expect(contentUrl, "distribution.contentUrl er satt").toBeTruthy();
  expect(String(contentUrl)).toMatch(/\/presserom\/markedstall\.csv$/);

  // Ingen JSON-LD-node på siden skal ha name nøyaktig «Advanti»
  // (kanonisk navn er «Advanti Estate»; alternateName-arrayen kan inneholde «Advanti»)
  for (const block of parsed) {
    expect(
      hasExactName(block, "Advanti"),
      'Ingen JSON-LD-node bør ha name nøyaktig "Advanti"',
    ).toBe(false);
  }
});

// ---------------------------------------------------------------------------
// B9 — «Kopier sitering»-knapp
// ---------------------------------------------------------------------------

test("B9: «Kopier sitering» finnes; klikk gir «Kopiert»-tilstand eller fallback", async ({
  page,
  context,
}) => {
  // Grant clipboard-tillatelser der det støttes (Chromium; no-op ellers).
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/presserom", { waitUntil: "domcontentloaded" });

  const btn = page.getByRole("button", { name: /kopier sitering/i });
  await expect(btn).toBeVisible();

  await btn.click();

  // Enten: clipboard write lyktes → knappen viser «Kopiert ✓» i ~2 sekunder
  // Eller: clipboard-tilgang avslått → <div class="press-copy-fallback"> rendres
  // Begge tilstander er korrekte; timeout håndterer asynkron state-oppdatering.
  const kopiert = page.getByRole("button", { name: /kopiert/i });
  const fallback = page.locator(".press-copy-fallback");
  await expect(kopiert.or(fallback)).toBeVisible({ timeout: 4000 });
});

// ---------------------------------------------------------------------------
// B10 — Bloggpost: Article JSON-LD author @id
// ---------------------------------------------------------------------------

// Slug hentet fra src/content/blog/naringseiendomsmarkedet-bodo-2025.mdx
// (frontmatter: author: codehagen, slug: naringseiendomsmarkedet-bodo-2025)
const CODEHAGEN_SLUG = "naringseiendomsmarkedet-bodo-2025";

test(`B10: /blog/${CODEHAGEN_SLUG} Article.author @id → /personer/christer-hagen#person`, async ({
  page,
}) => {
  await page.goto(`/blog/${CODEHAGEN_SLUG}`, {
    waitUntil: "domcontentloaded",
  });

  const blocks = await page.locator(LD).allTextContents();  const parsed: any[] = blocks.map((b) => JSON.parse(b));
  const article = parsed.find((b: any) => b["@type"] === "Article");
  expect(article, "Article JSON-LD blokk på bloggpost").toBeTruthy();

  const authorId: unknown = article?.author?.["@id"];
  expect(authorId, "Article.author @id er satt").toBeTruthy();
  expect(String(authorId)).toContain("/personer/christer-hagen#person");
});
