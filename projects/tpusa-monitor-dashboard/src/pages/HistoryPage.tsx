import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { EventItem } from '../components/EventItem'
import { IS_MOCK_MODE } from '../lib/supabase'
import { getSweepHistory, getFlaggedPosts } from '../lib/api'
import { MOCK_SWEEPS, MOCK_POSTS } from '../lib/mockData'
import type { Sweep, FlaggedPost } from '../lib/types'

/**
 * Sweep history page. Lists all sweeps; tap any row to expand
 * and see every flagged post from that sweep.
 */
export function HistoryPage() {
  const navigate = useNavigate()
  const [sweeps, setSweeps] = useState<Sweep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (IS_MOCK_MODE) {
        setSweeps(MOCK_SWEEPS)
        setLoading(false)
        return
      }

      try {
        const data = await getSweepHistory(50)
        if (!cancelled) setSweeps(data)
      } catch {
        /* fail silently */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ paddingBottom: '72px' }}>
      <header
        style={{
          padding: '0.8rem 1.1rem 0.6rem',
          borderBottom: '1px solid var(--sepc)',
          position: 'sticky',
          top: 0,
          background: 'var(--bg)',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: "'Calistoga', serif",
            fontSize: '1.2rem',
            color: 'var(--t1)',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Sweep History
        </h1>
      </header>

      <div style={{ padding: '0.5rem 1rem' }}>
        {loading ? (
          <HistorySkeleton />
        ) : sweeps.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: 'var(--t3)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              padding: '2rem 0',
            }}
          >
            No sweep history yet
          </p>
        ) : (
          sweeps.map((sweep) => (
            <SweepAccordion key={sweep.id} sweep={sweep} />
          ))
        )}
      </div>

      <BottomNav active="history" onNavigate={(tab) => {
        if (tab === 'feed') navigate('/')
        else if (tab === 'settings') navigate('/settings')
      }} />
    </div>
  )
}

/** Expandable sweep row that lazily loads and shows its flagged posts */
function SweepAccordion({ sweep }: { sweep: Sweep }) {
  const [open, setOpen] = useState(false)
  const [posts, setPosts] = useState<FlaggedPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  const handleToggle = useCallback(async () => {
    const nextOpen = !open
    setOpen(nextOpen)

    if (nextOpen && posts.length === 0 && !loadingPosts) {
      setLoadingPosts(true)
      try {
        if (IS_MOCK_MODE) {
          setPosts(MOCK_POSTS.filter((p) => p.sweep_id === sweep.id))
        } else {
          const data = await getFlaggedPosts(sweep.id)
          setPosts(data)
        }
      } catch {
        /* show nothing on error */
      } finally {
        setLoadingPosts(false)
      }
    }
  }, [open, posts.length, loadingPosts, sweep.id])

  const date = new Date(sweep.created_at)
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timeLabel = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div style={{ borderBottom: '1px solid var(--sepc)' }}>
      {/* Sweep row header -- tappable */}
      <button
        type="button"
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.6rem 0',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          minHeight: '44px',
        }}
        aria-expanded={open}
        aria-label={`Sweep ${dateLabel} ${timeLabel} — ${sweep.flag_count} flags`}
      >
        {/* Chevron */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            color: 'var(--t4)',
            flexShrink: 0,
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>

        {/* Date + time */}
        <div style={{ minWidth: '72px' }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--t1)',
            }}
          >
            {dateLabel}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.55rem',
              color: 'var(--t3)',
            }}
          >
            {timeLabel}
          </div>
        </div>

        {/* Flag count badge */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.58rem',
            fontWeight: 700,
            padding: '3px 7px',
            borderRadius: '6px',
            background: sweep.flag_count > 0
              ? 'color-mix(in srgb, var(--danger) 12%, transparent)'
              : 'color-mix(in srgb, var(--t4) 15%, transparent)',
            border: sweep.flag_count > 0
              ? '1px solid color-mix(in srgb, var(--danger) 26%, transparent)'
              : '1px solid var(--sepc)',
            color: sweep.flag_count > 0 ? 'var(--danger)' : 'var(--t3)',
            flexShrink: 0,
          }}
        >
          {sweep.flag_count}
        </div>

        {/* Breakdown */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'var(--t3)',
            flex: 1,
          }}
        >
          {sweep.legal_count} legal &middot; {sweep.mention_count} mention &middot; {sweep.org_count} org
        </div>
      </button>

      {/* Expanded post list */}
      {open && (
        <div style={{ paddingBottom: '0.5rem', paddingLeft: '1rem' }}>
          {loadingPosts ? (
            <PostsLoadingDots />
          ) : posts.length === 0 ? (
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                color: 'var(--t3)',
                padding: '0.4rem 0 0.6rem',
                margin: 0,
              }}
            >
              No flagged posts for this sweep
            </p>
          ) : (
            <div
              style={{
                position: 'relative',
                paddingLeft: '1.5rem',
              }}
            >
              {/* Timeline rail */}
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
              {posts.map((post) => (
                <EventItem key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Three dots while fetching posts */
function PostsLoadingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '0.5rem 0' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'var(--accent)',
            opacity: 0.6,
            animation: `skeleton-pulse 1.2s ease-in-out infinite ${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

/** Skeleton loading state for the history list */
function HistorySkeleton() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.55rem 0',
            borderBottom: '1px solid var(--sepc)',
          }}
        >
          <div style={{ minWidth: '72px' }}>
            <div
              style={{
                width: '50px',
                height: '10px',
                borderRadius: '3px',
                background: 'var(--t4)',
                opacity: 0.3,
                animation: `skeleton-pulse 1.5s ease-in-out infinite ${i * 0.1}s`,
                marginBottom: '4px',
              }}
            />
            <div
              style={{
                width: '35px',
                height: '8px',
                borderRadius: '3px',
                background: 'var(--t4)',
                opacity: 0.3,
                animation: `skeleton-pulse 1.5s ease-in-out infinite ${i * 0.1 + 0.05}s`,
              }}
            />
          </div>
          <div
            style={{
              width: '24px',
              height: '20px',
              borderRadius: '6px',
              background: 'var(--t4)',
              opacity: 0.3,
              animation: `skeleton-pulse 1.5s ease-in-out infinite ${i * 0.1 + 0.1}s`,
            }}
          />
          <div
            style={{
              width: '60%',
              height: '8px',
              borderRadius: '3px',
              background: 'var(--t4)',
              opacity: 0.3,
              animation: `skeleton-pulse 1.5s ease-in-out infinite ${i * 0.1 + 0.15}s`,
            }}
          />
        </div>
      ))}
    </>
  )
}
