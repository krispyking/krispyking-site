import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { FutureTechRow } from '../../types/futuretech'
import { formatScore, uniqueSorted, VERDICT_STYLES } from '../../lib/futuretech'

interface Props {
  rows: FutureTechRow[]
  onSelect: (row: FutureTechRow) => void
  initialVerdict?: string
}

type SortKey = 'technology' | 'soloVenture' | 'composite' | 'benefit' | 'aiEnablesTech' | 'roi' | 'easeOfBuilding'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'soloVenture', label: 'Solo Venture Score' },
  { key: 'composite', label: 'Composite Score' },
  { key: 'benefit', label: 'Benefit' },
  { key: 'aiEnablesTech', label: 'AI Enables Tech' },
  { key: 'roi', label: 'ROI' },
  { key: 'easeOfBuilding', label: 'Ease of Building' },
  { key: 'technology', label: 'Technology (A–Z)' },
]

const PAGE_SIZE = 25
const ALL = 'All'

function scoreOf(row: FutureTechRow, key: SortKey): number {
  if (key === 'technology') return 0
  return row.scores[key] ?? -Infinity
}

export default function ExplorerSection({ rows, onSelect, initialVerdict }: Props) {
  const [search, setSearch] = useState('')
  const [verdict, setVerdict] = useState<string>(initialVerdict || ALL)
  const [status, setStatus] = useState<string>(ALL)
  const [series, setSeries] = useState<string>(ALL)
  const [archetype, setArchetype] = useState<string>(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('soloVenture')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (initialVerdict) setVerdict(initialVerdict)
  }, [initialVerdict])

  const verdictOptions = useMemo(() => uniqueSorted(rows, (r) => r.venture.verdict), [rows])
  const statusOptions = useMemo(() => uniqueSorted(rows, (r) => r.realWorldStatus), [rows])
  const seriesOptions = useMemo(() => uniqueSorted(rows, (r) => r.seriesFranchise || null), [rows])
  const archetypeOptions = useMemo(() => uniqueSorted(rows, (r) => r.archetype), [rows])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (verdict !== ALL && r.venture.verdict !== verdict) return false
      if (status !== ALL && r.realWorldStatus !== status) return false
      if (series !== ALL && r.seriesFranchise !== series) return false
      if (archetype !== ALL && r.archetype !== archetype) return false
      if (q) {
        const hay = `${r.technology} ${r.venture.wedge}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [rows, search, verdict, status, series, archetype])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      if (sortKey === 'technology') {
        const cmp = a.technology.localeCompare(b.technology)
        return sortDir === 'asc' ? cmp : -cmp
      }
      const cmp = scoreOf(a, sortKey) - scoreOf(b, sortKey)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [filtered, sortKey, sortDir])

  // Reset to page 1 whenever the filtered/sorted set changes shape.
  useEffect(() => {
    setPage(1)
  }, [search, verdict, status, series, archetype, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, pageCount)
  const pageRows = sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const selectClass =
    'rounded-lg border border-border bg-bg-primary text-text-primary text-sm px-3 py-2 focus:outline-none focus:border-accent/60'

  return (
    <section id="explorer" className="max-w-6xl mx-auto px-6 py-16 border-t border-border scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">The full corpus</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Every prediction, explorable
        </h2>
        <p className="text-text-secondary leading-relaxed max-w-2xl">
          All {rows.length.toLocaleString()} rows — Transformational, Solo-AI, Neither, and Park alike.
          Nothing here is hidden or pre-filtered for you.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technology or wedge…"
          className="w-full rounded-lg border border-border bg-bg-primary text-text-primary text-sm px-4 py-2.5 focus:outline-none focus:border-accent/60"
        />
        <div className="flex flex-wrap gap-2">
          <select className={selectClass} value={verdict} onChange={(e) => setVerdict(e.target.value)}>
            <option value={ALL}>All verdicts</option>
            {verdictOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value={ALL}>All real-world statuses</option>
            {statusOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select className={selectClass} value={series} onChange={(e) => setSeries(e.target.value)}>
            <option value={ALL}>All series / franchises</option>
            {seriesOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select className={selectClass} value={archetype} onChange={(e) => setArchetype(e.target.value)}>
            <option value={ALL}>All archetypes</option>
            {archetypeOptions.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-text-secondary mb-4">
        {sorted.length.toLocaleString()} match{sorted.length === 1 ? '' : 'es'} · sorted by{' '}
        {SORT_OPTIONS.find((o) => o.key === sortKey)?.label} ({sortDir === 'desc' ? 'high → low' : 'low → high'})
      </p>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-card/60 text-left">
              <th className="px-4 py-3 font-semibold text-text-secondary">Technology</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Verdict</th>
              {SORT_OPTIONS.filter((o) => o.key !== 'technology').map((o) => (
                <th key={o.key} className="px-3 py-3 font-semibold text-text-secondary text-right">
                  <button
                    onClick={() => toggleSort(o.key)}
                    className={`hover:text-accent transition-colors ${sortKey === o.key ? 'text-accent' : ''}`}
                  >
                    {o.label.replace(' Score', '')}
                    {sortKey === o.key && (sortDir === 'desc' ? ' ↓' : ' ↑')}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr
                key={r.id}
                onClick={() => onSelect(r)}
                className="border-b border-border/60 last:border-0 hover:bg-bg-card/40 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-text-primary font-medium max-w-xs truncate">{r.technology}</td>
                <td className="px-4 py-3">
                  {r.venture.verdict && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${VERDICT_STYLES[r.venture.verdict] || ''}`}>
                      {r.venture.verdict}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-right text-text-secondary">{formatScore(r.scores.soloVenture)}</td>
                <td className="px-3 py-3 text-right text-text-secondary">{formatScore(r.scores.composite)}</td>
                <td className="px-3 py-3 text-right text-text-secondary">{formatScore(r.scores.benefit)}</td>
                <td className="px-3 py-3 text-right text-text-secondary">{formatScore(r.scores.aiEnablesTech)}</td>
                <td className="px-3 py-3 text-right text-text-secondary">{formatScore(r.scores.roi)}</td>
                <td className="px-3 py-3 text-right text-text-secondary">{formatScore(r.scores.easeOfBuilding)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {pageRows.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="w-full text-left rounded-xl border border-border bg-bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <p className="font-medium text-text-primary text-sm">{r.technology}</p>
              <span className="shrink-0 text-sm font-serif font-bold text-text-primary">
                {formatScore(r.scores.soloVenture)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {r.venture.verdict && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${VERDICT_STYLES[r.venture.verdict] || ''}`}>
                  {r.venture.verdict}
                </span>
              )}
              <span className="text-xs text-text-secondary">{r.seriesFranchise}</span>
            </div>
          </button>
        ))}
      </div>

      {pageRows.length === 0 && (
        <p className="text-center text-text-secondary py-12">No technologies match these filters.</p>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={clampedPage <= 1}
            className="px-3 py-1.5 rounded-lg border border-border text-text-secondary disabled:opacity-30 hover:text-accent hover:border-accent/50 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-text-secondary">
            Page {clampedPage} of {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={clampedPage >= pageCount}
            className="px-3 py-1.5 rounded-lg border border-border text-text-secondary disabled:opacity-30 hover:text-accent hover:border-accent/50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  )
}
