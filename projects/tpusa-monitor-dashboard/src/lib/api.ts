import { supabase } from './supabase'
import type { Sweep, FlaggedPost } from './types'

/**
 * Fetch the most recent sweep.
 * Returns null if no sweeps exist yet.
 */
export async function getLatestSweep(): Promise<Sweep | null> {
  const { data, error } = await supabase
    .from('sweeps')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch latest sweep: ${error.message}`)
  }

  return data
}

/**
 * Fetch sweep history ordered by most recent first.
 * @param limit - Maximum number of sweeps to return (default 20)
 */
export async function getSweepHistory(limit = 20): Promise<Sweep[]> {
  const { data, error } = await supabase
    .from('sweeps')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch sweep history: ${error.message}`)
  }

  return data ?? []
}

/**
 * Fetch all flagged posts for a specific sweep.
 * @param sweepId - The sweep ID to filter by
 */
export async function getFlaggedPosts(sweepId: string): Promise<FlaggedPost[]> {
  const { data, error } = await supabase
    .from('flagged_posts')
    .select('*')
    .eq('sweep_id', sweepId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch flagged posts: ${error.message}`)
  }

  return data ?? []
}

/**
 * Subscribe to new sweep inserts via Supabase Realtime.
 * @param callback - Called with each new sweep as it arrives
 * @returns Unsubscribe function to tear down the channel
 */
export function subscribeToNewSweeps(
  callback: (sweep: Sweep) => void
): () => void {
  const channel = supabase
    .channel('new-sweeps')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sweeps' },
      (payload) => {
        callback(payload.new as Sweep)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
