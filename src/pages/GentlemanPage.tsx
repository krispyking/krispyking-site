import { useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabaseClient'

// /gentleman — CK-5875. Its own brand identity, not a section of the main site (same
// reasoning as /understudylabs in App.tsx), so it renders standalone with no Nav.
//
// Per D-033's amendment: this is the ONLY public-facing surface for the project, and
// the word "wog" must never appear here — titles, copy, and URLs all say "gentleman"
// or "The Word of a Gentleman" in full. The internal abbreviation stays internal.
//
// Per CK-5875 criterion (3): no screenplay-derived imagery on this shell until the
// Gavigan/Pieterse rights conversation — family-owned material only (1972 footage
// frames, family photos). None of those assets have been supplied to this session, so
// the page ships with a plain typographic treatment and clearly-marked placeholders
// rather than inventing or substituting any imagery.

const BALLOT_OPTIONS: { value: string; label: string; detail: string }[] = [
  { value: 'act1_chapter', label: 'Act 1 chapter', detail: '~30 min, ~$840 — prove it, then decide again' },
  { value: 'full_film', label: 'The full film', detail: 'Straight through' },
  { value: 'documentary_first', label: 'Documentary first', detail: 'The family/journey story before the drama' },
  { value: 'the_ride', label: 'The ride', detail: 'Fund/follow the motorbike retracing as its own series' },
  { value: 'stop_here', label: 'Stop here', detail: 'It was a beautiful test' },
]

type FormState = 'idle' | 'submitting' | 'done' | 'error'

export default function GentlemanPage() {
  const [choice, setChoice] = useState('')
  const [advice, setAdvice] = useState('')
  const [contact, setContact] = useState('')
  const [cutWatched, setCutWatched] = useState<'full_demo' | 'standalone_trailer'>('full_demo')
  const [state, setState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!choice || !supabase) return
    setState('submitting')
    const { error } = await supabase.from('wog_votes').insert({
      ballot_choice: choice,
      advice: advice.trim() || null,
      contact: contact.trim() || null,
      cut_watched: cutWatched,
      user_agent: navigator.userAgent,
    })
    setState(error ? 'error' : 'done')
  }

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-serif">
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        {/* Title treatment */}
        <header className="mb-12 text-center">
          <p className="uppercase tracking-[0.2em] text-xs text-text-secondary mb-4">
            A family film, in progress
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            The Word of a Gentleman
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            A grandson's attempt to finish a screenplay his grandfather's life made
            possible — built with, and honest about, AI.
          </p>
        </header>

        {/* Chaptered video player — placeholder until the demo is cut (Cloudflare
            Stream signed URLs land here per CK-5875 criterion 2; nothing to embed yet) */}
        <section aria-label="Film" className="mb-12">
          <div className="relative aspect-video w-full bg-bg-card border border-border rounded-lg flex flex-col items-center justify-center gap-3 text-center px-6">
            <span className="text-text-secondary text-sm">
              Video not yet available — placeholder for the Cloudflare Stream player
            </span>
            <button
              type="button"
              disabled
              title="Enabled once the demo is cut and chapter markers exist"
              className="text-xs uppercase tracking-wide border border-border rounded px-3 py-1.5 text-text-secondary cursor-not-allowed opacity-60"
            >
              Jump to trailer
            </button>
          </div>
        </section>

        {/* AI / D-027 disclosure — must appear regardless of ballot/video state */}
        <section
          aria-label="About the AI in this film"
          className="mb-12 border border-border rounded-lg p-5 bg-bg-secondary text-sm text-text-secondary leading-relaxed"
        >
          <h2 className="text-text-primary font-semibold mb-2 text-base">
            About the AI in this film
          </h2>
          <p className="mb-2">
            Some of what you see and hear here is AI-generated, and we say so plainly
            wherever it appears. Any voice performance standing in for Chris's
            grandfather, Dr Oliver Neil Ransford, is a consented synthetic
            reconstruction, built only from his own real 1972 recording and his own
            written words — never invented dialogue in his voice. His family gave
            written consent for this before any of it was made.
          </p>
          <p>
            This is a private round: the link isn't public, and nothing shown here
            uses material from the 2001 screenplay itself — only family-owned
            photographs, footage, and writing. A wider release waits on a separate
            rights conversation.
          </p>
        </section>

        {/* Ballot + advice form */}
        <section aria-label="Tell us what to do next">
          <h2 className="text-2xl font-bold mb-2">So — how far down the rabbit hole do we go?</h2>
          <p className="text-text-secondary text-sm mb-6">
            Your answer is one input into a family decision, not a public poll.
            Responses are read by Chris and the family only.
          </p>

          {state === 'done' ? (
            <p className="text-accent-soft text-base">
              Thank you — your response was recorded.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="space-y-3">
                <legend className="sr-only">Which of these would you choose?</legend>
                {BALLOT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-start gap-3 border border-border rounded-lg p-4 cursor-pointer hover:border-accent/60 transition-colors"
                  >
                    <input
                      type="radio"
                      name="ballot_choice"
                      value={opt.value}
                      checked={choice === opt.value}
                      onChange={() => setChoice(opt.value)}
                      required
                      className="mt-1 accent-accent"
                    />
                    <span>
                      <span className="block font-semibold text-text-primary">{opt.label}</span>
                      <span className="block text-text-secondary text-sm">{opt.detail}</span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <div>
                <label htmlFor="cut_watched" className="block text-sm text-text-secondary mb-1">
                  Which cut did you watch?
                </label>
                <select
                  id="cut_watched"
                  value={cutWatched}
                  onChange={(e) => setCutWatched(e.target.value as typeof cutWatched)}
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-primary"
                >
                  <option value="full_demo">The full ~15-minute demo</option>
                  <option value="standalone_trailer">Just the standalone trailer</option>
                </select>
              </div>

              <div>
                <label htmlFor="advice" className="block text-sm text-text-secondary mb-1">
                  Advice, contacts, warnings, ideas — anything you'd tell us
                </label>
                <textarea
                  id="advice"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  rows={4}
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-primary resize-y"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm text-text-secondary mb-1">
                  Email or phone, if we can follow up (optional)
                </label>
                <input
                  id="contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-primary"
                />
              </div>

              {!supabaseConfigured && (
                <p className="text-xs text-text-secondary border border-border rounded-lg p-3">
                  The response form isn't connected yet on this staging build — submissions
                  won't be saved until a Supabase project is wired up. Everything else on
                  this page reflects the intended final state.
                </p>
              )}
              {state === 'error' && (
                <p className="text-sm text-red-400">
                  Something went wrong sending that — please try again in a moment.
                </p>
              )}

              <button
                type="submit"
                disabled={!choice || !supabaseConfigured || state === 'submitting'}
                className="w-full sm:w-auto bg-accent text-bg-primary font-semibold rounded-lg px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-soft transition-colors"
              >
                {state === 'submitting' ? 'Sending…' : 'Send my response'}
              </button>
            </form>
          )}
        </section>

        <p className="mt-16 text-xs text-text-secondary text-center">
          No analytics beyond Cloudflare's own basic traffic stats. Your response is
          read by Chris and the family; it is not shared, sold, or published.
        </p>
      </div>
    </main>
  )
}
