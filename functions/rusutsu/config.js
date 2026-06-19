export async function onRequest({ env }) {
  const token = env.MAPBOX_TOKEN || ''
  return new Response(`window.MAPBOX_TOKEN='${token}';`, {
    headers: { 'Content-Type': 'application/javascript' }
  })
}
