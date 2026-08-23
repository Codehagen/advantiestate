#!/usr/bin/env node
// Run an is-agentic scan, diff it against the last stored report, and log the delta.
//
//   node scripts/agentic/scan.mjs                       # scan production
//   node scripts/agentic/scan.mjs --url https://…       # scan a preview deploy
//   node scripts/agentic/scan.mjs --fail-on-regression  # CI / cron gate
//
// The CLI is the only way to *start* a scan; the public /api/v1/report endpoint
// and the MCP server both read stored reports only. That asymmetry is why this
// wraps the CLI rather than the API.

import { execFile } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

const args = process.argv.slice(2);
function flag(name) {
  return args.includes(`--${name}`);
}
function option(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const TARGET = option("url", "https://www.advantiestate.no");
const OUT_DIR = option("out", "scratchpad/agentic");
const LOG_FILE = "docs/agentic-log.md";
const LATEST = path.join(OUT_DIR, "latest.json");

function issueKey(issue) {
  return `${issue.id}:${issue.result}`;
}

async function runScan(target) {
  const domain = target.replace(/^https?:\/\//, "").replace(/\/$/, "");
  // 300s: a cold scan crawls the site, which is well past npx's default patience.
  const { stdout } = await execFileAsync(
    "npx",
    ["-y", "is-agentic@latest", domain, "--json"],
    { timeout: 300_000, maxBuffer: 16 * 1024 * 1024 },
  );
  return JSON.parse(stdout);
}

function describe(report) {
  const b = report.score_breakdown ?? {};
  return [
    `score ${report.score}/100 — ${report.score_label}`,
    `essential ${b.essential?.earned ?? "?"}/${b.essential?.available ?? "?"} (${b.essential?.passing ?? "?"}/${b.essential?.total ?? "?"} passing)`,
    `recommended ${b.recommended?.earned ?? "?"}/${b.recommended?.available ?? "?"} (${b.recommended?.passing ?? "?"}/${b.recommended?.total ?? "?"} passing)`,
    `bonus +${b.bonus?.points ?? 0}`,
  ].join("\n  ");
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Scanning ${TARGET} …`);
  const report = await runScan(TARGET);

  const stamp = report.scanned_at ?? "unknown";
  writeFileSync(
    path.join(OUT_DIR, `report-${stamp.replace(/[:.]/g, "-")}.json`),
    JSON.stringify(report, null, 2),
  );

  const previous = existsSync(LATEST)
    ? JSON.parse(readFileSync(LATEST, "utf8"))
    : null;

  console.log(`\n  ${describe(report)}\n`);

  const issues = report.issues ?? [];
  if (issues.length === 0) {
    console.log("No open issues.");
  } else {
    console.log(`${issues.length} open issue(s):`);
    for (const issue of issues) {
      console.log(`  - [${issue.tier}/${issue.result}] ${issue.id} — ${issue.name}`);
      console.log(`      ${issue.details}`);
    }
  }

  let regressed = false;

  if (previous) {
    const delta = report.score - previous.score;
    console.log(
      `\nDelta vs previous (${previous.scanned_at}): ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`,
    );

    const before = new Set((previous.issues ?? []).map(issueKey));
    const after = new Set(issues.map(issueKey));

    const closed = (previous.issues ?? []).filter((i) => !after.has(issueKey(i)));
    const opened = issues.filter((i) => !before.has(issueKey(i)));

    for (const i of closed) console.log(`  closed:  ${i.id} (was ${i.result})`);
    for (const i of opened) console.log(`  opened:  ${i.id} (${i.result})`);

    // A newly-opened issue is only a regression if it was previously absent or
    // passing — a `partial` that turned `failed` counts, a `failed` that turned
    // `partial` does not.
    const rank = { failed: 2, partial: 1 };
    const worsened = opened.some((i) => {
      const prior = (previous.issues ?? []).find((p) => p.id === i.id);
      return !prior || (rank[i.result] ?? 0) > (rank[prior.result] ?? 0);
    });
    regressed = delta < 0 || worsened;
  } else {
    console.log("\nNo previous report stored — this scan becomes the baseline.");
  }

  writeFileSync(LATEST, JSON.stringify(report, null, 2));

  const logLine =
    `| ${stamp} | ${TARGET} | ${report.score} | ` +
    `${issues.length === 0 ? "—" : issues.map((i) => `${i.id}(${i.result})`).join(", ")} |\n`;
  if (!existsSync(LOG_FILE)) {
    writeFileSync(
      LOG_FILE,
      "# Agent-readiness log (is-agentic.com)\n\n" +
        "Appended by `scripts/agentic/scan.mjs`. One row per scan.\n\n" +
        "| Scanned at | Target | Score | Open issues |\n" +
        "|---|---|---|---|\n",
    );
  }
  appendFileSync(LOG_FILE, logLine);
  console.log(`\nReport: ${report.report_url}`);

  if (regressed && flag("fail-on-regression")) {
    console.error("\nRegression detected — failing as requested.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.stderr || error.message || error);
  process.exit(1);
});
