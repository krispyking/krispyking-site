#!/usr/bin/env node
/**
 * export-futuretech.mjs — CK-6515: re-runnable Notion → JSON export for the
 * /futuretech page.
 *
 * Pulls every row of the "Star Trek Technology Database" (sci-fi technology
 * venture-screening corpus) from Notion and writes src/data/futuretech.json.
 *
 * SECURITY: NOTION_TOKEN is read from the environment at export time only.
 * It is never written to disk, never logged, and never present in the
 * output file, the client bundle, or a Cloudflare Function. This script is
 * not part of the deployed site — it runs before the build, producing a
 * static JSON file that the app then imports with no live Notion call.
 *
 * Usage:
 *   NOTION_TOKEN=secret_xxx node scripts/export-futuretech.mjs
 *
 * Idempotent and safe to re-run at any time (read-only — makes no writes to
 * Notion). Re-run this after CK-6390 (archetype re-rank) closes, or any time
 * the source database changes, to refresh src/data/futuretech.json.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '..', 'src', 'data', 'futuretech.json');

// The data source underlying the "Star Trek Technology Database" in Notion.
// Override with NOTION_DATA_SOURCE_ID if the source ever moves.
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || '8e42f302-6c3b-4e1b-8a24-7e05ead72d9e';

const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) {
  console.error('FATAL: NOTION_TOKEN is not set. Export aborted — no token, no request.');
  process.exit(1);
}

// Notion's raw REST API can be reached directly with a real integration
// token (api.notion.com). On the OpenClaw26 fleet droplet, where the
// workspace's Free-tier plan blocks live outbound calls from some sandboxes,
// point this at the droplet's notion-proxy instead:
//   NOTION_API_BASE=http://localhost:19000 node scripts/export-futuretech.mjs
// (notion-proxy forwards 1:1 to api.notion.com with its own stored token,
// so NOTION_TOKEN above is still required by this script's own auth header
// unless the proxy is configured to inject it itself — check the proxy's
// own docs before assuming either.)
const API_BASE = process.env.NOTION_API_BASE || 'https://api.notion.com';
const NOTION_VERSION = '2025-09-03'; // multi-source-database API — resolves formula properties to real values

async function notionRequest(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Notion API ${method} ${path} → HTTP ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  }
  return json;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function title(props, name) {
  const v = props[name];
  return v?.title ? v.title.map((t) => t.plain_text).join('') : '';
}
function text(props, name) {
  const v = props[name];
  return v?.rich_text ? v.rich_text.map((t) => t.plain_text).join('') : '';
}
function num(props, name) {
  const v = props[name];
  return v && v.number != null ? v.number : null;
}
function sel(props, name) {
  const v = props[name];
  return v?.select ? v.select.name : null;
}
function checkbox(props, name) {
  const v = props[name];
  return !!v?.checkbox;
}
function formula(props, name) {
  const f = props[name]?.formula;
  if (!f) return null;
  if (f.type === 'number') return f.number;
  if (f.type === 'string') return f.string;
  if (f.type === 'boolean') return f.boolean;
  return null;
}

function mapRow(page) {
  const p = page.properties || {};
  return {
    id: page.id,
    url: page.url,
    technology: title(p, 'Technology'),
    source: sel(p, 'Source'),
    seriesFranchise: text(p, 'Series / Franchise'),
    season: text(p, 'Season'),
    episodeNumber: text(p, 'Episode #'),
    episodeWork: text(p, 'Episode / Work'),
    episodeAppearances: text(p, 'Episode Appearances'),
    purpose: text(p, 'Purpose (Why)'),
    realWorldBenefit: text(p, 'Real-World Benefit'),
    realWorldStatus: sel(p, 'Real-World Status'),
    howItCouldBeBuilt: text(p, 'How It Could Be Built'),
    investmentLevel: sel(p, 'Industry Investment Level'),
    investmentNote: text(p, 'Investment Note'),
    scores: {
      benefit: num(p, 'Benefit Score'),
      easeOfBuilding: num(p, 'Ease of Building (Fictional Tech)'),
      aiEnablesTech: num(p, 'AI Enables Tech'),
      roi: num(p, 'ROI Score'),
      composite: formula(p, 'Composite Score'),
      soloVenture: formula(p, 'Solo Venture Score'),
    },
    venture: {
      soloBuildable: num(p, 'Solo Buildable'),
      capitalToMVP: sel(p, 'Capital to MVP'),
      timeToMVP: sel(p, 'Time to MVP'),
      wedge: text(p, 'The Wedge'),
      whoPays: text(p, 'Who Pays'),
      incumbentRisk: sel(p, 'Incumbent Risk'),
      verdict: sel(p, 'Verdict'),
    },
    // CK-6390 fields — absent on rows the archetype re-rank hasn't reached
    // (or before CK-6390 lands at all). Always present as keys so downstream
    // code never has to branch on their existence.
    archetype: sel(p, 'Archetype'),
    archetypePrimary: checkbox(p, 'Archetype Primary'),
    namedIncumbents: text(p, 'Named Incumbents'),
    weakProvenance: checkbox(p, 'Weak Provenance'),
  };
}

async function fetchAllRows() {
  const rows = [];
  let cursor;
  let guard = 0;
  for (;;) {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const page = await notionRequest('POST', `/v1/data_sources/${DATA_SOURCE_ID}/query`, body);
    for (const result of page.results || []) rows.push(mapRow(result));
    guard += 1;
    if (!page.has_more || guard > 50) break;
    cursor = page.next_cursor;
    await sleep(350); // stay comfortably under Notion's ~3 req/s ceiling
  }
  return rows;
}

async function main() {
  console.log(`Fetching futuretech corpus from data source ${DATA_SOURCE_ID}...`);
  const rows = await fetchAllRows();
  if (rows.length === 0) {
    throw new Error('Fetched 0 rows — refusing to overwrite an existing export with an empty one.');
  }

  const out = {
    generatedAt: new Date().toISOString(),
    rowCount: rows.length,
    rows,
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${rows.length} rows to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('FATAL:', err.stack || err.message);
  process.exit(1);
});
