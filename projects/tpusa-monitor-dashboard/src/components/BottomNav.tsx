type NavTab = 'feed' | 'history' | 'settings'

interface BottomNavProps {
  active: NavTab
  onNavigate: (tab: NavTab) => void
}

/**
 * Glass-blur bottom navigation bar with three tabs:
 * Feed (home), History (clock), Settings (gear).
 * Active tab shows accent color and top indicator bar.
 */
export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        background: 'var(--nav)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--sepc)',
        zIndex: 10,
      }}
    >
      <NavButton
        tab="feed"
        label="Feed"
        active={active === 'feed'}
        onClick={() => onNavigate('feed')}
        icon={<HomeIcon />}
      />
      <NavButton
        tab="history"
        label="History"
        active={active === 'history'}
        onClick={() => onNavigate('history')}
        icon={<ClockIcon />}
      />
      <NavButton
        tab="settings"
        label="Settings"
        active={active === 'settings'}
        onClick={() => onNavigate('settings')}
        icon={<GearIcon />}
      />
    </nav>
  )
}

interface NavButtonProps {
  tab: NavTab
  label: string
  active: boolean
  onClick: () => void
  icon: React.ReactNode
}

/** Individual navigation tab button */
function NavButton({ label, active, onClick, icon }: NavButtonProps) {
  const color = active ? 'var(--accent)' : 'var(--t4)'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        padding: '7px 4px 12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        minHeight: '56px',
        minWidth: '44px',
        color,
        position: 'relative',
      }}
    >
      {active && (
        <span
          style={{
            width: '18px',
            height: '2px',
            borderRadius: '1px',
            background: 'var(--accent)',
            marginBottom: '-2px',
          }}
        />
      )}
      <span style={{ color }}>{icon}</span>
      <span
        style={{
          fontSize: '0.56rem',
          fontWeight: 500,
          color,
        }}
      >
        {label}
      </span>
    </button>
  )
}

/** Home icon (SVG) */
function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

/** Clock icon (SVG) */
function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

/** Gear/settings icon (SVG) */
function GearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}
