import type { FutureTechRow } from '../types/futuretech'

// CK-6541: full series names, replacing the cryptic abbreviations the
// source database stores in "Series / Franchise" for Star Trek rows.
// Cross-franchise rows already carry a full title in that field and pass
// through unchanged.
export const SERIES_NAMES: Record<string, string> = {
  TOS: 'Star Trek: The Original Series',
  TAS: 'Star Trek: The Animated Series',
  TNG: 'Star Trek: The Next Generation',
  DS9: 'Star Trek: Deep Space Nine',
  VOY: 'Star Trek: Voyager',
  ENT: 'Star Trek: Enterprise',
  DIS: 'Star Trek: Discovery',
  PIC: 'Star Trek: Picard',
  LOW: 'Star Trek: Lower Decks',
  PRO: 'Star Trek: Prodigy',
  SNW: 'Star Trek: Strange New Worlds',
}

export function seriesDisplayName(seriesFranchise: string | null | undefined): string {
  if (!seriesFranchise) return ''
  return SERIES_NAMES[seriesFranchise] || seriesFranchise
}

export function airYear(airDate: string | null): number | null {
  if (!airDate) return null
  const y = new Date(airDate).getUTCFullYear()
  return Number.isNaN(y) ? null : y
}

export function formatAirDate(airDate: string | null): string | null {
  if (!airDate) return null
  const d = new Date(airDate)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

// Is this row a dated TV episode (has a season) or a film/standalone work
// (season is blank and episodeNumber/episodeWork carry the release year and
// title instead)? This distinction is what the old UI got wrong, rendering
// a film's release year as a fake "Season".
export function isEpisodic(row: FutureTechRow): boolean {
  return Boolean(row.season && row.season.trim())
}

// The origin strip every card/row leads with, e.g.:
//   "Star Trek: Deep Space Nine · S6 E2 · "Rocks and Shoals" · 1997"
//   "Blade Runner 2049 · Film · 2017"
export function formatOrigin(row: FutureTechRow): string {
  const year = airYear(row.airDate)
  if (isEpisodic(row)) {
    const parts = [seriesDisplayName(row.seriesFranchise)]
    const seasonEp = row.episodeNumber ? `S${row.season} E${row.episodeNumber}` : `S${row.season}`
    parts.push(seasonEp)
    if (row.episodeWork) parts.push(`"${row.episodeWork}"`)
    if (year) parts.push(String(year))
    return parts.filter(Boolean).join(' · ')
  }
  const title = row.episodeWork || seriesDisplayName(row.seriesFranchise) || row.seriesFranchise
  const parts = [title, 'Film']
  if (year) parts.push(String(year))
  return parts.filter(Boolean).join(' · ')
}

// Outbound reference link for the origin — Memory Alpha for Star Trek rows,
// Wikipedia for everything else. Never a still, poster, or logo — just a
// link out. Returns null when there's nothing sensible to link (no title).
export function referenceLink(row: FutureTechRow): { label: string; url: string } | null {
  const title = row.episodeWork || (isEpisodic(row) ? '' : row.seriesFranchise)
  if (!title) return null
  const slug = title.trim().replace(/\s+/g, '_')
  if (row.source === 'Star Trek') {
    return { label: 'Memory Alpha', url: `https://memory-alpha.fandom.com/wiki/${encodeURIComponent(slug)}` }
  }
  return { label: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(slug)}` }
}

// Where-to-watch search link — a search query, never a claim about
// availability on a specific service.
export function whereToWatchLink(row: FutureTechRow): string {
  const q = row.episodeWork || row.seriesFranchise || row.technology
  return `https://www.justwatch.com/us/search?q=${encodeURIComponent(q)}`
}

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
