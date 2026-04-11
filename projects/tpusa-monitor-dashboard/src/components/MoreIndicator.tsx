interface MoreIndicatorProps {
  count: number
}

/**
 * Three vertical dots with "N more flags this sweep" label
 * and a "See all" link in accent color.
 */
export function MoreIndicator({ count }: MoreIndicatorProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        padding: '0.3rem 0 0.5rem',
      }}
    >
      {/* Three dots column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          alignItems: 'center',
          width: '18px',
          marginLeft: '-1.5rem',
        }}
      >
        <span style={dotStyle} />
        <span style={dotStyle} />
        <span style={dotStyle} />
      </div>

      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: 'var(--t3)',
        }}
      >
        {count} more flags this sweep
      </span>

      <a
        href="#"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          fontWeight: 700,
          color: 'var(--accent)',
          textDecoration: 'none',
          marginLeft: 'auto',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        See all &rarr;
      </a>
    </div>
  )
}

const dotStyle: React.CSSProperties = {
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  background: 'var(--t4)',
}
