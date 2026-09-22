import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { FutureTechRow } from '../../types/futuretech'
import { airYear, formatOrigin } from '../../lib/futuretech'

interface Props {
  rows: FutureTechRow[]
  onSelect: (row: FutureTechRow) => void
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.4, delay },
  }
}

const WIDTH = 1000
const HEIGHT = 360
const MARGIN = { top: 20, right: 24, bottom: 40, left: 24 }
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right

// Two swimlanes: technologies that exist today (the emotional payoff) sit in
// the upper lane; everything still fictional sits in the lower lane. Same
// x-axis (air year) for both, so a 1966 idea and its real-world arrival read
// as one continuous timeline rather than two disconnected charts.
const LANE_EXISTS = { top: MARGIN.top, bottom: 150 }
const LANE_OTHER = { top: 170, bottom: HEIGHT - MARGIN.bottom }

const DOT_R_EXISTS = 4.5
const DOT_R_OTHER = 2.75
const DOT_SPACING = 8

export default function TimelineSection({ rows, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const dated = useMemo(
    () => rows.map((r) => ({ row: r, year: airYear(r.airDate) })).filter((d): d is { row: FutureTechRow; year: number } => d.year != null),
    [rows]
  )

  const currentYear = new Date().getUTCFullYear()

  const { minYear, maxYear } = useMemo(() => {
    const years = dated.map((d) => d.year)
    return {
      minYear: Math.min(...years, currentYear),
      maxYear: Math.max(...years, currentYear),
    }
  }, [dated, currentYear])

  const xForYear = (y: number) => {
    const span = maxYear - minYear || 1
    return MARGIN.left + ((y - minYear) / span) * PLOT_W
  }

  const points = useMemo(() => {
    const existsBuckets = new Map<number, typeof dated>()
    const otherBuckets = new Map<number, typeof dated>()
    for (const d of dated) {
      const exists = d.row.realWorldStatus === 'Exists Today'
      const bucket = exists ? existsBuckets : otherBuckets
      const arr = bucket.get(d.year) || []
      arr.push(d)
      bucket.set(d.year, arr)
    }

    function layout(buckets: Map<number, typeof dated>, lane: { top: number; bottom: number }, radius: number) {
      const centerY = (lane.top + lane.bottom) / 2
      const out: { row: FutureTechRow; year: number; x: number; y: number; radius: number; exists: boolean }[] = []
      for (const [year, items] of buckets) {
        items.forEach((d, i) => {
          const offset = (i - (items.length - 1) / 2) * DOT_SPACING
          out.push({
            row: d.row,
            year,
            x: xForYear(year),
            y: Math.max(lane.top + radius, Math.min(lane.bottom - radius, centerY + offset)),
            radius,
            exists: lane === LANE_EXISTS,
          })
        })
      }
      return out
    }

    return [
      ...layout(existsBuckets, LANE_EXISTS, DOT_R_EXISTS),
      ...layout(otherBuckets, LANE_OTHER, DOT_R_OTHER),
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dated, minYear, maxYear])

  const yearTicks = useMemo(() => {
    const ticks: number[] = []
    const span = maxYear - minYear
    const step = span > 60 ? 10 : span > 20 ? 5 : 2
    const start = Math.ceil(minYear / step) * step
    for (let y = start; y <= maxYear; y += step) ticks.push(y)
    if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear)
    return ticks
  }, [minYear, maxYear])

  const hoveredRow = hovered ? dated.find((d) => d.row.id === hovered)?.row : null

  return (
    <section id="timeline" className="max-w-6xl mx-auto px-6 py-16 border-t border-border scroll-mt-20">
      <motion.div {...fadeUp()} className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Fiction → reality</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          The 1966 idea next to the thing in your pocket
        </h2>
        <p className="text-text-secondary leading-relaxed max-w-2xl">
          Every scored prediction, plotted by the year it aired or released. The highlighted dots in
          the upper band are the ones that already exist today — hover one to see how long it took.
        </p>
      </motion.div>

      <motion.div {...fadeUp(0.05)} className="rounded-xl border border-border bg-bg-card p-4">
        <div className="flex items-center gap-4 mb-2 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            Exists today
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-text-secondary/60" aria-hidden="true" />
            Still fiction
          </span>
        </div>

        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="Timeline of scored technologies by air year, with technologies that exist today highlighted"
        >
          {/* Lane divider */}
          <line
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={(LANE_EXISTS.bottom + LANE_OTHER.top) / 2}
            y2={(LANE_EXISTS.bottom + LANE_OTHER.top) / 2}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* X axis */}
          <line
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={HEIGHT - MARGIN.bottom}
            y2={HEIGHT - MARGIN.bottom}
            className="stroke-border"
            strokeWidth={1}
          />
          {yearTicks.map((y) => (
            <g key={y}>
              <line
                x1={xForYear(y)}
                x2={xForYear(y)}
                y1={MARGIN.top}
                y2={HEIGHT - MARGIN.bottom}
                className="stroke-border"
                strokeWidth={1}
                opacity={0.35}
              />
              <text
                x={xForYear(y)}
                y={HEIGHT - MARGIN.bottom + 20}
                textAnchor="middle"
                className="fill-text-secondary text-[11px]"
              >
                {y}
              </text>
            </g>
          ))}

          {/* Today marker */}
          <line
            x1={xForYear(currentYear)}
            x2={xForYear(currentYear)}
            y1={MARGIN.top}
            y2={HEIGHT - MARGIN.bottom}
            className="stroke-accent"
            strokeWidth={1.5}
            opacity={0.6}
          />
          <text
            x={xForYear(currentYear)}
            y={MARGIN.top - 6}
            textAnchor="middle"
            className="fill-accent text-[10px] font-semibold"
          >
            Today
          </text>

          {/* Dots */}
          {points.map((p) => (
            <circle
              key={p.row.id}
              cx={p.x}
              cy={p.y}
              r={hovered === p.row.id ? p.radius + 1.5 : p.radius}
              className={p.exists ? 'fill-accent cursor-pointer' : 'fill-text-secondary/50 cursor-pointer'}
              onMouseEnter={() => setHovered(p.row.id)}
              onMouseLeave={() => setHovered((h) => (h === p.row.id ? null : h))}
              onClick={() => onSelect(p.row)}
              tabIndex={0}
              role="button"
              aria-label={`${p.row.technology}, ${p.year}`}
            />
          ))}
        </svg>

        <div className="h-12 mt-1 text-xs text-text-secondary">
          {hoveredRow && (
            <div>
              <p className="text-text-primary font-medium">{hoveredRow.technology}</p>
              <p>
                {formatOrigin(hoveredRow)}
                {hoveredRow.yearsToReality != null && (
                  <span className="text-accent"> · {hoveredRow.yearsToReality} years to reality</span>
                )}
              </p>
            </div>
          )}
          {!hoveredRow && <p className="text-text-secondary/50">Hover or tap a dot for details.</p>}
        </div>
      </motion.div>
    </section>
  )
}
