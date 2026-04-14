import { useTheme } from '../hooks/useTheme'
import type { Sweep } from '../lib/types'

interface AppHeaderProps {
  sweep?: Sweep
}

/**
 * App header with eyebrow label, title, last sweep time,
 * a pulsing "Live" chip, and a sun/moon theme toggle.
 */
export function AppHeader({ sweep }: AppHeaderProps) {
  const lastSweepLabel = formatSweepTiming(sweep)
  const { theme, toggleTheme } = useTheme()

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

      {/* Right side: theme toggle + LIVE chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* Sun/moon toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: '1px solid var(--sepc)',
            background: 'var(--card)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--t3)',
            padding: 0,
          }}
        >
          {theme === 'dark' ? (
            /* Sun icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* LIVE chip */}
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
