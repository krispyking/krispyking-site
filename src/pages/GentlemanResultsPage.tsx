import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

// /gentleman/results — CK-5875 criterion 5: "gated to Chris (simple token) showing
// tallies". The token travels as a query param (?token=...) and is checked server-side
// by functions/api/gentleman-results.js against the RESULTS_TOKEN secret; this page
// never sees or needs the Supabase keys itself.

const LABELS: Record<string, string> = {
  act1_chapter: 'Act 1 chapter',
  full_film: 'The full film',
  documentary_first: 'Documentary first',
  the_ride: 'The ride',
  stop_here: 'Stop here',
}

type Results = { total: number; tallies: Record<string, number>; latest: string | null }

export default function GentlemanResultsPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [data, setData] = useState<Results | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Missing token')
      return
    }
    fetch(`/api/gentleman-results?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || `HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((e) => setError(String(e.message || e)))
  }, [token])

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-serif px-6 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">The Word of a Gentleman — results</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!error && !data && <p className="text-text-secondary text-sm">Loading…</p>}
        {data && (
          <>
            <p className="text-text-secondary text-sm mb-4">
              {data.total} response{data.total === 1 ? '' : 's'}
              {data.latest ? ` · latest ${new Date(data.latest).toLocaleString()}` : ''}
            </p>
            <ul className="space-y-2">
              {Object.entries(data.tallies).map(([key, count]) => (
                <li
                  key={key}
                  className="flex justify-between border border-border rounded-lg px-4 py-2"
                >
                  <span>{LABELS[key] || key}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}
