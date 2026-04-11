interface FABProps {
  onClick: () => void
}

/**
 * Floating action button with search icon.
 * 42px circle, accent background, positioned fixed
 * above the bottom nav bar.
 */
export function FAB({ onClick }: FABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '42px',
        height: '42px',
        borderRadius: '21px',
        background: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 36%, transparent)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        zIndex: 5,
        padding: 0,
        minHeight: '44px',
        minWidth: '44px',
      }}
    >
      <span role="img" aria-hidden="true">
        &#x1F50D;
      </span>
    </button>
  )
}
