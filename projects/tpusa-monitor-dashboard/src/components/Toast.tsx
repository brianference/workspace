import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDismiss: () => void
}

const AUTO_DISMISS_MS = 5000

/**
 * Notification toast that slides in from the top,
 * shows a pulsing accent dot, message, and timestamp,
 * then auto-dismisses after 5 seconds.
 */
export function Toast({ message, onDismiss }: ToastProps) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const dismissTimer = window.setTimeout(() => {
      setExiting(true)
    }, AUTO_DISMISS_MS)

    return () => {
      window.clearTimeout(dismissTimer)
    }
  }, [])

  useEffect(() => {
    if (!exiting) return

    const exitTimer = window.setTimeout(() => {
      onDismiss()
    }, 300)

    return () => {
      window.clearTimeout(exitTimer)
    }
  }, [exiting, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        margin: '0.5rem 0.8rem 0',
        padding: '0.6rem 0.85rem',
        borderRadius: '14px',
        background: 'color-mix(in srgb, var(--accent) 10%, var(--card))',
        border: '1px solid color-mix(in srgb, var(--accent) 22%, transparent)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        backdropFilter: 'blur(12px)',
        animation: exiting
          ? 'toast-slide-out 0.3s ease-in forwards'
          : 'toast-slide-in 0.3s ease-out',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'var(--accent)',
          animation: 'throb 2s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          color: 'var(--t1)',
          flex: 1,
        }}
      >
        {message}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.56rem',
          color: 'var(--t3)',
        }}
      >
        just now
      </span>
    </div>
  )
}
