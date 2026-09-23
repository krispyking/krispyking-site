// Anonymous, cookie-free pageview/engagement beacon for /futuretech (CK-6515).
//
// No analytics tooling ran on this site before this page — see CLAUDE.md's
// note on the /gentleman ballot (functions/gentleman/api/vote.js) for the
// only prior precedent of writing site events server-side to Notion. Reusing
// that pattern here means no new third-party account, no cookies, no
// visitor IDs, and no client-side tracker script: the client sends one
// fire-and-forget POST per event and nothing else is recorded.
//
// NOTION_TOKEN is the same Cloudflare Pages secret vote.js already reads
// (production + preview env vars on the "krispyking" Pages project) — read
// server-side only, never sent to the client and never present in the built
// bundle. The integration behind that token must have access to this
// database (Notion's "... -> Connections" menu) or every write here 404s.

const DATABASE_ID = '70579919-8277-46ab-976b-c074f2a481af';
const NOTION_VERSION = '2022-06-28';

const ALLOWED_EVENTS = new Set(['pageview', 'shortlist_view', 'explorer_search', 'explorer_filter', 'detail_view']);
const PATH_MAX = 200;

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Same best-effort per-IP rate limit as vote.js: resets on cold start,
// blunts a script hammering the endpoint rather than a determined abuser —
// the right tradeoff for a low-traffic anonymous beacon with no KV/D1
// binding on this project to do better cheaply.
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 30;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  if (hits.size > 5000) hits.clear();
  return timestamps.length > MAX_PER_WINDOW;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(ip)) {
    return json(429, { error: 'rate limited' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'malformed request' });
  }

  const event = typeof body?.event === 'string' ? body.event : '';
  const path = typeof body?.path === 'string' ? body.path.slice(0, PATH_MAX) : '';
  if (!ALLOWED_EVENTS.has(event)) {
    return json(400, { error: 'unknown event' });
  }

  // Referrer domain only — never the full referrer URL, which can carry
  // query strings/paths from the referring page.
  let referrerDomain = '';
  const referer = request.headers.get('Referer') || '';
  try {
    if (referer) referrerDomain = new URL(referer).hostname.slice(0, 100);
  } catch { /* malformed referer header — leave blank */ }

  const token = env.NOTION_TOKEN;
  if (!token) {
    // Analytics is best-effort; never surface a 502 to the beacon caller
    // over a missing secret.
    //
    // CK-6590: this and the return at the end of the handler used to be
    // `json(204, {})`. 204 is a null-body status, so `new Response(body,
    // { status: 204 })` throws a TypeError and Cloudflare turns that into
    // error 1101 — meaning EVERY successful beacon call 500'd and the
    // analytics database stayed empty from launch (2026-09-21) until this
    // fix. The error paths above all returned a body with a normal status,
    // so they worked, which is why the endpoint looked half-alive. Return a
    // 200 with a body, exactly as functions/gentleman/api/vote.js does.
    return json(200, { ok: true });
  }

  const now = new Date();
  const properties = {
    Event: { title: [{ text: { content: event } }] },
    Path: { rich_text: [{ text: { content: path } }] },
    'Referrer Domain': { rich_text: [{ text: { content: referrerDomain } }] },
    'Occurred At': { date: { start: now.toISOString() } },
  };

  try {
    await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent: { database_id: DATABASE_ID }, properties }),
    });
  } catch {
    // Best-effort — a dropped analytics event never affects the visitor.
  }

  return json(200, { ok: true });
}
