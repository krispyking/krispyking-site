// Cloudflare Pages Function backing /gentleman/results (CK-5875 success criterion 5:
// "A /gentleman/results view gated to Chris (simple token) showing tallies").
//
// Runs server-side only, so this is the one place the Supabase SERVICE_ROLE key may be
// used — it must be set as a Cloudflare Pages *secret* (never VITE_-prefixed, never
// shipped to the client) alongside SUPABASE_URL and RESULTS_TOKEN.
//
// Env vars required (Pages → Settings → Environment variables, Production + Preview):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESULTS_TOKEN

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const BALLOT_CHOICES = [
  'act1_chapter',
  'full_film',
  'documentary_first',
  'the_ride',
  'stop_here',
]

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token') || ''
  const expected = env.RESULTS_TOKEN || ''

  if (!expected || !token || !timingSafeEqual(token, expected)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: 'not_configured', detail: 'Supabase project not yet provisioned for this table (see supabase/migrations/0001_wog_votes.sql).' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/wog_votes?select=ballot_choice,cut_watched,created_at`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'upstream_error', status: res.status }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const rows = await res.json()

  const tallies = Object.fromEntries(BALLOT_CHOICES.map((c) => [c, 0]))
  for (const row of rows) {
    if (row.ballot_choice in tallies) tallies[row.ballot_choice]++
  }

  return new Response(
    JSON.stringify({ total: rows.length, tallies, latest: rows.at(-1)?.created_at ?? null }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
