// Client half of the /futuretech contribution layer (CK-6590, Option A).
// The server half — validation, rate limiting and the Notion write — lives in
// functions/futuretech/api/contribute.js. Nothing submitted here is ever
// rendered back onto the page: every row is reviewed by hand in Notion.

// Must match TERMS_VERSION in functions/futuretech/api/contribute.js. The
// server rejects a submission carrying any other value, so bumping one
// without the other fails closed (visitors are told to reload) rather than
// silently recording an agreement to terms nobody published.
export const TERMS_VERSION = '2026-09-23'

export type ContributionType = 'already_taken' | 'would_pay' | 'missing_one'

export interface ContributionPayload {
  type: ContributionType
  technology: string
  rowId?: string
  company?: string
  companyUrl?: string
  whatTheySell?: string
  funding?: string
  comment?: string
  sciFiSource?: string
  wedge?: string
  whoPays?: string
}

// The published contribution terms, rendered verbatim next to every form and
// stored by version against every submission. Clauses 6 and 7 of the CK-6590
// draft cover claiming an archetype and are deliberately absent: claiming is
// Option B, which was not built.
export const TERMS: { heading: string; body: string }[] = [
  {
    heading: 'This list is public, and you can use it.',
    body:
      'Every technology, wedge, buyer and score on this page is published on purpose. Use any of it. ' +
      "You don't need permission, you don't owe credit, and nothing here is a secret. If you see something you want to build — build it.",
  },
  {
    heading: 'Chris may build any of it too, including something you suggested.',
    body:
      'This page is a working document for a startup search he is actually running. He may build anything on this list, ' +
      "including something you sent in, at any time, without notice and without paying you. If that isn't something you're comfortable with, don't send it.",
  },
  {
    heading: 'What you send stays yours — and stops being private.',
    body:
      'You keep whatever rights you have in what you write. By sending it you give us permission to publish it here, ' +
      'edit it for length and clarity, and act on it — free, worldwide, and permanently. ' +
      "You're also confirming you're free to share it and that it isn't confidential to you or anyone else.",
  },
  {
    heading: "Ideas aren't property. Execution is.",
    body:
      'Copyright protects the particular way something is written, not the underlying idea. ' +
      'Nothing posted here gives anyone a claim over a business someone else later builds. ' +
      "We're saying this plainly now so nobody is surprised later.",
  },
  {
    heading: "There's no payment, no equity and no share.",
    body:
      'Contributing gives you no stake in anything built from this list, now or in future. No royalty, no finder’s fee, nothing deferred. ' +
      'Credit is the only thing on offer, and only if you ask for it. ' +
      "If we ever want to pay someone for something specific, that's a separate conversation at the time.",
  },
  {
    heading: 'Corrections about real companies: stick to checkable facts.',
    body:
      "If you tell us a wedge is already taken, give us the company, the link, and what they sell. " +
      'Anything that reads as an accusation about a named company gets removed rather than edited.',
  },
  {
    heading: 'We can remove anything, at any time, without explaining why.',
    body:
      'We also collect nothing about you: no email, no name, no account, no cookies. ' +
      "A submission is the text you typed and nothing else, so there's no way for us to contact you and nothing to tie it back to you.",
  },
]

const GENERIC_ERROR = 'Something went wrong sending that. Please try again in a moment.'

/**
 * POSTs one contribution. Resolves on success; rejects with a message that is
 * safe to show the visitor. Deliberately not fire-and-forget (unlike
 * trackEvent) — a dropped analytics beacon is fine, a dropped contribution is
 * the visitor's effort thrown away, so failures surface.
 */
export async function submitContribution(payload: ContributionPayload): Promise<void> {
  let res: Response
  try {
    res = await fetch('/futuretech/api/contribute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, termsAccepted: true, termsVersion: TERMS_VERSION }),
    })
  } catch {
    throw new Error(GENERIC_ERROR)
  }

  if (res.ok) return

  let message = GENERIC_ERROR
  try {
    const data = await res.json()
    if (data && typeof data.error === 'string') message = data.error
  } catch {
    // Non-JSON error body — keep the generic message.
  }
  throw new Error(message)
}
