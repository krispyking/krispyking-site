import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { FutureTechRow } from '../../types/futuretech'
import { airYear, seriesDisplayName } from '../../lib/futuretech'

interface Props {
  rows: FutureTechRow[]
  onSelectSeries: (series: string) => void
}

interface ShowGroup {
  series: string
  displayName: string
  count: number
  firstYear: number | null
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.4, delay },
  }
}

export default function BrowseByShowSection({ rows, onSelectSeries }: Props) {
  const shows = useMemo(() => {
    const bySeries = new Map<string, ShowGroup>()
    for (const r of rows) {
      const key = r.seriesFranchise || 'Unknown'
      const year = airYear(r.airDate)
      const existing = bySeries.get(key)
      if (existing) {
        existing.count += 1
        if (year != null && (existing.firstYear == null || year < existing.firstYear)) {
          existing.firstYear = year
        }
      } else {
        bySeries.set(key, {
          series: key,
          displayName: seriesDisplayName(key),
          count: 1,
          firstYear: year,
        })
      }
    }
    return Array.from(bySeries.values()).sort((a, b) => {
      if (a.firstYear == null && b.firstYear == null) return a.displayName.localeCompare(b.displayName)
      if (a.firstYear == null) return 1
      if (b.firstYear == null) return -1
      return a.firstYear - b.firstYear
    })
  }, [rows])

  return (
    <section id="browse-by-show" className="max-w-5xl mx-auto px-6 py-16 border-t border-border scroll-mt-20">
      <motion.div {...fadeUp()} className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Browse by show</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          A history of imagined futures
        </h2>
        <p className="text-text-secondary leading-relaxed max-w-2xl">
          The same corpus, grouped by the show or film it came from and ordered by when that source
          first started predicting things — oldest first.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {shows.map((s, i) => (
          <motion.button
            key={s.series}
            {...fadeUp(0.02 * i)}
            onClick={() => onSelectSeries(s.series)}
            className="text-left rounded-xl border border-border bg-bg-card p-4 hover:border-accent/50 transition-colors group"
          >
            <p className="font-serif text-base font-bold text-text-primary group-hover:text-accent transition-colors mb-1">
              {s.displayName}
            </p>
            <p className="text-xs text-text-secondary">
              {s.count.toLocaleString()} technolog{s.count === 1 ? 'y' : 'ies'}
              {s.firstYear && ` · since ${s.firstYear}`}
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
