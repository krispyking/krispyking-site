import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FutureTechRow } from '../../types/futuretech'
import { formatScore, INCUMBENT_RISK_STYLES, VERDICT_STYLES } from '../../lib/futuretech'

interface Props {
  row: FutureTechRow | null
  onClose: () => void
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === '') return null
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary/70 mb-1">{label}</p>
      <p className="text-sm text-text-primary leading-relaxed">{value}</p>
    </div>
  )
}

function ScoreCell({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg border border-border bg-bg-primary px-3 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-text-secondary/70 mb-0.5">{label}</p>
      <p className="font-serif text-lg font-bold text-text-primary">{formatScore(value)}</p>
    </div>
  )
}

export default function DetailDrawer({ row, onClose }: Props) {
  useEffect(() => {
    if (!row) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [row, onClose])

  return (
    <AnimatePresence>
      {row && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={row.technology}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-[61] max-h-[88vh] overflow-y-auto rounded-t-2xl border-t border-border bg-bg-secondary p-6 sm:inset-x-auto sm:right-6 sm:left-6 sm:top-10 sm:bottom-10 sm:rounded-2xl sm:border sm:max-w-2xl sm:mx-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-text-primary">{row.technology}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  {row.seriesFranchise}
                  {row.season && ` · Season ${row.season}`}
                  {row.episodeNumber && ` · Ep. ${row.episodeNumber}`}
                  {row.episodeWork && ` · "${row.episodeWork}"`}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-full border border-border h-8 w-8 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/50 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {row.venture.verdict && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${VERDICT_STYLES[row.venture.verdict] || ''}`}>
                  {row.venture.verdict}
                </span>
              )}
              {row.archetype && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-border text-text-secondary">
                  {row.archetype}
                  {row.archetypePrimary && ' · primary'}
                </span>
              )}
              {row.weakProvenance && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-orange-500/30 text-orange-400">
                  Weak provenance
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
              <ScoreCell label="Benefit" value={row.scores.benefit} />
              <ScoreCell label="Ease" value={row.scores.easeOfBuilding} />
              <ScoreCell label="AI Enables" value={row.scores.aiEnablesTech} />
              <ScoreCell label="ROI" value={row.scores.roi} />
              <ScoreCell label="Composite" value={row.scores.composite} />
              <ScoreCell label="Solo Venture" value={row.scores.soloVenture} />
            </div>

            <div className="space-y-5">
              <Field label="Purpose (in the fiction)" value={row.purpose} />
              <Field label="Real-world benefit" value={row.realWorldBenefit} />
              <Field label="Real-world status" value={row.realWorldStatus} />
              <Field label="How it could be built" value={row.howItCouldBeBuilt} />
              {row.episodeAppearances && <Field label="Episode appearances" value={row.episodeAppearances} />}

              {(row.venture.wedge || row.venture.whoPays) && (
                <div className="rounded-xl border border-accent/25 bg-accent/5 p-4 space-y-3">
                  <Field label="The wedge" value={row.venture.wedge} />
                  <Field label="Who pays" value={row.venture.whoPays} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Solo buildable (1–10)" value={row.venture.soloBuildable} />
                    <Field
                      label="Incumbent risk"
                      value={
                        row.venture.incumbentRisk
                          ? row.venture.incumbentRisk
                          : null
                      }
                    />
                    <Field label="Capital to MVP" value={row.venture.capitalToMVP} />
                    <Field label="Time to MVP" value={row.venture.timeToMVP} />
                  </div>
                  {row.namedIncumbents && <Field label="Named incumbents" value={row.namedIncumbents} />}
                  {row.venture.incumbentRisk && (
                    <p className={`text-xs ${INCUMBENT_RISK_STYLES[row.venture.incumbentRisk] || ''}`}>
                      {row.venture.incumbentRisk} incumbent risk
                    </p>
                  )}
                </div>
              )}

              <Field label="Industry investment level" value={row.investmentLevel} />
              <Field label="Investment note" value={row.investmentNote} />
            </div>

            <a
              href={row.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 text-xs text-text-secondary/60 hover:text-accent transition-colors"
            >
              Source row in Notion ↗
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
