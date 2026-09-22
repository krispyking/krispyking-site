import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFutureTechData } from '../hooks/useFutureTechData'
import { trackEvent } from '../lib/analytics'
import DataBadge from '../components/futuretech/DataBadge'
import ShortlistSection from '../components/futuretech/ShortlistSection'
import BrowseByShowSection from '../components/futuretech/BrowseByShowSection'
import TimelineSection from '../components/futuretech/TimelineSection'
import ExplorerSection from '../components/futuretech/ExplorerSection'
import DetailDrawer from '../components/futuretech/DetailDrawer'
import type { FutureTechRow } from '../types/futuretech'

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, delay },
  }
}

const SCORING_FIELDS = [
  { name: 'Benefit Score', desc: 'How much real-world value the underlying benefit would deliver, 0–10, regardless of who builds it.' },
  { name: 'Ease of Building (Fictional Tech)', desc: 'How hard the in-fiction gadget itself would be to build. Kept for research context — it scores the prop, not the business.' },
  { name: 'AI Enables Tech', desc: 'How much of what would have required a lab or a team ten years ago can now be done with an AI agent and a laptop, 0–10.' },
  { name: 'ROI Score', desc: 'Rough return-on-investment signal from the original research pass, 0–10.' },
  { name: 'Composite Score', desc: 'The original single ranking (Benefit + Ease + AI + ROI, rolled up). Kept in the data for every row — see why it isn’t what drives the shortlist below.' },
]

const VENTURE_FIELDS = [
  { name: 'Solo Buildable', desc: 'Could one person plus an AI agent fleet ship a working v1? 1–10.' },
  { name: 'Capital to MVP', desc: 'What Chris would actually need to spend — not what the industry is spending on the underlying technology.' },
  { name: 'Time to MVP', desc: 'Weeks, not years — or it isn’t Bucket B.' },
  { name: 'The Wedge', desc: 'The single narrow real-world problem a thin slice of this solves today.' },
  { name: 'Who Pays', desc: 'A named buyer, not a market category.' },
  { name: 'Incumbent Risk', desc: 'Is a funded player already owning this wedge? Hardened against named, funded competitors as of CK-6390 — most of the shortlist scores High or Owned here.' },
  { name: 'Verdict', desc: 'Transformational / Solo-AI / Neither / Park — the bucket this row landed in.' },
]

export default function FutureTechPage() {
  const { data, error } = useFutureTechData()
  const [selected, setSelected] = useState<FutureTechRow | null>(null)
  const [explorerVerdict, setExplorerVerdict] = useState<string | undefined>(undefined)
  const [explorerSeries, setExplorerSeries] = useState<string | undefined>(undefined)

  useEffect(() => {
    trackEvent('pageview')
  }, [])

  function selectRow(row: FutureTechRow) {
    setSelected(row)
    trackEvent('detail_view')
  }

  function scrollToExplorer(verdict?: string) {
    setExplorerVerdict(verdict)
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToExplorerForSeries(series: string) {
    setExplorerSeries(series)
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <DetailDrawer row={selected} onClose={() => setSelected(null)} />

      <main>
      {/* Hero / framing */}
      <div className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p {...fadeUp()} className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
            Sci-fi technology venture screening
          </motion.p>
          <motion.h1 {...fadeUp(0.05)} className="font-serif text-5xl sm:text-6xl font-bold text-text-primary mb-6 leading-tight">
            Sci-fi already wrote<br />the product briefs.
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-text-secondary text-xl leading-relaxed mb-6">
            Star Trek — and science fiction more broadly — made hundreds of specific predictions about
            future technology. Some were wrong. Some arrived. Each one that arrived is a problem
            someone already imagined solving, with the benefit already articulated. This page mines
            that corpus for the narrow slice one person, plus an AI agent fleet, could actually ship.
          </motion.p>

          {data && (
            <motion.div {...fadeUp(0.15)}>
              <DataBadge generatedAt={data.generatedAt} rowCount={data.rowCount} />
            </motion.div>
          )}
          {error && (
            <motion.p {...fadeUp(0.15)} className="text-sm text-red-400">
              Couldn't load the dataset ({error}). Try refreshing.
            </motion.p>
          )}
        </div>
      </div>

      {/* Bucket A vs B */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-border">
        <motion.div {...fadeUp()} className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Bucket A — Transformational</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Requires capital, teams, regulatory clearance, physical supply chain, or a decade. Real,
              often enormous — and not the target here. Tracked as market context and as evidence of
              where demand is heading, never promoted to a build candidate.
            </p>
          </div>
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">Bucket B — Solo-AI</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              A narrow, useful slice of the prediction that one person plus an AI agent fleet can
              build, ship, and sell in weeks, not years. This is the target — and the whole scoring
              model below exists to surface it.
            </p>
          </div>
        </motion.div>
        <motion.p {...fadeUp(0.1)} className="text-text-secondary text-sm leading-relaxed mt-6">
          The Holodeck is Bucket A: transformational, not solo-buildable, not the target. But a
          narrow matching-and-screening problem buried inside a Bucket-A prediction — a biofilter
          concept, a compatibility-screening system — is exactly the kind of thing one person can
          ship a v1 of today. Ranking by raw ambition misses that split entirely; ranking by
          <em> Solo Venture Score</em> doesn't.
        </motion.p>
      </section>

      {/* Scoring model */}
      <section id="scoring-model" className="max-w-4xl mx-auto px-6 py-16 border-t border-border scroll-mt-20">
        <motion.div {...fadeUp()} className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">How this is scored</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            The scoring model, plainly
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Every row starts with five research-stage fields captured for every prediction in the
            corpus, whether or not it goes anywhere:
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.05)} className="space-y-4 mb-10">
          {SCORING_FIELDS.map((f) => (
            <div key={f.name} className="flex gap-4">
              <div className="w-44 shrink-0 text-sm font-semibold text-text-primary">{f.name}</div>
              <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="mb-8">
          <h3 className="font-serif text-xl font-bold text-text-primary mb-3">The first filter</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            A row only gets full venture scoring if <strong className="text-text-primary">Real-World
            Status</strong> is "Exists Today" or "Emerging / Prototype" <strong className="text-text-primary">and</strong> <strong className="text-text-primary">AI
            Enables Tech</strong> is 7 or higher. Everything else — purely theoretical, or something AI
            doesn't meaningfully change — is marked Park and scored no further. Of {' '}
            {(1002).toLocaleString()} technologies, 223 passed this filter.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="mb-8">
          <h3 className="font-serif text-xl font-bold text-text-primary mb-3">Venture fields — for survivors only</h3>
          <div className="space-y-4">
            {VENTURE_FIELDS.map((f) => (
              <div key={f.name} className="flex gap-4">
                <div className="w-44 shrink-0 text-sm font-semibold text-text-primary">{f.name}</div>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="rounded-xl border-l-4 border-l-accent border border-border p-6" style={{ background: '#1a2235' }}>
          <h3 className="font-serif text-xl font-bold text-text-primary mb-3">Solo Venture Score — the number that actually ranks Bucket B</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Only rows verdicted <strong className="text-text-primary">Solo-AI</strong> score above zero here.
            Everything Transformational, Park, or Neither is zero by design — this metric exists to
            rank the target bucket, not to re-litigate what already got excluded from it.
          </p>
          <ul className="text-sm text-text-secondary space-y-1.5 font-mono">
            <li>+ Solo Buildable × 10 <span className="text-text-secondary/50">(the heaviest single input)</span></li>
            <li>+ Capital to MVP, inverted <span className="text-text-secondary/50">(cheaper scores higher: 30 / 21 / 12 / 0)</span></li>
            <li>+ Time to MVP, inverted <span className="text-text-secondary/50">(faster scores higher: 20 / 16 / 8 / 0)</span></li>
            <li>+ AI Enables Tech + Benefit Score <span className="text-text-secondary/50">(tie-breakers, ≤10 each)</span></li>
            <li>− Incumbent Risk penalty <span className="text-text-secondary/50">(Medium −15, High −45)</span></li>
            <li>− 25 if Weak Provenance is flagged</li>
            <li>− Industry Investment Level <span className="text-text-secondary/50">(never rewarded — more industry money in, more points off)</span></li>
            <li className="pt-1 text-text-primary">× 0.05 <span className="text-text-secondary/50">if Incumbent Risk is Owned — pushes owned wedges toward zero without a tied floor</span></li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            An honest note that shapes the shortlist below: hardening Incumbent Risk against actually
            named, funded competitors pushed 87% of the 102 Solo-AI rows to High or Owned. This
            candidate pool is weaker than it first looked — which is exactly why it's published in
            full rather than trimmed to look better.
          </p>
        </motion.div>
      </section>

      {/* Shortlist */}
      {data && data.rows.length > 0 && (
        <ShortlistSection
          rows={data.rows}
          onSelect={selectRow}
          onViewAll={() => scrollToExplorer('Solo-AI')}
        />
      )}

      {/* Fiction-to-reality timeline */}
      {data && data.rows.length > 0 && (
        <TimelineSection rows={data.rows} onSelect={selectRow} />
      )}

      {/* Browse by show */}
      {data && data.rows.length > 0 && (
        <BrowseByShowSection rows={data.rows} onSelectSeries={scrollToExplorerForSeries} />
      )}

      {/* Explorer */}
      {data && data.rows.length > 0 && (
        <ExplorerSection
          rows={data.rows}
          onSelect={selectRow}
          initialVerdict={explorerVerdict}
          initialSeries={explorerSeries}
        />
      )}
      </main>

      <footer className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <p className="text-xs text-text-secondary/50 leading-relaxed max-w-xl mx-auto">
            Read-only v1. Every candidate, score, and wedge on this page is published as captured —
            nothing is withheld or redacted. No candidate here has cleared a wedge test; this is a
            screening pass, not a roadmap.
          </p>
          <Link to="/" className="inline-block mt-6 text-sm text-text-secondary/60 hover:text-accent transition-colors">
            ← Back to krispyking.com
          </Link>
        </div>
      </footer>
    </div>
  )
}
