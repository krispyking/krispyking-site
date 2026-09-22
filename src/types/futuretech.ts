export interface FutureTechScores {
  benefit: number | null
  easeOfBuilding: number | null
  aiEnablesTech: number | null
  roi: number | null
  composite: number | null
  soloVenture: number | null
}

export interface FutureTechVenture {
  soloBuildable: number | null
  capitalToMVP: string | null
  timeToMVP: string | null
  wedge: string
  whoPays: string
  incumbentRisk: string | null
  verdict: string | null
}

export interface FutureTechRow {
  id: string
  url: string
  technology: string
  source: string | null
  seriesFranchise: string
  season: string
  episodeNumber: string
  episodeWork: string
  episodeAppearances: string
  purpose: string
  realWorldBenefit: string
  realWorldStatus: string | null
  howItCouldBeBuilt: string
  // CK-6541 origin-enrichment fields — populated for the 223 scored rows
  // (Verdict Solo-AI / Transformational / Neither); null/empty on Park rows.
  scene: string
  airDate: string | null
  yearsToReality: number | null
  investmentLevel: string | null
  investmentNote: string
  scores: FutureTechScores
  venture: FutureTechVenture
  // CK-6390 archetype fields — may be absent/null on rows the archetype
  // re-rank hasn't reached yet, or before CK-6390 lands at all.
  archetype: string | null
  archetypePrimary: boolean
  namedIncumbents: string
  weakProvenance: boolean
}

export interface FutureTechExport {
  generatedAt: string
  rowCount: number
  rows: FutureTechRow[]
}
