import { useEffect, useState } from 'react'
import type { FutureTechExport } from '../types/futuretech'
// `?url` keeps this ~1.3MB file OUT of the JS bundle entirely — Vite emits
// it as a hashed static asset and hands back its URL, so it's fetched lazily
// at runtime instead of being parsed/executed as part of the page's script.
import dataUrl from '../data/futuretech.json?url'

interface State {
  data: FutureTechExport | null
  error: string | null
  loading: boolean
}

export function useFutureTechData(): State {
  const [data, setData] = useState<FutureTechExport | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`futuretech data fetch failed: HTTP ${res.status}`)
        return res.json() as Promise<FutureTechExport>
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, error, loading: !data && !error }
}
