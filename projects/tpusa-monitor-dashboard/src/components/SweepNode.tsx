import type { Sweep } from '../lib/types'

interface SweepNodeProps {
  sweep: Sweep
}

/**
 * Diamond-shaped sweep milestone marker with stats and flag badge.
 */
export function SweepNode({ sweep }: SweepNodeProps) {
  const sweepDate = new Date(sweep.created_at)
  const month = sweepDate.toLocaleString('en-US', { month: 'short' })
  const day = sweepDate.getDate()
  const hours = sweepDate.getHours().toString().padStart(2, '0')
  const minutes = sweepDate.getMinutes().toString().padStart(2, '0')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        marginBottom: '0.7rem',
        paddingBottom: '0.6rem',
        borderBottom: '1px solid var(--sepc)',
      }}
    >
      {/* Diamond shape */}
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '5px',
          border: '2px solid var(--accent)',
          background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
          transform: 'rotate(45deg)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '1px',
            background: 'var(--accent)',
            transform: 'rotate(-45deg)',
          }}
        />
      </div>

      {/* Sweep info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.62rem',
            fontWeight: 600,
            color: 'var(--t2)',
            letterSpacing: '0.04em',
          }}
        >
          Sweep &middot; {month} {day} &middot; {hours}:{minutes}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'var(--t3)',
            marginTop: '1px',
          }}
        >
          {sweep.legal_count} legal &middot; {sweep.mention_count} mentions &middot; {sweep.org_count} org refs
        </div>
      </div>

      {/* Flag badge */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '6px',
          background: 'color-mix(in srgb, var(--danger) 12%, transparent)',
          border: '1px solid color-mix(in srgb, var(--danger) 26%, transparent)',
          color: 'var(--danger)',
        }}
      >
        {sweep.flag_count} flags
      </div>
    </div>
  )
}
