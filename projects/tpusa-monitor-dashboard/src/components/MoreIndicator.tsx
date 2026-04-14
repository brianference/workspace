interface MoreIndicatorProps {
  count: number
  onSeeAll: () => void
}

/**
 * Three vertical dots with "N more flags this sweep" label
 * and a "See all" button that navigates to the full post list.
 */
export function MoreIndicator({ count, onSeeAll }: MoreIndicatorProps) {
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

      <button
        onClick={onSeeAll}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          fontWeight: 700,
          color: 'var(--accent)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          marginLeft: 'auto',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label={`See all ${count + 5} flagged posts`}
      >
        See all &rarr;
      </button>
    </div>
  )
}

const dotStyle: React.CSSProperties = {
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  background: 'var(--t4)',
}
