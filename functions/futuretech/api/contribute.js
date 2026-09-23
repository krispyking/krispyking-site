// The /futuretech contribution layer — Option A, "the correction layer"
// (CK-6590). Writes one visitor submission straight to Notion.
//
// Three affordances, and only three. Each is a *correction* or a *signal*,
// never a vote: the CK-6590 decision document cut voting deliberately,
// because an anonymous vote on "which sci-fi business should Chris build"
// measures charisma rather than buildability — the exact failure the
// venture-scoring model exists to correct. Corrections do not aggregate, so
// one good submission is useful on its own and no counter is ever shown.
//
//   already_taken — "a funded company already owns this wedge"
//   would_pay     — "I am the buyer named on this row"
//   missing_one   — "you're missing a prediction"
//
// NOTHING WRITTEN HERE IS PUBLIC. Every row lands with Status = New and is
// reviewed by hand in Notion; the page never reads this database back. That
// is what bounds the moderation burden and what makes spam cost a click
// rather than credibility (CK-6590 section 7, mitigation 1).
//
// NO PERSONAL DATA. v1 deliberately collects no email, no name and no
// visitor id, so Hong Kong's PDPO (Cap. 486) obligations are not engaged
// before Chris has taken the advice flagged in CK-6590 section 6(c). Do not
// add a contact field here without a Personal Information Collection
// Statement at the point of collection.
//
// `already_taken` takes STRUCTURED fields, not prose, on purpose: publishing
// a visitor's free-text claims about named, funded, real companies would
// make Chris the publisher of them (CK-6590 section 6(d)). Structured fields
// plus approve-before-publish is the mitigation. Do not replace them with a
// textarea.
//
// NOTION_TOKEN is the Cloudflare Pages secret that functions/gentleman/api/
// vote.js and functions/futuretech/api/event.js already read (production +
// preview on the "krispyking" Pages project) — server-side only, never sent
// to the client and never present in the built bundle. The integration
// behind that token must be connected to the database below via Notion's
// "... -> Connections" menu, or every write here 404s. That is a manual step
// outside the repo, exactly as it was for CK-6234.

const DATABASE_ID = 'c30a1247-a5b8-42dd-b9ec-151a27021bd0';
const NOTION_VERSION = '2022-06-28';

// Bump when the visitor-facing terms change. Stored on every row, so a later
// "I never agreed to that" is answered with the record of what was accepted
// and when, rather than with today's copy of the terms (CK-6590 section 7,
// mitigation 4). Must match TERMS_VERSION in src/lib/contribute.ts.
const TERMS_VERSION = '2026-09-23';

const TYPES = new Set(['already_taken', 'would_pay', 'missing_one']);

const LIMITS = {
  technology: 300,
  rowId: 100,
  company: 200,
  companyUrl: 500,
  whatTheySell: 500,
  funding: 200,
  comment: 2000,
  sciFiSource: 300,
  wedge: 1000,
  whoPays: 300,
};

const GENERIC_ERROR = 'Something went wrong sending that. Please try again in a moment.';

// Best-effort per-IP rate limit, same shape as its two sibling functions:
// module-scope state that resets on a cold start and is not shared across
// isolates or regions. It blunts a script hammering the endpoint rather than
// stopping a determined distributed abuser, which is the right trade for a
// low-traffic endpoint with no KV/D1 binding on this project.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map(); // ip -> timestamps (ms) within the current window

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  if (hits.size > 5000) hits.clear();
  return timestamps.length > MAX_PER_WINDOW;
}

function json(status, data) {
  // Never return a null-body status (204/205/304) with a body here: the
  // Response constructor throws and Cloudflare serves error 1101. That defect
  // kept the analytics beacon next door silently broken from launch — see the
  // CK-6590 note in event.js.
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Notion caps rich_text/title content at 2000 chars per text object.
function chunkText(text) {
  const chunks = [];
  for (let i = 0; i < text.length; i += 2000) {
    chunks.push({ text: { content: text.slice(i, i + 2000) } });
  }
  return chunks;
}

// Returns a trimmed string, or null when the value is absent or not a string.
function str(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function tooLong(value, limit) {
  return value != null && value.length > limit;
}

// Accepts only an http(s) URL. Anything else — javascript:, data:, a bare
// hostname — is rejected rather than coerced, since the value is rendered as
// a link in Notion for Chris to click.
function httpUrl(value) {
  if (value == null) return null;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return undefined; // signals "present but invalid"
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return undefined;
  return parsed.toString();
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

  const type = str(body?.type);
  if (!type || !TYPES.has(type)) {
    return json(400, { error: 'Unknown submission type.' });
  }

  // Clause 3 of the published terms is a licence, and a licence needs
  // agreement. The tick is required server-side, not just in the UI, and the
  // version that was ticked has to match the one this build serves.
  if (body?.termsAccepted !== true) {
    return json(400, { error: 'Please accept the contribution terms first.' });
  }
  if (str(body?.termsVersion) !== TERMS_VERSION) {
    return json(400, { error: 'These terms are out of date. Please reload the page and try again.' });
  }

  const technology = str(body?.technology);
  const rowId = str(body?.rowId);
  const company = str(body?.company);
  const companyUrlRaw = str(body?.companyUrl);
  const whatTheySell = str(body?.whatTheySell);
  const funding = str(body?.funding);
  const comment = str(body?.comment);
  const sciFiSource = str(body?.sciFiSource);
  const wedge = str(body?.wedge);
  const whoPays = str(body?.whoPays);

  if (
    tooLong(technology, LIMITS.technology) ||
    tooLong(rowId, LIMITS.rowId) ||
    tooLong(company, LIMITS.company) ||
    tooLong(companyUrlRaw, LIMITS.companyUrl) ||
    tooLong(whatTheySell, LIMITS.whatTheySell) ||
    tooLong(funding, LIMITS.funding) ||
    tooLong(comment, LIMITS.comment) ||
    tooLong(sciFiSource, LIMITS.sciFiSource) ||
    tooLong(wedge, LIMITS.wedge) ||
    tooLong(whoPays, LIMITS.whoPays)
  ) {
    return json(400, { error: 'That submission is too long. Please shorten it and try again.' });
  }

  const companyUrl = httpUrl(companyUrlRaw);
  if (companyUrl === undefined) {
    return json(400, { error: 'That company link needs to be a full http(s) URL.' });
  }

  // Per-type required fields. A submission missing them is rejected outright
  // rather than written as a half-row nobody can act on.
  if (type === 'already_taken') {
    if (!technology || !company) {
      return json(400, { error: 'Tell us which company already owns this wedge.' });
    }
  } else if (type === 'would_pay') {
    if (!technology) {
      return json(400, { error: 'Missing the row this signal belongs to.' });
    }
  } else if (type === 'missing_one') {
    if (!technology || !sciFiSource || !wedge || !whoPays) {
      return json(400, {
        error: 'A missing prediction needs the source, the technology, the wedge and who would pay.',
      });
    }
  }

  const token = env.NOTION_TOKEN;
  if (!token) {
    // Unlike the analytics beacon, a contribution must never fail silently:
    // the visitor is told it did not save, so they can try again.
    return json(502, { error: GENERIC_ERROR });
  }

  // Referrer domain only — never the full referrer URL, which can carry query
  // strings and paths from the referring page.
  let referrerDomain = '';
  try {
    const referer = request.headers.get('Referer') || '';
    if (referer) referrerDomain = new URL(referer).hostname.slice(0, 100);
  } catch { /* malformed Referer header — leave blank */ }

  const now = new Date();
  const title = `${type} — ${technology}`.slice(0, 200);

  const properties = {
    Submission: { title: [{ text: { content: title } }] },
    Type: { select: { name: type } },
    Status: { select: { name: 'New' } },
    'Submitted At': { date: { start: now.toISOString() } },
    'Terms Version': { rich_text: chunkText(TERMS_VERSION) },
  };
  if (technology) properties.Technology = { rich_text: chunkText(technology) };
  if (rowId) properties['Row ID'] = { rich_text: chunkText(rowId) };
  if (company) properties.Company = { rich_text: chunkText(company) };
  if (companyUrl) properties['Company URL'] = { url: companyUrl };
  if (whatTheySell) properties['What They Sell'] = { rich_text: chunkText(whatTheySell) };
  if (funding) properties.Funding = { rich_text: chunkText(funding) };
  if (comment) properties.Comment = { rich_text: chunkText(comment) };
  if (sciFiSource) properties['Sci-Fi Source'] = { rich_text: chunkText(sciFiSource) };
  if (wedge) properties.Wedge = { rich_text: chunkText(wedge) };
  if (whoPays) properties['Who Pays'] = { rich_text: chunkText(whoPays) };
  if (referrerDomain) properties['Referrer Domain'] = { rich_text: chunkText(referrerDomain) };

  let notionRes;
  try {
    notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent: { database_id: DATABASE_ID }, properties }),
    });
  } catch {
    return json(502, { error: GENERIC_ERROR });
  }

  if (!notionRes.ok) {
    return json(502, { error: GENERIC_ERROR });
  }

  return json(200, { ok: true });
}
