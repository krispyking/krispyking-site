import type { FutureTechRow } from '../types/futuretech'

export const VERDICT_STYLES: Record<string, string> = {
  'Solo-AI': 'bg-accent/15 text-accent border-accent/30',
  Transformational: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  Neither: 'bg-text-secondary/10 text-text-secondary border-border',
  Park: 'bg-text-secondary/5 text-text-secondary/70 border-border',
}

export const INCUMBENT_RISK_STYLES: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-orange-400',
  Owned: 'text-red-400',
}

export function formatScore(n: number | null): string {
  if (n == null) return '—'
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}

export function slugify(technology: string): string {
  return technology
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

export function uniqueSorted(rows: FutureTechRow[], pick: (r: FutureTechRow) => string | null): string[] {
  const set = new Set<string>()
  for (const r of rows) {
    const v = pick(r)
    if (v) set.add(v)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

// Solo Venture Score formula (CK-6390, applies only to Verdict = "Solo-AI"
// rows — every other row scores 0). Documented here as constants, not a
// reimplementation the page depends on: the export always carries the real
// value computed by Notion's own formula engine at export time. This is
// used only to render the "how it's calculated" explainer legibly.
export const CAPITAL_TO_MVP_POINTS: Record<string, number> = {
  '<$1k': 30,
  '$1-5k': 21,
  '$5-25k': 12,
  '>$25k': 0,
}
export const TIME_TO_MVP_POINTS: Record<string, number> = {
  Days: 20,
  Weeks: 16,
  Months: 8,
  Years: 0,
}
export const INCUMBENT_RISK_PENALTY: Record<string, number> = {
  Low: 0,
  Medium: 15,
  High: 45,
  Owned: 0, // handled separately: the whole score is multiplied by 0.05 when Owned
}
export const INDUSTRY_INVESTMENT_PENALTY: Record<string, number> = {
  None: 2,
  Low: 5,
  Moderate: 10,
  High: 15,
  'Very High': 20,
}
