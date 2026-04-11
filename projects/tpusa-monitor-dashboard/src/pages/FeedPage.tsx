import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { SweepNode } from '../components/SweepNode'
import { EventItem } from '../components/EventItem'
import { MoreIndicator } from '../components/MoreIndicator'
import { SkeletonFeed } from '../components/SkeletonFeed'
import { Toast } from '../components/Toast'
import { FAB } from '../components/FAB'
import { BottomNav } from '../components/BottomNav'
import { IS_MOCK_MODE } from '../lib/supabase'
import { getLatestSweep, getFlaggedPosts, subscribeToNewSweeps } from '../lib/api'
import { MOCK_SWEEPS, MOCK_POSTS } from '../lib/mockData'
import type { Sweep, FlaggedPost } from '../lib/types'

const VISIBLE_POST_LIMIT = 3

/**
 * Main feed page showing the latest sweep and its flagged posts.
 * Uses mock data when Supabase env vars are not configured.
 */
export function FeedPage() {
  const navigate = useNavigate()
  const [sweep, setSweep] = useState<Sweep | null>(null)
  const [posts, setPosts] = useState<FlaggedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      if (IS_MOCK_MODE) {
        setSweep(MOCK_SWEEPS[0] ?? null)
        setPosts(MOCK_POSTS.filter((p) => p.sweep_id === MOCK_SWEEPS[0]?.id))
        setLoading(false)
        return
      }

      try {
        const latestSweep = await getLatestSweep()
        if (cancelled) return
        setSweep(latestSweep)

        if (latestSweep) {
          const flaggedPosts = await getFlaggedPosts(latestSweep.id)
          if (cancelled) return
          setPosts(flaggedPosts)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          setToastMessage(`Load failed: ${message}`)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (IS_MOCK_MODE) return

    const unsubscribe = subscribeToNewSweeps((newSweep) => {
      setSweep(newSweep)
      setToastMessage(`New sweep: ${newSweep.flag_count} flags detected`)
      getFlaggedPosts(newSweep.id)
        .then(setPosts)
        .catch(() => { /* toast already shown for new sweep */ })
    })

    return unsubscribe
  }, [])

  const handleDismissToast = useCallback(() => {
    setToastMessage(null)
  }, [])

  const visiblePosts = posts.slice(0, VISIBLE_POST_LIMIT)
  const remainingCount = posts.length - VISIBLE_POST_LIMIT

  return (
    <div style={{ paddingBottom: '72px' }}>
      <AppHeader sweep={sweep ?? undefined} />

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={handleDismissToast} />
      )}

      {loading ? (
        <SkeletonFeed />
      ) : (
        <div style={{ padding: '0.7rem 1rem 0.5rem 1rem' }}>
          {sweep && <SweepNode sweep={sweep} />}

          {/* Timeline rail */}
          <div
            style={{
              position: 'relative',
              paddingLeft: '1.5rem',
            }}
          >
            {/* Vertical timeline line */}
            <div
              style={{
                position: 'absolute',
                left: '9px',
                top: 0,
                bottom: 0,
                width: '1px',
                background: 'var(--sepc)',
              }}
            />

            {visiblePosts.map((post) => (
              <EventItem key={post.id} post={post} />
            ))}

            {remainingCount > 0 && (
              <MoreIndicator count={remainingCount} />
            )}
          </div>

          {!sweep && !loading && (
            <p
              style={{
                textAlign: 'center',
                color: 'var(--t3)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                padding: '2rem 0',
              }}
            >
              No sweeps recorded yet
            </p>
          )}
        </div>
      )}

      <FAB onClick={() => { /* search placeholder */ }} />
      <BottomNav active="feed" onNavigate={(tab) => {
        if (tab === 'history') navigate('/history')
        else if (tab === 'settings') navigate('/settings')
      }} />
    </div>
  )
}
