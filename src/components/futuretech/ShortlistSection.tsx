import { motion } from 'framer-motion'
import type { FutureTechRow } from '../../types/futuretech'
import { formatScore, formatOrigin, INCUMBENT_RISK_STYLES } from '../../lib/futuretech'

interface Props {
  rows: FutureTechRow[]
  onSelect: (row: FutureTechRow) => void
  onViewAll: () => void
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.4, delay },
  }
}

export default function ShortlistSection({ rows, onSelect, onViewAll }: Props) {
  const soloAiRows = rows.filter((r) => r.venture.verdict === 'Solo-AI')
  const primaries = soloAiRows
    .filter((r) => r.archetypePrimary)
    .sort((a, b) => (b.scores.soloVenture ?? -Infinity) - (a.scores.soloVenture ?? -Infinity))

  return (
    <section id="shortlist" className="max-w-5xl mx-auto px-6 py-16 border-t border-border scroll-mt-20">
      <motion.div {...fadeUp()} className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Bucket B</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          The Solo-AI shortlist
        </h2>
        <p className="text-text-secondary leading-relaxed max-w-2xl">
          One representative per business archetype — the sharpest wedge and most specific buyer
          among that archetype's non-owned members, ranked by Solo Venture Score. This is the
          candidate pool, not a promise: most of it scores High or Owned on incumbent risk (see
          the scoring model above), and none of it has cleared a wedge test yet.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {primaries.map((row, i) => (
          <motion.button
            key={row.id}
            {...fadeUp(0.03 * i)}
            onClick={() => onSelect(row)}
            className="text-left rounded-xl border border-border bg-bg-card p-5 hover:border-accent/50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{row.archetype}</p>
              <span className="shrink-0 font-serif text-xl font-bold text-text-primary">
                {formatScore(row.scores.soloVenture)}
              </span>
            </div>
            {formatOrigin(row) && (
              <p className="text-xs text-text-secondary/80 mb-1.5">{formatOrigin(row)}</p>
            )}
            <h3 className="font-serif text-lg font-bold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
              {row.technology}
            </h3>
            {row.venture.wedge && (
              <p className="text-sm text-text-secondary leading-relaxed mb-2">{row.venture.wedge}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
              {row.venture.whoPays && <span>Pays: {row.venture.whoPays}</span>}
              {row.venture.incumbentRisk && (
                <span className={INCUMBENT_RISK_STYLES[row.venture.incumbentRisk] || ''}>
                  {row.venture.incumbentRisk} incumbent risk
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div {...fadeUp(0.1)} className="mt-8">
        <button
          onClick={onViewAll}
          className="text-sm text-accent hover:text-accent-soft transition-colors font-medium"
        >
          See all {soloAiRows.length} Solo-AI candidates in the full corpus →
        </button>
      </motion.div>
    </section>
  )
}
