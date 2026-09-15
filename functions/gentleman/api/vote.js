// Writes one Movement V ballot response straight to Notion (D-036, CK-6234).
//
// NOTION_TOKEN is a Cloudflare Pages secret (production + preview env vars
// on the "krispyking" Pages project) — read server-side only, never sent to
// the client and never present in the built bundle. The integration behind
// that token must be connected to the ballot database via Notion's "...  ->
// Connections" menu, or every write here 404s (Chris's manual step).

const DATABASE_ID = 'f5fa32de-76ed-4550-847b-b622f04a61e1';
const NOTION_VERSION = '2022-06-28';

// Keys are the values the ballot form sends; values are the exact Notion
// select option names in the "🗳️ WOaG · Ballot Responses" database.
const VOTE_LABELS = {
  act1_chapter: 'Act 1 chapter',
  full_film: 'The full film',
  documentary_first: 'Documentary first',
  the_ride: 'The ride',
  stop_here: 'Stop here',
};

const CUT_LABELS = {
  full_demo: 'Full demo',
  trailer_only: 'Trailer only',
};

const ADVICE_MAX = 4000;
const CONTACT_MAX = 200;
const GENERIC_ERROR = 'Something went wrong sending that. Please try again in a moment.';

// Best-effort per-IP rate limit. State lives in this isolate's module scope:
// it resets on a cold start and isn't shared across isolates or regions.
// That's the right tradeoff for a low-traffic family ballot — it needs to
// blunt a script hammering the endpoint, not stop a determined distributed
// abuser, and there's no KV/D1 binding on this project to do better cheaply.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map(); // ip -> timestamps (ms) within the current window

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  // Bound memory if a long-lived isolate sees many distinct IPs.
  if (hits.size > 5000) hits.clear();
  return timestamps.length > MAX_PER_WINDOW;
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Notion rich_text/title content is capped at 2000 chars per text object.
function chunkText(text) {
  const chunks = [];
  for (let i = 0; i < text.length; i += 2000) {
    chunks.push({ text: { content: text.slice(i, i + 2000) } });
  }
  return chunks;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(ip)) {
    return json(429, { error: 'Too many submissions from this connection. Please try again later.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Malformed request.' });
  }

  const ballotChoice = typeof body?.ballot_choice === 'string' ? body.ballot_choice : '';
  const cutWatched = typeof body?.cut_watched === 'string' ? body.cut_watched : '';
  const advice = typeof body?.advice === 'string' ? body.advice.trim() : '';
  const contact = typeof body?.contact === 'string' ? body.contact.trim() : '';

  if (!ballotChoice || !Object.prototype.hasOwnProperty.call(VOTE_LABELS, ballotChoice)) {
    return json(400, { error: 'Pick a vote option and let us know which cut you watched.' });
  }
  if (!cutWatched || !Object.prototype.hasOwnProperty.call(CUT_LABELS, cutWatched)) {
    return json(400, { error: 'Pick a vote option and let us know which cut you watched.' });
  }
  if (advice.length > ADVICE_MAX) {
    return json(400, { error: `Advice must be ${ADVICE_MAX} characters or fewer.` });
  }
  if (contact.length > CONTACT_MAX) {
    return json(400, { error: `Contact must be ${CONTACT_MAX} characters or fewer.` });
  }

  // TEMP (CK-6234 preview verification only — removed before production
  // merge): echoes back which failure mode fired, gated on a header no
  // real ballot submission sends, so a normal visitor never sees it.
  const DEBUG = request.headers.get('X-CK6234-Debug') === '1';

  const token = env.NOTION_TOKEN;
  if (!token) {
    return json(502, DEBUG ? { error: GENERIC_ERROR, debug: 'NOTION_TOKEN not set in env' } : { error: GENERIC_ERROR });
  }

  const voteLabel = VOTE_LABELS[ballotChoice];
  const cutLabel = CUT_LABELS[cutWatched];
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const source = (request.headers.get('Referer') || '').slice(0, CONTACT_MAX);

  const properties = {
    Response: { title: [{ text: { content: `${voteLabel} — ${dateStr}` } }] },
    Vote: { select: { name: voteLabel } },
    'Cut watched': { select: { name: cutLabel } },
    Submitted: { date: { start: now.toISOString() } },
  };
  if (advice) properties.Advice = { rich_text: chunkText(advice) };
  if (contact) properties.Contact = { rich_text: chunkText(contact) };
  if (source) properties.Source = { rich_text: chunkText(source) };

  let notionRes;
  try {
    notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties,
      }),
    });
  } catch (err) {
    return json(502, DEBUG ? { error: GENERIC_ERROR, debug: `fetch threw: ${err}` } : { error: GENERIC_ERROR });
  }

  if (!notionRes.ok) {
    if (DEBUG) {
      const bodyText = await notionRes.text();
      return json(502, { error: GENERIC_ERROR, debug: `notion ${notionRes.status}: ${bodyText.slice(0, 500)}` });
    }
    return json(502, { error: GENERIC_ERROR });
  }

  return json(200, { ok: true });
}
