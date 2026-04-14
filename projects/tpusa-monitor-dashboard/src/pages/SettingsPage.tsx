import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { IS_MOCK_MODE } from '../lib/supabase'
import { getLatestSweep } from '../lib/api'
import { MOCK_SWEEPS } from '../lib/mockData'

const SWEEP_INTERVAL_MS = 6 * 60 * 60 * 1000
const APP_VERSION = '1.0.0'

/**
 * Settings page with dark/light toggle, next sweep countdown,
 * and about information.
 */
export function SettingsPage() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState<string>('--:--:--')

  useEffect(() => {
    let cancelled = false
    let intervalId: number

    async function loadAndStartCountdown() {
      let sweepTime: Date | null = null

      if (IS_MOCK_MODE) {
        sweepTime = new Date(MOCK_SWEEPS[0]?.created_at ?? Date.now())
      } else {
        try {
          const sweep = await getLatestSweep()
          if (sweep) {
            sweepTime = new Date(sweep.created_at)
          }
        } catch {
          /* use fallback */
        }
      }

      if (cancelled) return

      if (!sweepTime) {
        setCountdown('No data')
        return
      }

      const nextSweepMs = sweepTime.getTime() + SWEEP_INTERVAL_MS

      function tick() {
        const remaining = nextSweepMs - Date.now()
        if (remaining <= 0) {
          setCountdown('Sweep due')
          return
        }

        const h = Math.floor(remaining / (1000 * 60 * 60))
        const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((remaining % (1000 * 60)) / 1000)
        setCountdown(
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        )
      }

      tick()
      intervalId = window.setInterval(tick, 1000)
    }

    loadAndStartCountdown()

    return () => {
      cancelled = true
      if (intervalId) window.clearInterval(intervalId)
    }
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
          Settings
        </h1>
      </header>

      <div style={{ padding: '0.8rem 1.1rem' }}>
        {/* Next sweep countdown */}
        <SettingsRow label="Next sweep">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent)',
              letterSpacing: '0.06em',
            }}
          >
            {countdown}
          </span>
        </SettingsRow>

        {/* Data mode */}
        <SettingsRow label="Data mode">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '6px',
              background: IS_MOCK_MODE
                ? 'color-mix(in srgb, var(--danger) 12%, transparent)'
                : 'color-mix(in srgb, var(--accent) 12%, transparent)',
              color: IS_MOCK_MODE ? 'var(--danger)' : 'var(--accent)',
            }}
          >
            {IS_MOCK_MODE ? 'Mock data' : 'Supabase live'}
          </span>
        </SettingsRow>

        {/* About section */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.7rem 0.8rem',
            borderRadius: '12px',
            background: 'var(--card)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <h2
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--t3)',
              margin: '0 0 0.5rem',
            }}
          >
            About
          </h2>
          <InfoRow label="Version" value={APP_VERSION} />
          <InfoRow label="Agent" value="TPUSA & Kirk Monitor" />
          <InfoRow label="Sweep interval" value="Every 6 hours" />
          <InfoRow label="Data source" value="X / Twitter via x-search MCP" />
        </div>
      </div>

      <BottomNav active="settings" onNavigate={(tab) => {
        if (tab === 'feed') navigate('/')
        else if (tab === 'history') navigate('/history')
      }} />
    </div>
  )
}

/** Settings row with label on left and content on right */
function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 0',
        borderBottom: '1px solid var(--sepc)',
      }}
    >
      <span
        style={{
          fontSize: '0.76rem',
          fontWeight: 500,
          color: 'var(--t1)',
        }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}

/** Key-value info row for the About section */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.3rem 0',
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.58rem',
          color: 'var(--t3)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.58rem',
          color: 'var(--t2)',
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  )
}
