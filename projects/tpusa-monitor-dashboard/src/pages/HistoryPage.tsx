import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { IS_MOCK_MODE } from '../lib/supabase'
import { getSweepHistory } from '../lib/api'
import { MOCK_SWEEPS } from '../lib/mockData'
import type { Sweep } from '../lib/types'

/**
 * Sweep history page showing past sweeps in a table-like list.
 * Each row shows date, time, flag count badge, and category breakdown.
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
        const data = await getSweepHistory(20)
        if (!cancelled) setSweeps(data)
      } catch {
        /* fail silently for history -- feed page shows errors */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div style={{ paddingBottom: '72px' }}>
      {/* Header */}
      <header
        style={{
          padding: '0.8rem 1.1rem 0.6rem',
          borderBottom: '1px solid var(--sepc)',
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

      {/* Content */}
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
            <SweepRow key={sweep.id} sweep={sweep} />
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

/** Single sweep row in the history list */
function SweepRow({ sweep }: { sweep: Sweep }) {
  const date = new Date(sweep.created_at)
  const dateLabel = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const timeLabel = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.55rem 0',
        borderBottom: '1px solid var(--sepc)',
      }}
    >
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
          background: 'color-mix(in srgb, var(--danger) 12%, transparent)',
          border: '1px solid color-mix(in srgb, var(--danger) 26%, transparent)',
          color: 'var(--danger)',
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
