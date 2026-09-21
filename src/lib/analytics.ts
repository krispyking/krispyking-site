// Fire-and-forget beacon to functions/futuretech/api/event.js. Never throws,
// never blocks rendering, never retries — a dropped event is fine, a
// blocked page is not. See that function for what is (and isn't) recorded.
export function trackEvent(event: string): void {
  try {
    fetch('/futuretech/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // no-op
  }
}
