import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Publishable (anon) key only — this file ships to the browser. The anon role can
// INSERT into wog_votes but has no SELECT grant (see supabase/migrations), so a vote
// can be cast from here but never read back; tallies are served server-side only,
// via functions/gentleman-results.js using the service-role key, which never reaches
// the client.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

// CK-5875 staging note: no Supabase project has been provisioned for this table yet
// (this session's Supabase access is read-only — no create_project/execute_sql tool
// available to it). Until VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are set in the
// Cloudflare Pages build environment, `supabase` is null and the ballot form shows a
// "not yet connected" state instead of crashing. See supabase/migrations/0001_wog_votes.sql
// for the schema to apply once a project exists.
export const supabaseConfigured = supabase !== null
