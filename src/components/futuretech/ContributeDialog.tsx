import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  submitContribution,
  TERMS,
  type ContributionType,
} from '../../lib/contribute'

interface Props {
  /** Which affordance opened this, or null when closed. */
  intent: ContributionType | null
  /** The technology being corrected. Absent for a page-level `missing_one`. */
  technology?: string
  rowId?: string
  onClose: () => void
}

const HEADINGS: Record<ContributionType, { title: string; blurb: string }> = {
  already_taken: {
    title: 'This wedge is already taken',
    blurb:
      'Name the company. Facts only — who they are and what they sell. This is the single most useful thing you can tell us: 87% of the shortlist already has a funded incumbent, and the ones we missed are the ones that matter.',
  },
  would_pay: {
    title: "I'd pay for this",
    blurb:
      'A candidate here is not a venture until the wedge and the buyer are named. If that buyer is you, say so — and say what you would actually want, in your words.',
  },
  missing_one: {
    title: "You're missing one",
    blurb:
      'A prediction that should be in the corpus. It does not have to be Star Trek. Tell us what it solves today and who would pay for it — a technology with no named buyer stays parked.',
  },
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-wide text-text-secondary/70 mb-1.5">
      {children}
      {hint && <span className="ml-1.5 normal-case tracking-normal text-text-secondary/50">{hint}</span>}
    </span>
  )
}

const inputClass =
  'w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors'

export default function ContributeDialog({ intent, technology, rowId, onClose }: Props) {
  const [company, setCompany] = useState('')
  const [companyUrl, setCompanyUrl] = useState('')
  const [whatTheySell, setWhatTheySell] = useState('')
  const [funding, setFunding] = useState('')
  const [comment, setComment] = useState('')
  const [sciFiSource, setSciFiSource] = useState('')
  const [newTechnology, setNewTechnology] = useState('')
  const [wedge, setWedge] = useState('')
  const [whoPays, setWhoPays] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  // Reset every field whenever the dialog opens, so a second submission never
  // inherits the first one's text.
  useEffect(() => {
    if (!intent) return
    setCompany('')
    setCompanyUrl('')
    setWhatTheySell('')
    setFunding('')
    setComment('')
    setSciFiSource('')
    setNewTechnology('')
    setWedge('')
    setWhoPays('')
    setAccepted(false)
    setStatus('idle')
    setError(null)
  }, [intent])

  useEffect(() => {
    if (!intent) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [intent, onClose])

  if (!intent) return null

  const copy = HEADINGS[intent]
  const subjectTechnology = intent === 'missing_one' ? newTechnology : technology || ''

  const canSubmit =
    accepted &&
    status === 'idle' &&
    (intent === 'already_taken'
      ? company.trim() !== ''
      : intent === 'would_pay'
        ? true
        : newTechnology.trim() !== '' &&
          sciFiSource.trim() !== '' &&
          wedge.trim() !== '' &&
          whoPays.trim() !== '')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !intent) return
    setStatus('sending')
    setError(null)
    try {
      await submitContribution({
        type: intent,
        technology: subjectTechnology,
        rowId,
        company: company || undefined,
        companyUrl: companyUrl || undefined,
        whatTheySell: whatTheySell || undefined,
        funding: funding || undefined,
        comment: comment || undefined,
        sciFiSource: sciFiSource || undefined,
        wedge: wedge || undefined,
        whoPays: whoPays || undefined,
      })
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong sending that.')
      setStatus('idle')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/70 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative mx-auto my-10 w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-bg-secondary p-6"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-text-primary">{copy.title}</h2>
              {intent !== 'missing_one' && technology && (
                <p className="text-sm text-accent mt-1">{technology}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-full border border-border h-8 w-8 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/50 transition-colors"
            >
              ✕
            </button>
          </div>

          {status === 'done' ? (
            <div className="py-4">
              <p className="text-text-primary leading-relaxed mb-2">Got it — thank you.</p>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                It goes to Chris to check by hand. Nothing you send appears on this page automatically, and
                corrections that hold up change the scores on the row itself.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">{copy.blurb}</p>

              <div className="space-y-4">
                {intent === 'already_taken' && (
                  <>
                    <label className="block">
                      <Label>Company</Label>
                      <input
                        className={inputClass}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        maxLength={200}
                        placeholder="Reality Defender"
                        required
                      />
                    </label>
                    <label className="block">
                      <Label hint="optional">Link</Label>
                      <input
                        className={inputClass}
                        value={companyUrl}
                        onChange={(e) => setCompanyUrl(e.target.value)}
                        maxLength={500}
                        type="url"
                        placeholder="https://..."
                      />
                    </label>
                    <label className="block">
                      <Label hint="optional">What they sell</Label>
                      <input
                        className={inputClass}
                        value={whatTheySell}
                        onChange={(e) => setWhatTheySell(e.target.value)}
                        maxLength={500}
                        placeholder="Deepfake detection API for newsrooms"
                      />
                    </label>
                    <label className="block">
                      <Label hint="optional">Funding, if you know it</Label>
                      <input
                        className={inputClass}
                        value={funding}
                        onChange={(e) => setFunding(e.target.value)}
                        maxLength={200}
                        placeholder="$48M Series A"
                      />
                    </label>
                  </>
                )}

                {intent === 'would_pay' && (
                  <label className="block">
                    <Label hint="optional">What you'd actually want</Label>
                    <textarea
                      className={`${inputClass} min-h-[110px] resize-y`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={2000}
                      placeholder="Who you are, what you'd pay for, and what the current alternative costs you."
                    />
                  </label>
                )}

                {intent === 'missing_one' && (
                  <>
                    <label className="block">
                      <Label>Where it's from</Label>
                      <input
                        className={inputClass}
                        value={sciFiSource}
                        onChange={(e) => setSciFiSource(e.target.value)}
                        maxLength={300}
                        placeholder="Series, film or book — and the episode if you know it"
                        required
                      />
                    </label>
                    <label className="block">
                      <Label>The technology</Label>
                      <input
                        className={inputClass}
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        maxLength={300}
                        placeholder="What it was, in the story"
                        required
                      />
                    </label>
                    <label className="block">
                      <Label>The wedge</Label>
                      <textarea
                        className={`${inputClass} min-h-[80px] resize-y`}
                        value={wedge}
                        onChange={(e) => setWedge(e.target.value)}
                        maxLength={1000}
                        placeholder="The one narrow real-world problem a thin slice of this solves today"
                        required
                      />
                    </label>
                    <label className="block">
                      <Label>Who pays</Label>
                      <input
                        className={inputClass}
                        value={whoPays}
                        onChange={(e) => setWhoPays(e.target.value)}
                        maxLength={300}
                        placeholder="A named buyer, not a market category"
                        required
                      />
                    </label>
                  </>
                )}
              </div>

              <details className="mt-5 rounded-lg border border-border bg-bg-primary/50 p-3">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-text-secondary/70">
                  What happens to what you send us
                </summary>
                <ol className="mt-3 space-y-3 list-decimal pl-4">
                  {TERMS.map((clause) => (
                    <li key={clause.heading} className="text-xs text-text-secondary leading-relaxed">
                      <span className="font-semibold text-text-primary">{clause.heading}</span> {clause.body}
                    </li>
                  ))}
                </ol>
              </details>

              <label className="mt-4 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                  required
                />
                <span className="text-xs text-text-secondary leading-relaxed">
                  I've read the above. What I'm sending isn't confidential, I'm free to share it, and I'm not
                  owed anything for it.
                </span>
              </label>

              {error && (
                <p role="alert" className="mt-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === 'sending' ? 'Sending…' : 'Send it'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-text-secondary/60 hover:text-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
