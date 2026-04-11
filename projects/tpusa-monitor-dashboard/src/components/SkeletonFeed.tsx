/**
 * Shows 3 skeleton event items with grey pulsing bars
 * in place of real content. Used while data is loading.
 */
export function SkeletonFeed() {
  return (
    <div style={{ padding: '0.7rem 1rem 0.5rem 1rem' }}>
      {/* Skeleton sweep node */}
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
        <SkeletonBox width={20} height={20} borderRadius="5px" />
        <div style={{ flex: 1 }}>
          <SkeletonBox width={140} height={10} borderRadius="3px" />
          <SkeletonBox width={100} height={8} borderRadius="3px" style={{ marginTop: '4px' }} />
        </div>
        <SkeletonBox width={50} height={20} borderRadius="6px" />
      </div>

      {/* Skeleton events */}
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div
          style={{
            position: 'absolute',
            left: '9px',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'var(--t4)',
            opacity: 0.3,
          }}
        />
        {[0, 1, 2].map((i) => (
          <SkeletonEvent key={i} />
        ))}
      </div>
    </div>
  )
}

/** Single skeleton event card */
function SkeletonEvent() {
  return (
    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
      <div
        style={{
          position: 'absolute',
          left: '-1.5rem',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'var(--t4)',
          opacity: 0.3,
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          background: 'var(--card)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '3px',
            background: 'var(--t4)',
            opacity: 0.3,
            flexShrink: 0,
            alignSelf: 'stretch',
          }}
        />
        <div style={{ padding: '0.65rem 0.8rem 0.7rem', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <SkeletonBox width={100} height={12} borderRadius="3px" />
            <SkeletonBox width={40} height={10} borderRadius="3px" />
          </div>
          <SkeletonBox width="100%" height={10} borderRadius="3px" />
          <SkeletonBox width="80%" height={10} borderRadius="3px" style={{ marginTop: '6px' }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              <SkeletonBox width={48} height={16} borderRadius="4px" />
              <SkeletonBox width={48} height={16} borderRadius="4px" />
            </div>
            <SkeletonBox width={50} height={22} borderRadius="7px" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface SkeletonBoxProps {
  width: number | string
  height: number
  borderRadius: string
  style?: React.CSSProperties
}

/** Animated skeleton placeholder box */
function SkeletonBox({ width, height, borderRadius, style }: SkeletonBoxProps) {
  return (
    <div
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
        borderRadius,
        background: 'var(--t4)',
        opacity: 0.3,
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  )
}
