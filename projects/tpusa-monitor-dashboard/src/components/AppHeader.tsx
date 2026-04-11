import type { Sweep } from '../lib/types'

interface AppHeaderProps {
  sweep?: Sweep
}

/**
 * App header with eyebrow label, title, last sweep time,
 * and a pulsing "Live" chip.
 */
export function AppHeader({ sweep }: AppHeaderProps) {
  const lastSweepLabel = formatSweepTiming(sweep)

  return (
    <header
      style={{
        padding: '0.7rem 1.1rem 0.55rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--sepc)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.58rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            color: 'var(--t3)',
            marginBottom: '2px',
          }}
        >
          Kirk Monitor
        </div>
        <div
          style={{
            fontFamily: "'Calistoga', serif",
            fontSize: '1.35rem',
            lineHeight: 1,
            color: 'var(--t1)',
          }}
        >
          TPUSA <span style={{ color: 'var(--accent)' }}>&amp;</span> Kirk
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.57rem',
            color: 'var(--t3)',
            marginTop: '3px',
          }}
        >
          {lastSweepLabel}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '5px 10px',
          borderRadius: '20px',
          background: 'color-mix(in srgb, var(--accent) 11%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent) 26%, transparent)',
          color: 'var(--accent)',
          fontSize: '0.6rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'var(--accent)',
            animation: 'throb 2s ease-in-out infinite',
          }}
        />
        Live
      </div>
    </header>
  )
}

/**
 * Formats sweep timing as "Last sweep HH:MM · next in Xh Xm"
 * using the sweep's created_at timestamp and a 6-hour interval.
 */
function formatSweepTiming(sweep?: Sweep): string {
  if (!sweep) {
    return 'No sweeps yet'
  }

  const sweepDate = new Date(sweep.created_at)
  const hours = sweepDate.getHours().toString().padStart(2, '0')
  const minutes = sweepDate.getMinutes().toString().padStart(2, '0')

  const SWEEP_INTERVAL_MS = 6 * 60 * 60 * 1000
  const nextSweep = new Date(sweepDate.getTime() + SWEEP_INTERVAL_MS)
  const now = new Date()
  const diffMs = nextSweep.getTime() - now.getTime()

  if (diffMs <= 0) {
    return `Last sweep ${hours}:${minutes} · sweep overdue`
  }

  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return `Last sweep ${hours}:${minutes} · next in ${diffH}h ${diffM}m`
}
