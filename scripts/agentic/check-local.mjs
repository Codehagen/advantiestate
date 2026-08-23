#!/usr/bin/env node
// Fast local stand-in for the is-agentic checks we actively maintain.
//
// is-agentic only scans public URLs, so the real report is always one deploy
// behind. This script re-implements the same assertions against a locally
// running build so a regression is caught in seconds instead of after a
// production deploy.
//
//   pnpm build && PORT=3111 pnpm start
//   node scripts/agentic/check-local.mjs --base http://localhost:3111
//
// Exits non-zero on the first failing assertion, so it works as a CI gate.

const args = process.argv.slice(2);
const baseArg = args.indexOf("--base");
const BASE = (
  baseArg !== -1 ? args[baseArg + 1] : process.env.BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");

const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const mark = ok ? "[32mPASS[0m" : "[31mFAIL[0m";
  console.log(`${mark}  ${name}${detail ? `\n      ${detail}` : ""}`);
}

async function get(path, headers = {}, redirect = "follow") {
  return fetch(`${BASE}${path}`, { headers, redirect });
}

// `Headers.get` joins repeated field lines with ", " — which is what we want,
// since Next emits its own Vary as a separate header line alongside ours.
function varyOf(response) {
  return (response.headers.get("vary") || "").toLowerCase();
}

async function checkMarkdownNegotiation() {
  const paths = ["/", "/tjenester/salg", "/help", "/om-oss"];
  for (const path of paths) {
    const res = await get(path, { Accept: "text/markdown" });
    const ct = res.headers.get("content-type") || "";
    const vary = varyOf(res);
    const body = await res.text();

    record(
      `markdown-negotiation: ${path} serves text/markdown`,
      ct.includes("text/markdown"),
      ct.includes("text/markdown") ? undefined : `got content-type: ${ct}`,
    );
    record(
      `markdown-negotiation: ${path} sends Vary: Accept`,
      vary.includes("accept") && !/^accept-encoding$/.test(vary.trim()),
      vary.includes("accept") ? undefined : `got vary: ${vary || "(none)"}`,
    );
    record(
      `markdown-negotiation: ${path} body is non-trivial markdown`,
      body.trimStart().startsWith("#") && body.length > 120,
      `${body.length} bytes, starts with ${JSON.stringify(body.slice(0, 24))}`,
    );
  }
}

async function checkMdSuffix() {
  const res = await get("/tjenester/salg.md");
  const ct = res.headers.get("content-type") || "";
  record(
    "md-suffix: /tjenester/salg.md serves markdown",
    res.status === 200 && ct.includes("text/markdown"),
    `status ${res.status}, content-type ${ct}`,
  );
}

async function checkAgentFriendly404() {
  const path = "/denne-siden-finnes-ikke-1234";

  const html = await get(path);
  record("404: nonexistent path returns a real 404", html.status === 404, `status ${html.status}`);
  const htmlBody = await html.text();
  record(
    "404: HTML body points agents at sitemap + llms.txt",
    htmlBody.includes("/sitemap.xml") && htmlBody.includes("/llms.txt"),
  );

  const md = await get(path, { Accept: "text/markdown" });
  const mdBody = await md.text();
  const ct = md.headers.get("content-type") || "";
  record(
    "404: markdown variant is 404 + text/markdown",
    md.status === 404 && ct.includes("text/markdown"),
    `status ${md.status}, content-type ${ct}`,
  );
  record(
    "404: markdown body points agents at sitemap + llms.txt",
    mdBody.includes("/sitemap.xml") && mdBody.includes("/llms.txt"),
  );
}

async function checkTrustAnchors() {
  for (const [alias, canonical] of [
    ["/about", "/om-oss"],
    ["/contact", "/kontakt"],
  ]) {
    const hop = await get(alias, {}, "manual");
    const location = hop.headers.get("location") || "";
    record(
      `trust-anchor: ${alias} redirects to ${canonical}`,
      [301, 308].includes(hop.status) && location.endsWith(canonical),
      `status ${hop.status} -> ${location || "(no location)"}`,
    );

    const landed = await get(alias);
    const text = (await landed.text())
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ");
    record(
      `trust-anchor: ${canonical} has >=500 chars of content`,
      landed.status === 200 && text.replace(/\s+/g, " ").trim().length >= 500,
      `${text.replace(/\s+/g, " ").trim().length} chars`,
    );
  }

  const privacy = await get("/privacy");
  record("trust-anchor: /privacy is 200", privacy.status === 200, `status ${privacy.status}`);
}

async function checkOrgSchema() {
  const html = await (await get("/")).text();
  record(
    "org-schema: Organization JSON-LD includes contactPoint",
    html.includes('"contactPoint"') || html.includes("contactPoint"),
  );
  record(
    "org-schema: Organization JSON-LD includes PostalAddress",
    html.includes("PostalAddress"),
  );
}

async function checkMachineReadableUntouched() {
  // The negotiation rewrite must not hijack files that already have their own
  // content type — a regression here would break the sitemap for every crawler.
  for (const [path, expected] of [
    ["/sitemap.xml", "xml"],
    ["/llms.txt", "text/plain"],
    ["/robots.txt", "text/plain"],
  ]) {
    const res = await get(path, { Accept: "text/markdown" });
    const ct = res.headers.get("content-type") || "";
    record(
      `passthrough: ${path} keeps its own content type under Accept: text/markdown`,
      res.status === 200 && ct.includes(expected),
      `status ${res.status}, content-type ${ct}`,
    );
  }

  const wellKnown = await get("/.well-known/llms.txt");
  record(
    "passthrough: /.well-known/llms.txt mirrors /llms.txt",
    wellKnown.status === 200 && (await wellKnown.text()).startsWith("# Advanti Estate"),
    `status ${wellKnown.status}`,
  );
}

async function main() {
  console.log(`Checking ${BASE}\n`);
  await checkMarkdownNegotiation();
  await checkMdSuffix();
  await checkAgentFriendly404();
  await checkTrustAnchors();
  await checkOrgSchema();
  await checkMachineReadableUntouched();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} failing:`);
    for (const f of failed) console.error(`  - ${f.name}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
